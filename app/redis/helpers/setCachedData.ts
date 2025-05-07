import redisClient from "../redisClient";

const setCachedData = async (
  key: string,
  value: string,
  ttl: number
): Promise<void> => {
  if (!key || !value || !ttl) {
    console.warn(" key, value or TTL not defined.");
    return;
  }
  const redis = await redisClient(
    process.env.REDIS_URI as string,
    process.env.REDIS_PASSWORD as string
  );
  await redis.set(key, value, { EX: ttl }); // EX: sets the expiration time in seconds
};

export default setCachedData;
