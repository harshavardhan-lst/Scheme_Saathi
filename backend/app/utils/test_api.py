import os
import sys
import httpx
from dotenv import load_dotenv

# Ensure stdout uses UTF-8 for Rupee symbol support
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

BASE_URL = "http://127.0.0.1:8000"
TIMEOUT = 30.0

print("--- SchemeSathi AI Integration Test ---")

# Step 1: Register User
print("\n1. Testing Register...")
register_payload = {
    "name": "Integration Test User",
    "email": "test_user_api@example.com",
    "password": "password123"
}
with httpx.Client(base_url=BASE_URL, timeout=TIMEOUT) as client:
    try:
        r = client.post("/auth/register", json=register_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Error during registration: {e}")

# Step 2: Login User
print("\n2. Testing Login...")
login_payload = {
    "email": "test_user_api@example.com",
    "password": "password123"
}
token = None
with httpx.Client(base_url=BASE_URL, timeout=TIMEOUT) as client:
    try:
        r = client.post("/auth/login", json=login_payload)
        print(f"Status: {r.status_code}")
        resp = r.json()
        print(f"Response: {resp}")
        token = resp.get("access_token")
    except Exception as e:
        print(f"Error during login: {e}")

if not token:
    print("Could not retrieve token. Exiting tests.")
    sys.exit(1)

headers = {"Authorization": f"Bearer {token}"}

# Step 3: Update Profile
print("\n3. Testing Update Profile...")
profile_payload = {
    "age": 30,
    "gender": "Male",
    "income": 120000,
    "occupation": "Farmer",
    "state": "Telangana",
    "category": "OBC",
    "disability": False,
    "language_pref": "en"
}
with httpx.Client(base_url=BASE_URL, headers=headers, timeout=TIMEOUT) as client:
    try:
        r = client.put("/profile", json=profile_payload)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Error during profile update: {e}")

# Step 4: Get Profile
print("\n4. Testing Get Profile...")
with httpx.Client(base_url=BASE_URL, headers=headers, timeout=TIMEOUT) as client:
    try:
        r = client.get("/profile")
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"Error during profile get: {e}")

# Step 5: Get Recommendations
print("\n5. Testing Recommendations...")
with httpx.Client(base_url=BASE_URL, headers=headers, timeout=TIMEOUT) as client:
    try:
        r = client.post("/recommend")
        print(f"Status: {r.status_code}")
        resp = r.json()
        recommendations = resp.get("recommendations", [])
        print(f"Matched {len(recommendations)} schemes.")
        for item in recommendations[:3]:
            print(f"  - {item['scheme_name']} (Score: {item['score']})")
    except Exception as e:
        print(f"Error during recommendations: {e}")

# Step 6: Test Single Eligibility Check
if recommendations:
    scheme_id = recommendations[0]['scheme_id']
    print(f"\n6. Testing Single Eligibility Check for scheme {scheme_id}...")
    with httpx.Client(base_url=BASE_URL, headers=headers, timeout=TIMEOUT) as client:
        try:
            r = client.post("/eligibility", json={"scheme_id": scheme_id})
            print(f"Status: {r.status_code}")
            print(f"Response: {r.json()}")
        except Exception as e:
            print(f"Error during eligibility check: {e}")

# Step 7: Test AI Chat
print("\n7. Testing AI Chat Assistant...")
chat_payload = {"message": "I am a farmer from Telangana. What agricultural benefits can I get?"}
with httpx.Client(base_url=BASE_URL, headers=headers, timeout=TIMEOUT) as client:
    try:
        r = client.post("/chat", json=chat_payload)
        print(f"Status: {r.status_code}")
        resp = r.json()
        print(f"Answer: {resp.get('answer')}")
        print(f"Citations: {resp.get('scheme_refs')}")
    except Exception as e:
        print(f"Error during chat: {e}")
