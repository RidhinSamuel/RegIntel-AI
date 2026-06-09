import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
STORAGE=os.getenv("STORAGE")
BASE_DIR = Path(STORAGE)
if __name__ == "__main__":
    print("Running settings.py")
    print(STORAGE)
    print(BASE_DIR.parent)