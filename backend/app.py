import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import llm
import prompts


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StoryRequest(BaseModel):
    name: str
    age: int
    experience: str
    concern: str = ""
    interest: str = ""
    language: str


@app.post("/generate")
def generate_story(data: StoryRequest):

    user_prompt = prompts.build_story_prompt(
        name=data.name,
        age=data.age,
        experience=data.experience,
        concern=data.concern,
        interest=data.interest,
        language=data.language
    )

    result = llm.generate(user_prompt)

    print(
        f"\n{result['input_tokens']} in · "
        f"{result['output_tokens']} out"
    )

    story = json.loads(result["reply"])

    return story