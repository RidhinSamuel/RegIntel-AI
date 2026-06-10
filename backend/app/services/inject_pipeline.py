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
    def __init__(self,file_path,filename):
        self.file_path = file_path
        self.filename = filename
        self.embedding_model = HuggingFaceEndpointEmbeddings(model="sentence-transformers/all-MiniLM-L6-v2",
                                                task="feature-extraction",
                                                huggingfacehub_api_token=os.environ["HF_TOKEN"])
    # This is a function only used inside it will return the loader 
    def _create_loader(self):
        print(self.filename)
        _, ext = os.path.splitext(self.filename)
        # if ext in (".doc",".docx"):
        #     print("doc")
        #     return UnstructuredWordDocumentLoader(file_path=filename)
        if ext == ".pdf":
            print("pdf")
            return PyMuPDFLoader(file_path=self.file_path)
    def load(self):
        self.chunk_storage=[]
        print(Path(self.file_path).absolute())
        loader=self._create_loader()
        doc = loader.load()
        for page in doc:
            page.metadata['user_id'] = 1
            page.metadata['file_name'] = self.filename
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)
        chunks = text_splitter.split_documents(documents=doc)
        print(f"Number of chunks: {len(chunks)}", chunks[0])
        self.chunk_storage.extend(chunks)
        self._store_to_vector_db(self.chunk_storage)
    def _store_to_vector_db(self, chunks):
        vector_store = QdrantVectorStore.from_documents(
                            documents=chunks,
                            embedding=self.embedding_model,
                            url=os.environ["QDRANT"],
                            collection_name = "Reginter-Ai")
        os.remove(self.file_path)
        logger.info(f"Removed the File : {self.filename}")


