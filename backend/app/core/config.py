import os
import logging
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
logger = logging.getLogger("uvicorn.error")
BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent
STORAGE = str(BACKEND_ROOT / os.getenv("STORAGE"))
logger.info(f"BACKEND ROOT : {BACKEND_ROOT}")
logger.info(f"STORAGE : {STORAGE}")

# Get the already-configured Uvicorn logger
# 1. Setup the logger
logger = logging.getLogger("regintel_app")
logger.setLevel(logging.INFO)
# 2. Add Console Handler (prints to whichever terminal is running the code)
console_handler = logging.StreamHandler()
console_handler.setFormatter(logging.Formatter(" %(levelname)s:     %(message)s"))
logger.addHandler(console_handler)
# 3. Add File Handler (writes to app.log for both FastAPI and Worker)
file_handler = logging.FileHandler(BACKEND_ROOT / "app.log")
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