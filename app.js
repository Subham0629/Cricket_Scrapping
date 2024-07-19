const express = require("express");
const data = require("./output.json");
const detailData = require("./output_cricket_detail.json");
const footballLive = require("./football_live.json");
const ttLive = require("./table_tennis_live.json");
const tennisLive = require("./tennis_live.json");
const basketBallLive = require("./basketball_live.json");
const volleyBallLive = require("./volleyball_live.json");
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

const eventData = data;

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
// insertLiveCricketData();

const liveFootballData = footballLive;
async function insertLiveFootballData() {
  try {
    await pool.connect();
    const query = `
          INSERT INTO live_football (event_name, matches, head)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;

    for (const event of liveFootballData) {
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
// insertLiveFootballData();

const liveTableTennisData = ttLive;
async function insertLiveTtData() {
  try {
    await pool.connect();
    const query = `
          INSERT INTO live_table_tennis (event_name, matches, head)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;

    for (const event of liveTableTennisData) {
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
// insertLiveTtData();
const liveTennisData = tennisLive;
async function insertLiveTennisData() {
  try {
    await pool.connect();
    const query = `
          INSERT INTO live_tennis (event_name, matches, head)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;

    for (const event of liveTennisData) {
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
// insertLiveTennisData()
const liveBasketBallData = basketBallLive;
async function insertBasketBallData() {
  try {
    await pool.connect();
    const query = `
          INSERT INTO live_basketball (event_name, matches, head)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;

    for (const event of liveBasketBallData) {
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
// insertLiveBasketBallData()
const liveVolleyBallData = volleyBallLive;
async function insertLiveVolleyBallData() {
  try {
    await pool.connect();
    const query = `
          INSERT INTO live_volleyball (event_name, matches, head)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;

    for (const event of liveVolleyBallData) {
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
insertLiveVolleyBallData();

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
// insertCricketDetailData();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
