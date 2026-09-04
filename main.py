import json
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="saiganesh Portfolio",
    docs_url=None,
    redoc_url=None,
    openapi_external_docs=None,
    openapi_url=None,
)

app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

PROJECTS = json.loads((BASE_DIR / "data" / "projects.json").read_text())
RESEARCH = json.loads((BASE_DIR / "data" / "research.json").read_text())


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(
        request, "index.html", {"projects": PROJECTS, "research": RESEARCH}
    )


@app.get("/projects")
async def projects():
    return PROJECTS


@app.get("/research")
async def research():
    return RESEARCH
