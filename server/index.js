const keys = require("./keys");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  port: keys.pgPort,
  password: keys.pgPassword,
});

pgClient.on("error", () => {
  console.error("Pg connection losts");
});

pgClient.query("CREATE TABLE IF NOT EXISTS values(number INT)").catch((err) => {
  console.error(err);
});

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => {
    return 1000;
  },
});

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  res.json({ status: 'runing!' })
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/values/current',  async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {

  const index = req.body.index;
  const indexAsInt = parseInt(index, 10);

  if (isNaN(indexAsInt) || !isFinite(indexAsInt) || indexAsInt > 40) {
    return res.status(422).send({ error: 'index too high' })
  }

  redisClient.hset('values', index, 'nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [indexAsInt]);

  res.send({ working: true });
});


app.listen(5000, () => {
  console.log('app started at 5000');
});