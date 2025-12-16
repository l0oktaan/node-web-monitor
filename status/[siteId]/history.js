const { sql } = require("@vercel/postgres");

module.exports = async (req, res) => {
  const siteId = Number(req.query.siteId);
  const limit = Math.min(Number(req.query.limit || 50), 500);

  const { rows } = await sql`
    SELECT * FROM checks
    WHERE site_id = ${siteId}
    ORDER BY checked_at DESC
    LIMIT ${limit}
  `;
  res.json(rows);
};
