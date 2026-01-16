# AI ChatBot – Backend (FastAPI)

This is the backend service for the **AI ChatBot with RAG and local LLM support**.  
It is responsible for authentication, chat handling, document ingestion, vector search, and streaming AI responses.

The backend is built using **FastAPI** and follows a clean, modular structure suitable for production-grade AI applications.

---

## 🚀 Features

- JWT-based user authentication (signup, login, logout)
- User-isolated chat history storage
- Streaming AI responses (token-by-token)
- Retrieval Augmented Generation (RAG)
- Document upload and processing (PDF)
- Vector database integration (ChromaDB)
- Local LLM inference using Ollama
- Database migrations using Alembic

---

## 🧠 Architecture Overview

- **FastAPI** – API framework
- **SQLAlchemy + PostgreSQL** – Persistent storage
- **Alembic** – Database migrations
- **ChromaDB** – Vector database for embeddings
- **Ollama** – Local LLM execution (no external API)
- **RAG Pipeline** – Combines chat history + document context

All AI inference is performed **locally**, ensuring privacy, zero cost, and no token limits.

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- PostgreSQL
- Ollama (https://ollama.com)

---

### 1️⃣ Create virtual environment
```bash 
python -m venv venv
venv\Scripts\activate
```

### 2️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Configure environment variables
```bash
Create a .env file using .env.example as reference.
```

### 4️⃣ Run database migrations
```bash
alembic upgrade head
```

### 5️⃣ Start the backend server
```bash
uvicorn app.main:app --reload
```

**Backend URL:**
http://127.0.0.1:8000


**Swagger API docs:**
http://127.0.0.1:8000/docs


----------------------
### 🤖 Running the LLM (Required)

In a separate terminal:-
```bash
ollama pull llama3
ollama serve
```

**Ollama Backend:-**
http://localhost:11434