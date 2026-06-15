"""Document loading and ingestion pipeline.

This module processes uploaded files, extracts text, generates embeddings,
and stores the results in the vector database.
"""

import os
from pathlib import Path
from typing import Optional, Any
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
from langchain_qdrant import QdrantVectorStore

from app.core.config import logger


class MultiDocumentLoader:
    """A helper class designed to process and index a single uploaded document.

    This class handles loading, metadata tagging, chunking, embedding generation,
    vector DB indexing, and local file cleanup.

    Attributes:
        file_path (str): The local temporary filepath where the document is stored.
        filename (str): The original filename of the document.
        embedding_model (HuggingFaceEndpointEmbeddings): HuggingFace embedding engine.
        chunk_storage (list[Any]): Temporary storage for document chunks.
    """

    def __init__(self, file_path: str, filename: str) -> None:
        """Initializes the MultiDocumentLoader with file details and embedding model.

        Args:
            file_path (str): The local system path to the file.
            filename (str): The original filename of the document.
        """
        self.file_path: str = file_path
        self.filename: str = filename
        self.chunk_storage: list[Any] = []
        self.embedding_model: HuggingFaceEndpointEmbeddings = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2",
            task="feature-extraction",
            huggingfacehub_api_token=os.environ["HF_TOKEN"]
        )

    def _create_loader(self) -> Optional[PyMuPDFLoader]:
        """Detects the file format by extension and returns the appropriate loader.

        Returns:
            Optional[PyMuPDFLoader]: The initialized document loader, or None if unsupported.
        """
        print(f"Detecting loader for: {self.filename}")
        _, ext = os.path.splitext(self.filename)
        if ext.lower() == ".pdf":
            print("pdf")
            return PyMuPDFLoader(file_path=self.file_path)
        
        # Future-proofing: easily extend to .docx or other extensions here
        # elif ext.lower() in [".doc", ".docx"]:
        #     return UnstructuredWordDocumentLoader(file_path=self.file_path)
        
        return None

    def load(self) -> None:
        """Executes the main pipeline: Load -> Tag Metadata -> Chunk -> Save -> Cleanup.

        Loads the document into memory, enriches each page's metadata with file details,
        chunks the text content, stores them in the database, and deletes the local copy.
        """
        self.chunk_storage = []
        print(f"Absolute path to process: {Path(self.file_path).absolute()}")
        
        # 1. Get the correct loader
        loader: Optional[PyMuPDFLoader] = self._create_loader()
        if not loader:
            logger.error(f"Unsupported file format for {self.filename}")
            return
        
        # 2. Load the document into memory (returns a list of Document objects per page)
        doc: list[Any] = loader.load()
        print("Document loaded successfully.")
        
        # 3. Add custom metadata for search filtering & reference
        print("Adding metadata to each page...")
        for page in doc:
            page.metadata['user_id'] = 1  # Hardcoded for now; can be mapped to a user session later
            page.metadata['file_name'] = self.filename
        print("Metadata successfully attached.")
        
        # 4. Split the text into smaller, overlapping chunks for better semantic retrieval
        print("Splitting document pages into smaller chunks...")
        text_splitter: RecursiveCharacterTextSplitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, 
            chunk_overlap=400
        )
        chunks: list[Any] = text_splitter.split_documents(documents=doc)
        print(f"Created {len(chunks)} chunks from the document.")
        
        # 5. Extend the chunk storage array and save to DB
        self.chunk_storage.extend(chunks)
        self._store_to_vector_db(self.chunk_storage)

    def _store_to_vector_db(self, chunks: list[Any]) -> None:
        """Generates vector embeddings for each chunk and uploads them to Qdrant.

        After successfully indexing, deletes the temporary local file.

        Args:
            chunks (list[Any]): List of LangChain Document objects to index.
        """
        print("Uploading chunks and embeddings to Qdrant...")
        QdrantVectorStore.from_documents(
            documents=chunks,
            embedding=self.embedding_model,
            url=os.environ["QDRANT"],
            collection_name="Reginter-Ai"
        )
        
        # 6. Delete the temporary file from local storage to keep disk usage low
        if os.path.exists(self.file_path):
            os.remove(self.file_path)
            logger.info(f"Successfully cleaned up and deleted local file: {self.filename}")

