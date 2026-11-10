import express from "express";
import pg from "pg";

const app = express();
const { Pool } = pg;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Buynexe Affiliate OS</h1>
    <p>Affiliate CRM Server is running.</p>
    <p>Database status: <a href="/health">Check here</a></p>
  `);
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");
    res.json({ status: "OK", database: "Connected" });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Database connection failed"
    });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const { id, campaignId, campaignName, name, email, source, affiliateUrl } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }

    await pool.query(
      `INSERT INTO leads
      (id, "campaignId", "campaignName", name, email, source, "affiliateUrl")
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        id || crypto.randomUUID(),
        campaignId || null,
        campaignName || null,
        name,
        email,
        source || "Website",
        affiliateUrl || null
      ]
    );

    res.json({ success: true, message: "Lead captured" });
  } catch (error) {
    res.status(500).json({ error: "Lead could not be saved" });
  }
});

app.get("/api/campaigns", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, network, status FROM campaigns ORDER BY name"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Could not load campaigns" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Buynexe Affiliate OS running on port " + PORT);
});
