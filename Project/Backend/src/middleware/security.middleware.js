const requestBuckets = new Map();

export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-XSS-Protection", "0");
  next();
};

export const createRateLimiter = ({
  windowMs = 60_000,
  maxRequests = 60,
  message = "Too many requests. Please wait and try again.",
} = {}) => {
  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl || req.path}`;
    const now = Date.now();
    const bucket = requestBuckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (bucket.resetAt <= now) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    requestBuckets.set(key, bucket);

    if (bucket.count > maxRequests) {
      return res.status(429).json({ error: message });
    }

    next();
  };
};
