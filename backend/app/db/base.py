#This file imports all database models in one place
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models so Alembic can detect them
# from app.models.user import User
# from app.models.chat import Chat
