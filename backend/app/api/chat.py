#This file will contain chat-related APIs.
import shutil
import os

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.schemas.chat import ChatHistoryResponse
from app.services.document_service import process_document

from fastapi.responses import StreamingResponse
from app.services.llm_service import stream_ai_response
from app.services.vector_service import search_memory, add_to_memory    

from app.services.vector_service import add_to_memory, search_memory

from app.core.auth_dependency import get_current_user
from app.db.session import get_db
from app.models.chat import Chat
from app.schemas.chat import ChatMessageCreate

router = APIRouter()

@router.post("/message/stream")
def stream_message(
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Save user message
    db.add(Chat(user_id=current_user.id, role="user", content=data.message))
    db.commit()

    history = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
        .limit(10)
        .all()
    )
    history.reverse()

    retrieved_memory = search_memory(data.message, current_user.id)

    system_prompt = "Use this memory if relevant:\n" + "\n".join(retrieved_memory)

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(
        {"role": m.role, "content": m.content} for m in history
    )

    def event_stream():
        full_response = ""
        for chunk in stream_ai_response(messages):
            full_response += chunk
            yield chunk

        # Save final assistant message + memory
        db.add(Chat(user_id=current_user.id, role="assistant", content=full_response))
        db.commit()
        add_to_memory(full_response, current_user.id)

    return StreamingResponse(event_stream(), media_type="text/plain")

@router.post("/message")
def send_message(
    data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # 1. Save user message
    user_message = Chat(
        user_id=current_user.id,
        role="user",
        content=data.message,
    )
    db.add(user_message)
    db.commit()

    # 2. Fetch recent chat context
    history = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
        .limit(10)
        .all()
    )
    history.reverse()

    # 3. Retrieve long-term memory (RAG)
    retrieved_memory = search_memory(
        query=data.message,
        user_id=current_user.id,
    )

    system_prompt = (
        "Use the following long-term memory if relevant:\n"
        + "\n".join(retrieved_memory)
    )

    messages = [{"role": "system", "content": system_prompt}]

    messages.extend(
        {"role": msg.role, "content": msg.content}
        for msg in history
    )

    # 4. Generate AI response
    ai_reply = generate_ai_response(messages)

    # 5. Save AI response
    assistant_message = Chat(
        user_id=current_user.id,
        role="assistant",
        content=ai_reply,
    )
    db.add(assistant_message)
    db.commit()

    # 6. Store AI reply in long-term memory
    add_to_memory(ai_reply, current_user.id)

    return {
        "user_message": data.message,
        "assistant_reply": ai_reply,
    }
    
@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    upload_dir = "uploaded_docs"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Index document for this user
    process_document(file_path, current_user.id)

    return {
        "message": "Document uploaded and ready to use",
        "filename": file.filename
    }

    
@router.get("/history", response_model=List[ChatHistoryResponse])
def get_chat_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    messages = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
        .limit(limit)
        .all()
    )

    # reverse to keep chronological order (old → new)
    messages.reverse()

    return messages

