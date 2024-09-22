const Redis = require("ioredis");
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 12683,
  password: process.env.REDIS_PASSWORD,
});
module.exports = redis;
