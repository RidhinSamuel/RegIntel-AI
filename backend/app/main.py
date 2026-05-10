from dotenv import load_dotenv
from fastapi import FastAPI

from app.api.routes import api_router

load_dotenv()
app = FastAPI(debug=True, title="PDF Upload API", version="1.0.0")
app.include_router(api_router, prefix="/api")
app.get("/")(lambda: {"message": "Welcome to the API"})