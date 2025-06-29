// Simple in-memory rate limiting
const requests = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now()
    for (const [key, value] of requests.entries()) {
      if (now > value.resetTime) {
        requests.delete(key)
      }
    }
  },
  5 * 60 * 1000,
)

export function rateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  const record = requests.get(identifier)

  if (!record || now > record.resetTime) {
    // First request or window expired
    requests.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "unknown"
}
