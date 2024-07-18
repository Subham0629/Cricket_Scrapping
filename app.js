const express = require("express");
const data = require("./output.json");
const detailData = require("./output_cricket_detail.json");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "score_scrap",
  password: "user",
  port: 5433,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database.");
});

const eventD = data;
const eventData = eventD;

async function insertLiveCricketData() {
  try {
    await pool.connect();
    const query = `
          INSERT INTO live_cricket (event_name, matches, head)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;

    for (const event of eventData) {
      const values = [
        event.Event,
        JSON.stringify(event.matches),
        JSON.stringify(event.head),
      ];
      const res = await pool.query(query, values);
      console.log("Inserted row:", res.rows[0]);
    }
  } catch (err) {
    console.error("Error inserting data:", err.stack);
  } finally {
    await pool.end();
  }
}
insertLiveCricketData();

async function insertCricketDetailData() {
  const client = await pool.connect();
  try {
    for (const item of detailData) {
      const { head, values } = item;
      await client.query(
        "INSERT INTO cricket_detail (head, values) VALUES ($1, $2)",
        [head, JSON.stringify(values)]
      );
    }
  } finally {
    client.release();
  }
}
insertCricketDetailData();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
