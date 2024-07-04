from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to a list of origins you want to allow
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

saved_first_name = "First"
saved_last_name = "Mate"


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/names")
async def get_names():
    global saved_first_name, saved_last_name
    return JSONResponse({ "first_name": saved_first_name, "last_name": saved_last_name })

@app.post("/api/names")
async def save_name(data: Dict):
    new_first_name = data.get("first_name")
    new_last_name = data.get("last_name")
    global saved_first_name, saved_last_name
    if new_first_name:
        saved_first_name = new_first_name
    if new_last_name:
        saved_last_name = new_last_name
    return JSONResponse({ "first_name": saved_first_name, "last_name": saved_last_name })
