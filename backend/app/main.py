from dotenv import load_dotenv
from fastapi import FastAPI

from .api.routes import upload_router

load_dotenv()
app = FastAPI(debug=True, title="PDF Upload API", version="1.0.0")
app.include_router(upload_router, prefix="/api")
app.get("/")(lambda: {"message": "Welcome to the API"})