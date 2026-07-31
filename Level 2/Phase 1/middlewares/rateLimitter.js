import { redis } from "../index.js";

const rateLimmiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;
  const requests = await redis.incr(key);

  // Set the TTL to 30 seconds only if the key doesn't already have an expiry (using the NX option).
  // This is a self-healing mechanism that prevents keys from getting stuck with a TTL of -1.
  await redis.expire(key, 30, "NX");

  if (requests > 5) {
    return res.status(429).json({ message: "Request Limit Exceeded" });
  }
  next();
};

export default rateLimmiter;
