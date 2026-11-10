
import express from "express";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

app.get("/", (req, res) => {
  res.send("Buynexe Affiliate OS is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "running",
    database: pool ? "configured" : "not configured"
  });
});

app.get("/api/campaigns", async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM campaigns ORDER BY "createdAt" DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Could not load campaigns" });
  }
});

app.get("/api/leads", async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM leads ORDER BY "createdAt" DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Could not load leads" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
