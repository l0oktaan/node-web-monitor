const { sql } = require("@vercel/postgres");

module.exports = async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ message: "invalid id" });

  if (req.method === "PATCH") {
    const b = req.body || {};
    const { rowCount } = await sql`
      UPDATE sites SET
        name = COALESCE(${b.name ?? null}, name),
        url = COALESCE(${b.url ?? null}, url),
        enabled = COALESCE(${b.enabled ?? null}, enabled),
        timeout_ms = COALESCE(${b.timeout_ms ?? null}, timeout_ms),
        delay_ms = COALESCE(${b.delay_ms ?? null}, delay_ms)
      WHERE id = ${id}
    `;
    return res.status(rowCount ? 200 : 404).json({ ok: !!rowCount });
  }

  if (req.method === "DELETE") {
    await sql`DELETE FROM sites WHERE id = ${id}`;
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
};
