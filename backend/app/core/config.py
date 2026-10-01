from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "FormClub Training"
    DATABASE_URL: str = "postgresql://formclub:formclub123@localhost:5432/formclub_db"
    SECRET_KEY: str = "94b7e8d01b1b36d0370f6b4d32e92c2a939fdf0c0cf9f6a1d4715f60b4cb936b"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
