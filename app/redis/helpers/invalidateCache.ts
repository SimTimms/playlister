import redisClient from "../redisClient";

const invalidateCache = async (key: string): Promise<void> => {
  if (!key) {
    console.warn("Cache key is not defined.");
    return;
  }
  const redis = await redisClient(
    process.env.REDIS_URI as string,
    process.env.REDIS_PASSWORD as string
  );
  await redis.del(key);
};

export default invalidateCache;
