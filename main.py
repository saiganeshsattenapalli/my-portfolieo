from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(title="saiganesh Portfolio",docs_url=None,redoc_url=None,openapi_external_docs=None,openapi_url=None)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

PROJECTS = [
    {"name": "Curio", "subtitle": "Curiora Intelligence",
     "description": "A model-agnostic agentic intelligence system focused on perception, reasoning, action, and verification.",
     "tags": ["AI", "Agents", "LLMs", "FastAPI"], "status": "Building", "featured": True},
    {"name": "Curiora Pay", "subtitle": "Fintech",
     "description": "An experimental project for learning backend systems, APIs, data, and intelligent workflows.",
     "tags": ["Python", "FastAPI", "SQL", "AI"], "status": "Exploring", "featured": False},
    {"name": "Curiora Campus", "subtitle": "Campus Ecosystem",
     "description": "A campus-focused platform connecting students, resources, and opportunities through intelligent infrastructure.",
     "tags": ["Full-Stack", "FastAPI", "Community"], "status": "Designing", "featured": False},
    {"name": "Curiora Research", "subtitle": "AI Research",
     "description": "Experiments and explorations in machine learning, deep learning, and neural network architectures.",
     "tags": ["ML", "Deep Learning", "Research"], "status": "Ongoing", "featured": False},
    {"name": "Curiora Intelligence Lab", "subtitle": "Research Initiative",
     "description": "A focused initiative for building and studying intelligent systems from first principles.",
     "tags": ["AI", "Research", "Systems"], "status": "Forming", "featured": False},
]

RESEARCH = [
    ("Machine Learning", "Learning the mathematical and computational foundations behind intelligent systems."),
    ("Deep Learning", "Working toward a first-principles understanding of neural networks and training."),
    ("Transformers & LLMs", "Studying attention, inference, model architectures, quantization, and modern language models."),
    ("Agentic AI", "Exploring systems that reason, use tools, take actions, and verify outcomes."),
    ("On-Device AI", "Exploring multimodal models, efficient inference, and edge intelligence."),
]

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(request,"index.html", {"projects": PROJECTS, "research": RESEARCH})

@app.get("/projects")
async def projects():
    return PROJECTS

@app.get("/research")
async def research():
    return [{"topic": a, "description": b} for a, b in RESEARCH]
