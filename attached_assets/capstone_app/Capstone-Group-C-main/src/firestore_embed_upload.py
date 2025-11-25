"""
firestore_embed_upload.py
---------------------------------
Uploads your educational PDFs to Firestore.
Each PDF is split into text chunks, and each chunk is uploaded
as a Firestore document in the 'educational' collection.

The Firebase Vector Search extension (Gemini) will automatically
create embeddings for each uploaded chunk.
"""

import os
from pypdf import PdfReader
from google.cloud import firestore

# --- Initialize Firestore Client ---
# Make sure you have your Firebase credentials set up:
#   1. Download your Firebase Admin SDK service account JSON key
#   2. Set it as an environment variable:
#      setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\serviceAccountKey.json"
#
# Then reopen VSCode or your terminal.

db = firestore.Client(project="capstone-87b51")

# --- Folder containing your educational PDFs ---
pdf_folder = os.path.join(os.path.dirname(__file__), "../educational_content")

# --- Split long text into smaller chunks for embeddings ---
def chunk_text(text, chunk_size=1000):
    words = text.split()
    return [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

# --- Upload all PDFs ---
for filename in os.listdir(pdf_folder):
    if not filename.lower().endswith(".pdf"):
        continue

    pdf_path = os.path.join(pdf_folder, filename)
    reader = PdfReader(pdf_path)
    text = "".join(page.extract_text() or "" for page in reader.pages)
    chunks = chunk_text(text)

    print(f"📄 Uploading {len(chunks)} chunks from {filename}...")

    for i, chunk in enumerate(chunks):
        doc_id = f"{filename}_chunk{i}"
        doc_ref = db.collection("educational").document(doc_id)
        doc_ref.set({
            "input": chunk,
            "metadata": {"source": filename, "chunk": i}
        })

    print(f"✅ Uploaded all chunks from {filename}")

print("🚀 Done! Firestore will automatically create embeddings for each chunk using Gemini.")
