"""Main entry point for the RegIntel-AI FastAPI application.

This module initializes the FastAPI application instance, configures logging
handlers, registers global routes, and includes nested API routers.
"""
import logging
from fastapi import FastAPI
from app.api.routes import api_router

# Configure uvicorn log handler to output to file
file_handler: logging.FileHandler = logging.FileHandler("app.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logging.getLogger("uvicorn").addHandler(file_handler)

app: FastAPI = FastAPI(
    debug=True,
    title="RegIntel-AI API",
    description="Backend API for document ingestion, processing, and vector indexing.",
    version="1.0.0"
)

# Register API routes
app.include_router(api_router, prefix="/api")

@app.get(
    "/",
    summary="Root Endpoint",
    description="Serves a simple JSON welcome message confirming API availability.",
    response_description="Welcome message indicating backend is active."
)
def read_root() -> dict[str, str]:
    """Returns a basic welcome message.

    Returns:
        dict[str, str]: A dictionary containing a welcome message.
    """
    return {"message": "Welcome to the API"}
