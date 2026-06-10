# RegIntel-AI
A production grade Regulatory Intelligence and Compliance Assistant using RAG
try to make project folder to look like this:
# Project Structure
```
backend/
│
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── upload.py
│   │   │   ├── query.py
│   │   │   └── health.py
│   │   │
│   │   └── dependencies/
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── logging.py
│   │
│   ├── services/
│   │   ├── pdf_service.py
│   │   ├── chunking_service.py
│   │   ├── embedding_service.py
│   │   ├── retrieval_service.py
│   │   └── vector_store_service.py
│   │
│   ├── models/
│   │   ├── request_models.py
│   │   └── response_models.py
│   │
│   ├── db/
│   │   ├── database.py
│   │   └── schemas.py
│   │
│   ├── utils/
│   │   ├── file_utils.py
│   │   └── validators.py
│   │
│   └── main.py
│
├── storage/
│   ├── pdfs/
│   ├── vector_store/
│   └── temp/
│
├── tests/
│
├── .env
├── requirements.txt
└── README.md

uv run rq worker -w rq.SimpleWorker