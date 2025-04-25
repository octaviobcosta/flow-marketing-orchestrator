from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from app.db.session import get_session
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from typing import List

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, db=Depends(get_session)):
    task = Task.model_validate(task_in)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("", response_model=List[TaskRead])
def list_tasks(skip: int = 0, limit: int = 20, db=Depends(get_session)):
    tasks = db.exec(select(Task).offset(skip).limit(limit)).all()
    return tasks

@router.patch("/{task_id}/status", response_model=TaskRead)
def update_status(task_id: int, status_in: TaskStatus, db=Depends(get_session)):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(404, "Task not found")
    task.status = status_in
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
