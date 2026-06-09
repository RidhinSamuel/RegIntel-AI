from app.services.inject_pipeline import MultiDocumentLoader
from app.core.config import STORAGE

def run_document_injection():
    load = MultiDocumentLoader(STORAGE)
    load.load()