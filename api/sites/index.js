const { sql } = require("@vercel/postgres");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { rows } = await sql`SELECT * FROM sites ORDER BY id DESC`;
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { name, url } = req.body || {};
    if (!name || !url) {
      return res.status(400).json({ message: "name and url required" });
    }

    const { rows } = await sql`
      INSERT INTO sites (name, url)
      VALUES (${name}, ${url})
      RETURNING id
    `;
    return res.status(200).json({ id: rows[0].id });
  }

  res.status(405).end();
};
