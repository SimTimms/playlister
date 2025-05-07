import redisClient from "../redisClient";

const getCachedData = async (key: string): Promise<string | null> => {
  if (!key) {
    console.warn("Cache key is not defined.");
    return null;
  }

  try {
    const redis = await redisClient(
      process.env.REDIS_URI as string,
      process.env.REDIS_PASSWORD as string
    );
    return await redis.get(key);
  } catch (error) {
    console.error("Error retrieving cache data:", error);
    return null;
  }
};

export default getCachedData;
