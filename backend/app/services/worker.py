"""Worker function definitions for background execution.

This module houses the tasks triggered by RQ worker processes, such as
running the document ingestion/indexing pipeline.
"""

from app.services.inject_pipeline import MultiDocumentLoader

def run_document_injection(file_path: str, file_name: str) -> None:
    """Runs the document injection pipeline for a given local file.

    Creates a loader instance, parses the document, creates chunks and embeddings,
    and indexes the vector representations in the database.

    Args:
        file_path (str): The local temporary filesystem path where the file is stored.
        file_name (str): The original filename of the document.
    """
    load: MultiDocumentLoader = MultiDocumentLoader(file_path, file_name)
    load.load()