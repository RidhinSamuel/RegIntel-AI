# RegIntel-AI
A production grade Regulatory Intelligence and Compliance Assistant using RAG
try to make project folder to look like this:
# Project Structure
```text
app/
├── main.py
├── api/
│   └── routes/
│       ├── upload.py
│       ├── query.py
│       └── health.py
├── services/
│   ├── ingestion_service.py
│   ├── embedding_service.py
│   └── retrieval_service.py
├── core/
│   ├── config.py
│   └── dependencies.py
├── models/
│   └── schemas.py
└── db/
    └── vectordb.py