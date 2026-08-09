import urllib.request
import json

url = "https://api.groq.com/openai/v1/models"
req = urllib.request.Request(url)
req.add_header('Authorization', 'Bearer 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')

try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    models = [m['id'] for m in data['data']]
    print("AVAILABLE MODELS:")
    for m in models:
        print(m)
except Exception as e:
    print("Error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))
