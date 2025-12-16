const { sql } = require("@vercel/postgres");

module.exports = async (_, res) => {
  const { rows } = await sql`
    SELECT s.*, c.ok, c.status_code, c.response_ms, c.error, c.checked_at
    FROM sites s
    LEFT JOIN LATERAL (
      SELECT * FROM checks
      WHERE site_id = s.id
      ORDER BY checked_at DESC
      LIMIT 1
    ) c ON TRUE
    ORDER BY s.id DESC
  `;
  res.json(rows);
};
