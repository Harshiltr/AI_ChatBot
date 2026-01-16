from pypdf import PdfReader
from app.services.vector_service import add_to_memory


def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text


def chunk_text(text: str, chunk_size: int = 500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i + chunk_size]))
    return chunks


def process_document(file_path: str, user_id: int):
    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)

    for chunk in chunks:
        add_to_memory(chunk, user_id)
