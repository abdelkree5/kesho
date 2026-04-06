import json
import urllib.request
import urllib.error

url = 'http://127.0.0.1:8000/auth/register'
data = {
    'email': 'test@example.com',
    'password': 'Password123!',
    'device_id': 'device-001',
    'device_info': 'Windows Test'
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as res:
        print('status', res.status)
        print(res.read().decode())
except urllib.error.HTTPError as e:
    print('status', e.code)
    print(e.read().decode())
except Exception as e:
    print('ERROR', repr(e))
