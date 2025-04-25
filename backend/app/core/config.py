from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Eshows Tasks Workflow API"
    SQLALCHEMY_DATABASE_URI: str = "postgresql+psycopg2://postgres:postgres@db:5432/tasks"
    SECRET_KEY: str = "CHANGE_ME"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60*24
    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minio"
    MINIO_SECRET_KEY: str = "minio123"
    class Config(SettingsConfigDict):
        env_file = ".env"

settings = Settings()
