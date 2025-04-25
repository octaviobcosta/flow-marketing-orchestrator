from fastapi import FastAPI

def create_app() -> FastAPI:
    app = FastAPI(title="Eshows Tasks Workflow API")

    # health check básico (opcional, mas útil)
    @app.get("/health", tags=["utility"])
    def healthcheck():
        return {"status": "ok"}

    return app

app = create_app()   # será importado pelo Uvicorn
