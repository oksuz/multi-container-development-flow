const redis = require("redis");
const keys = require("./keys");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => {
    return 1000;
  },
});

const subscriber = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

subscriber.on('message', (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message, 10)));
});

subscriber.subscribe('insert');