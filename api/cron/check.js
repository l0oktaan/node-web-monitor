const axios = require("axios");
const { sql } = require("@vercel/postgres");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

module.exports = async (req, res) => {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const { rows: sites } = await sql`
    SELECT id, url, timeout_ms, delay_ms
    FROM sites WHERE enabled = TRUE
  `;

  for (const s of sites) {
    const start = Date.now();
    try {
      const r = await axios.get(s.url, { timeout: s.timeout_ms });
      await sql`
        INSERT INTO checks (site_id, ok, status_code, response_ms)
        VALUES (${s.id}, true, ${r.status}, ${Date.now() - start})
      `;
    } catch (e) {
      await sql`
        INSERT INTO checks (site_id, ok, response_ms, error)
        VALUES (${s.id}, false, ${Date.now() - start}, ${e.message})
      `;
    }
    await sleep(s.delay_ms);
  }

  res.json({ ok: true, checked: sites.length });
};
