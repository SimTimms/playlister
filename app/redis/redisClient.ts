import { createClient } from "redis";
import { connectionURLValidator, passwordValidator } from "./validators";
let redisClientInstance: ReturnType<typeof createClient> | null = null;

async function redisClient(
  connectionURL: string,
  password: string
): Promise<ReturnType<typeof createClient>> {
  connectionURLValidator(connectionURL);
  passwordValidator(password);

  if (!redisClientInstance) {
    redisClientInstance = createClient({
      username: "default",
      password: password,
      socket: {
        host: connectionURL,
        port: 11240,
      },
    });

    redisClientInstance.on("error", (err) => {
      console.error("Redis error:", err.message);
    });

    redisClientInstance.on("ready", () => {
      console.log("Redis connected successfully");
    });

    try {
      await redisClientInstance.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw new Error("Redis connection failed");
    }
  }
  return redisClientInstance; // Return the Redis client instance
}

export default redisClient;
