import time
import hashlib
import os

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = {}

    def is_allowed(self, client_ip: str) -> bool:
        current_time = int(time.time() // 60)
        key = f"{client_ip}:{current_time}"

        if key not in self.requests:
            self.requests[key] = 0

        self.requests[key] += 1

        # Clean old entries
        old_keys = [k for k in self.requests.keys() if int(k.split(':')[1]) < current_time]
        for k in old_keys:
            del self.requests[k]

        return self.requests[key] <= self.requests_per_minute

# Global rate limiter
rate_limiter = RateLimiter()

def hash_device_id(device_id: str) -> str:
    """Hash device ID for storage"""
    salt = os.getenv("DEVICE_SALT", "default-salt")
    return hashlib.sha256(f"{device_id}{salt}".encode()).hexdigest()