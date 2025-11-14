import { createClient } from "redis";

let client;

export async function getRedisClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis Error:", err));
    await client.connect();
  }
  return client;
}

export async function setCache(key, value, ttl = 60) {
  const redis = await getRedisClient();
  await redis.setEx(key, ttl, JSON.stringify(value));
}

export async function getCache(key) {
  const redis = await getRedisClient();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}
