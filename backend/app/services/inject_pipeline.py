import os
# from pathlib import Path
# from langchain_community.document_loaders import UnstructuredWordDocumentLoader
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
from langchain_qdrant import QdrantVectorStore
# from app.core.config import PDF_STORAGE_DIR
from dotenv import load_dotenv
load_dotenv()
class MultiDocumentLoader:
    def __init__(self,document_path):
        self.document_path = document_path
        self.embedding_model = HuggingFaceEndpointEmbeddings(model="sentence-transformers/all-MiniLM-L6-v2",
                                                task="feature-extraction",
                                                huggingfacehub_api_token=os.environ["HF_TOKEN"])
    # This is a function only used inside it will return the loader 
    def _create_loader(self,filename):
        print(filename)
        _, ext = os.path.splitext(filename)
        # if ext in (".doc",".docx"):
        #     print("doc")
        #     return UnstructuredWordDocumentLoader(file_path=filename)
        if ext == ".pdf":
            print("pdf")
            return PyMuPDFLoader(file_path=filename)
    def load(self):
        self.chunk_storage=[]
        for filename in os.listdir(self.document_path):
            file_path = os.path.join(self.document_path, filename)
            loader=self._create_loader(file_path)
            doc = loader.load()
            print(type(doc))
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
PDF_STORAGE_DIR=os.getenv("PDF_STORAGE_DIR")
print(PDF_STORAGE_DIR)
load = MultiDocumentLoader(PDF_STORAGE_DIR)
load.load()