# 🤖 AI ChatBot with RAG & Local LLM

A **full-stack, ChatGPT-like AI chatbot** built using **FastAPI, React, and locally hosted Large Language Models (LLMs)**.  
This project supports **real-time streaming responses**, **document uploads**, and **Retrieval Augmented Generation (RAG)**, allowing users to ask questions based on their own documents.

The entire system runs **locally**, ensuring **privacy, zero API cost, and no token limits**.

---

## 🚀 Key Features

- Secure user authentication (JWT-based login & signup)
- User-isolated chat history
- Persistent chat context (last N messages)
- Real-time streaming AI responses (token-by-token)
- Markdown-rendered AI answers
- Syntax-highlighted code blocks with copy button
- ChatGPT-style document upload using “+” button
- **Multiple PDF upload support**
- File preview with remove option before sending
- Uploaded documents displayed directly in chat
- Retrieval Augmented Generation (RAG) using vector database
- Local LLM execution via Ollama (no external APIs)
- Clean, professional ChatGPT-like UI
- Logout & session handling

---

## 🧠 How the System Works (High-Level Workflow)

1. A user signs up or logs in securely.
2. The user enters the chat interface.
3. The user uploads one or more PDF documents directly from the chat input.
4. Uploaded documents are processed, chunked, embedded, and stored in a vector database.
5. When the user asks a question:
   - Recent chat history is retrieved
   - Relevant document chunks are fetched using vector search
   - The combined context is sent to the local LLM
6. The AI response is streamed back to the UI in real time.
7. Answers are grounded in both conversation history and uploaded documents.

This follows the same **RAG architecture used in modern AI systems like ChatGPT**.

---

## 🧰 Tech Stack
### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- ChromaDB (Vector Database)

### AI / ML
- Ollama (Local LLM execution)
- Sentence Transformers (Embeddings)
- Retrieval Augmented Generation (RAG)

---

## ⚙️ Setup Instructions
### Prerequisites
- Python 3.10+
- Node.js (v18+ recommended)
- PostgreSQL
- Ollama (https://ollama.com)

---

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
**Create a .env file using .env.example as reference.**
Run database migrations:
```bash
alembic upgrade head 
```

Start the backend server:
```bash
uvicorn app.main:app --reload
```

**Backend URL:**
http://127.0.0.1:8000


**Swagger API Docs:**
http://127.0.0.1:8000/docs 



### Frontend Setup
```bash
cd frontend 
npm install
npm run dev
```

**Frontend URL:**
http://localhost:5173


## 🤖 Run Local LLM (Required)
In a separate terminal:
```bash
ollama pull llama3
ollama serve
```

**Ollama Backend URL:**
http://localhost:11434


### 🔐 Security & Privacy

- All AI inference runs locally  
- No external AI APIs are used  
- No user data leaves the system  
- Secrets are managed using environment variables  
- Uploaded documents and vector data are excluded from version control  
