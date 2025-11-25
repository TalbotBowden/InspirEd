"""
firestore_query_test.py
---------------------------------
Queries Firestore's vector search extension and summarizes top matches with Gemini.
"""

import os
import requests
from dotenv import load_dotenv
import google.generativeai as genai
from google.cloud import firestore

# --- Load environment variables ---
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

FIREBASE_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")
STUDIO_GEMINI_KEY = os.getenv("STUDIO_GEMINI_KEY")  # Use Gemini Studio key for summarization
if not FIREBASE_API_KEY or not STUDIO_GEMINI_KEY:
    raise ValueError("❌ Missing API key(s). Make sure both FIREBASE_WEB_API_KEY and STUDIO_GEMINI_KEY are set in .env")

# --- Configure Gemini (for summaries) ---
genai.configure(api_key=STUDIO_GEMINI_KEY)

# --- Firebase Anonymous Sign-In ---
print("🔐 Signing in anonymously to Firebase...")

auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}"
auth_res = requests.post(auth_url, json={})
auth_res.raise_for_status()
id_token = auth_res.json().get("idToken")

# --- Get user query ---
question = input("🤖 Ask a question about pulmonary topics: ").strip()
if not question:
    print("❌ No question entered. Exiting.")
    exit()

print(f"🔎 Querying Firestore for: {question}")

query_url = "https://us-central1-capstone-87b51.cloudfunctions.net/ext-firestore-vector-search-queryCallable"
headers = {"Authorization": f"Bearer {id_token}", "Content-Type": "application/json"}

payload = {
    "data": {
        "query": question,
        "collectionName": "educational",
        "limit": 3
    }
}

res = requests.post(query_url, headers=headers, json=payload)
res.raise_for_status()
result = res.json()
doc_ids = result.get("result", {}).get("ids", [])

if not doc_ids:
    print("⚠️ No matching documents found.")
    exit()

print("\n✅ Top relevant chunks found:")
for doc_id in doc_ids:
    print("-", doc_id)

# --- Connect to Firestore ---
db = firestore.Client(project="capstone-87b51")

# --- Retrieve the matched chunks' text ---
print("\n📄 Fetching text content from Firestore...")
docs_text = []
for doc_id in doc_ids:
    doc_ref = db.collection("educational").document(doc_id)
    doc = doc_ref.get()
    if doc.exists:
        text = doc.to_dict().get("input", "")
        docs_text.append(text)

if not docs_text:
    print("⚠️ No text found for retrieved document IDs.")
    exit()

# --- Combine text and summarize with Gemini ---
combined_text = "\n\n".join(docs_text)
prompt = (
    f"Summarize the following pulmonary information clearly and concisely "
    f"for an educational purpose:\n\n{combined_text}"
)

print("\n🧠 Generating summary with Gemini...\n")
model = genai.GenerativeModel("gemini-2.0-flash")
response = model.generate_content(prompt)

if response and response.text:
    print("💬 Gemini Summary:\n")
    print(response.text)
else:
    print("❌ No summary generated.")
