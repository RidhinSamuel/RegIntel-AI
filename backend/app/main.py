import os
from fastapi import FastAPI
import logging
from app.core.config import STORAGE
from app.api.routes import api_router
file_handler = logging.FileHandler("app.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logging.getLogger("uvicorn").addHandler(file_handler)
# os.remove(STORAGE)

app = FastAPI(debug=True, title="PDF Upload API", version="1.0.0")
app.include_router(api_router, prefix="/api")
app.get("/")(lambda: {"message": "Welcome to the API"})