# AI ChatBot – Frontend (React + Tailwind)

This is the **frontend application** for the AI ChatBot project.  
It provides a modern, ChatGPT-like user interface for interacting with an AI assistant that supports **streaming responses** and **document-based question answering (RAG)**.

The frontend is built with **React, Vite, and Tailwind CSS**, focusing on performance, clean UX, and real-world usability.

---

## 🚀 Features

- User authentication (Login & Signup)
- JWT-based session handling
- ChatGPT-style chat interface
- Real-time streaming AI responses
- Markdown-rendered AI answers
- Properly formatted code blocks (copy-ready)
- ChatGPT-style “+” document upload button
- Multiple document upload support (PDFs)
- File preview with remove option before sending
- Uploaded documents displayed inside chat
- Auto-scroll and typing indicators
- Logout functionality

---

## 🎨 UI & UX Highlights

- Clean and professional chat layout
- User messages aligned to the right
- AI messages aligned to the left
- Documents shown as 📄 file bubbles in chat
- Upload preview area above the input field
- Streaming responses for better perceived speed

The interface is intentionally designed to **closely resemble modern AI chat products like ChatGPT**.

---

## 🧠 How the Frontend Works

1. User logs in or signs up
2. JWT token is stored securely in browser localStorage
3. User enters the chat screen
4. User can:
   - Ask questions normally
   - Upload one or multiple PDF documents
5. Uploaded files appear as previews and can be removed
6. On clicking **Send**:
   - Files are added to the chat
   - Prompt is sent to the backend
   - AI response is streamed live
7. AI answers using:
   - Recent chat context
   - Uploaded documents (via RAG)
   - Local LLM (Ollama)

---

## 🧰 Tech Stack

- **React** – UI library
- **Vite** – Fast build tool
- **Tailwind CSS** – Styling
- **Fetch API** – Backend communication
- **Markdown Rendering** – AI responses
- **JWT Authentication** – Session handling

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Backend server running (FastAPI)
- Ollama running locally

---

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Start development server
```bash
npm run dev
```
**Frontend URL:-**
http://localhost:5173


## 🔗 Backend Integration
The frontend communicates with the backend at:
http://127.0.0.1:8000


Ensure the following services are running:-
-->FastAPI backend.
-->PostgreSQL database.
-->Ollama local LLM server.


### 🔐 Authentication Notes
JWT token is stored in browser localStorage.
Token is attached automatically to API requests.
Logout clears the token and resets session state.