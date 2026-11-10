
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

app.get("/health/db", async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: "DATABASE_URL missing" });
  }

  try {
    const result = await pool.query(
      "SELECT NOW() AS time, to_regclass('public.campaigns') AS campaigns_table"
    );

    res.json({
      status: "connected",
      databaseTime: result.rows[0].time,
      campaignsTable: result.rows[0].campaigns_table
    });
  } catch (error) {
    console.error("Database check failed:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

app.get("/api/campaigns", async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM public.campaigns ORDER BY "createdAt" DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Campaign query failed:", error.message);
    res.status(500).json({
      error: "Could not load campaigns",
      detail: error.message
    });
  }
});

app.get("/api/leads", async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: "Database not configured" });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM public.leads ORDER BY "createdAt" DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Lead query failed:", error.message);
    res.status(500).json({
      error: "Could not load leads",
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
