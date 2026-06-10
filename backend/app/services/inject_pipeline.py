import os
from pathlib import Path

# from dotenv import load_dotenv
# load_dotenv()
# from langchain_community.document_loaders import UnstructuredWordDocumentLoader
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
from langchain_qdrant import QdrantVectorStore

from app.core.config import logger


class MultiDocumentLoader:
    """
    A helper class designed to process a single uploaded document.
    It performs the following steps:
      1. Determines the appropriate file loader based on file extension.
      2. Loads the document content into Memory.
      3. enriches the metadata of each page (e.g., adding user_id, file_name).
      4. Splits the document into smaller, manageable text chunks.
      5. Generates embeddings for the chunks using Hugging Face's API.
      6. Stores the vector embeddings and metadata in a Qdrant collection.
      7. Deletes the temporary local file to save storage.
    """
    def __init__(self, file_path: str, filename: str):
        """
        Initialize the loader with the local path to the file and its original filename.
        Also configures the HuggingFace embedding model.
        """
        self.file_path = file_path
        self.filename = filename
        self.embedding_model = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-MiniLM-L6-v2",
            task="feature-extraction",
            huggingfacehub_api_token=os.environ["HF_TOKEN"]
        )

    def _create_loader(self):
        """
        Detects the file format by extension and returns the appropriate 
        LangChain document loader.
        Currently supports: PDF.
        """
        print(f"Detecting loader for: {self.filename}")
        _, ext = os.path.splitext(self.filename)
        if ext == ".pdf":
            print("pdf")
            return PyMuPDFLoader(file_path=self.file_path)
        
        # Future-proofing: easily extend to .docx or other extensions here
        # elif ext.lower() in [".doc", ".docx"]:
        #     return UnstructuredWordDocumentLoader(file_path=self.file_path)
        
        return None

    def load(self):
        """
        Executes the main pipeline: Load -> Tag Metadata -> Chunk -> Save to Qdrant -> Cleanup File.
        """
        self.chunk_storage = []
        print(f"Absolute path to process: {Path(self.file_path).absolute()}")
        
        # 1. Get the correct loader
        loader = self._create_loader()
        if not loader:
            logger.error(f"Unsupported file format for {self.filename}")
            return
        
        # 2. Load the document into memory (returns a list of Document objects per page)
        doc = loader.load()
        print("Document loaded successfully.")
        
        # 3. Add custom metadata for search filtering & reference
        print("Adding metadata to each page...")
        for page in doc:
            page.metadata['user_id'] = 1  # Hardcoded for now; can be mapped to a user session later
            page.metadata['file_name'] = self.filename
        print("Metadata successfully attached.")
        
        # 4. Split the text into smaller, overlapping chunks for better semantic retrieval
        print("Splitting document pages into smaller chunks...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)
        chunks = text_splitter.split_documents(documents=doc)
        print(f"Created {len(chunks)} chunks from the document.")
        
        # 5. Extend the chunk storage array and save to DB
        self.chunk_storage.extend(chunks)
        self._store_to_vector_db(self.chunk_storage)

    def _store_to_vector_db(self, chunks):
        """
        Generates vector embeddings for each chunk and uploads them 
        to the Qdrant vector database under the specified collection.
        After successful upload, the local temporary file is removed.
        """
        print("Uploading chunks and embeddings to Qdrant...")
        vector_store = QdrantVectorStore.from_documents(
            documents=chunks,
            embedding=self.embedding_model,
            url=os.environ["QDRANT"],
            collection_name="Reginter-Ai"
        )
        
        # 6. Delete the temporary file from local storage to keep disk usage low
        if os.path.exists(self.file_path):
            os.remove(self.file_path)
            logger.info(f"Successfully cleaned up and deleted local file: {self.filename}")
