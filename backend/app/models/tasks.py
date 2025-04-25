from __future__ import annotations
from typing import Optional, List
from datetime import date, datetime
from sqlmodel import SQLModel, Field, Relationship, Column, Enum
import enum

class TaskStatus(str, enum.Enum):
    draft = "draft"
    in_progress = "in_progress"
    legal_review = "legal_review"
    approved = "approved"
    completed = "completed"
    rejected = "rejected"

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    status: TaskStatus = Field(sa_column=Column(Enum(TaskStatus), default=TaskStatus.draft))
    start_date: Optional[date] = None
    due_date: Optional[date] = None

    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    creator_id: int = Field(foreign_key="user.id")

    created_at: datetime = Field(default_factory=datetime.utcnow)

    steps: List["TaskStep"] = Relationship(back_populates="task")
    tags: List["TaskTag"] = Relationship(back_populates="task")
