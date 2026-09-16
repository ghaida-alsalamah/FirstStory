import json
from unittest import result

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
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
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
    


@app.post("/generate")
def generate_story(data: StoryRequest):

    user_prompt = prompts.build_story_prompt(
        name=data.name,
        age=data.age,
        experience=data.experience,
        concern=data.concern,
        interest=data.interest
    )

    result = llm.generate(user_prompt)

    print(
        f"\n{result['input_tokens']} in · "
        f"{result['output_tokens']} out"
    )

    print("\nMODEL REPLY:")
    print(repr(result["reply"]), flush=True)

    reply = result["reply"].strip()

    start = reply.find("{")
    end = reply.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("Model did not return a JSON object")

    reply = reply[start:end + 1]

    story = json.loads(reply)                      

    return story