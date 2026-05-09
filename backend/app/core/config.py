import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
PDF_STORAGE_DIR=os.getenv("PDF_STORAGE_DIR")
BASE_DIR = Path(PDF_STORAGE_DIR)
if __name__ == "__main__":
    print("Running settings.py")
    print(PDF_STORAGE_DIR)
    print(BASE_DIR.parent)