"""Configuration module for the RegIntel-AI application.

This module loads environment variables, defines filesystem paths, and sets up
the application-wide logger including stream and file handlers.
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Pre-configure logger for initial uvicorn errors
logger: logging.Logger = logging.getLogger("uvicorn.error")

# Paths configuration
BACKEND_ROOT: Path = Path(__file__).resolve().parent.parent
STORAGE: str = str(BACKEND_ROOT / os.getenv("STORAGE"))

logger.info(f"BACKEND ROOT : {BACKEND_ROOT}")
logger.info(f"STORAGE : {STORAGE}")

# Set up the main application logger
logger = logging.getLogger("regintel_app")
logger.setLevel(logging.INFO)

# Add Console Handler (prints to whichever terminal is running the code)
console_handler: logging.StreamHandler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter(" %(levelname)s:     %(message)s"))
logger.addHandler(console_handler)

# Add File Handler (writes to app.log for both FastAPI and Worker)
file_handler: logging.FileHandler = logging.FileHandler(BACKEND_ROOT / "app.log")
file_handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logger.addHandler(file_handler)

# Use it in your endpoints:
# logger.info("This is a custom message!")
# logger.warning("This is a warning message!")
# logger.error("Something went wrong!")

# if __name__ == "__main__":
#     print("Running settings.py")
#     print(STORAGE)
#     print(BASE_DIR.parent)