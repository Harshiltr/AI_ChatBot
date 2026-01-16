import chromadb
from sentence_transformers import SentenceTransformer

# Initialize embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize ChromaDB (local persistent DB)
chroma_client = chromadb.Client(
    settings=chromadb.Settings(
        persist_directory="./chroma_db"
    )
)

collection = chroma_client.get_or_create_collection(
    name="chat_memory"
)


def add_to_memory(text: str, user_id: int):
    embedding = embedding_model.encode(text).tolist()

    collection.add(
        documents=[text],
        embeddings=[embedding],
        metadatas=[{"user_id": user_id}],
        ids=[f"{user_id}_{hash(text)}"],
    )


def search_memory(query: str, user_id: int, top_k: int = 3):
    query_embedding = embedding_model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={"user_id": user_id},
    )

    return results["documents"][0] if results["documents"] else []
