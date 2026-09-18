import json
import re

from fastapi import FastAPI, HTTPException
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
    language: str

def _decode_json_strings(text: str) -> list[str]:
    """Decode every JSON string literal in a model-generated text fragment."""
    values = []
    for match in re.finditer(r'"(?:\\.|[^"\\])*"', text, re.DOTALL):
        try:
            values.append(json.loads(match.group(0)))
        except json.JSONDecodeError:
            continue
    return values


def parse_story_reply(raw_reply: str) -> dict:
    """Parse strict JSON, with a safe fallback for common small-model output."""
    reply = raw_reply.strip()
    start = reply.find("{")
    end = reply.rfind("}")

    if start == -1 or end <= start:
        raise ValueError("Model did not return a JSON object")

    candidate = reply[start:end + 1]

    try:
        story = json.loads(candidate)
    except json.JSONDecodeError:
        # Small local models sometimes add `// Page N` comments and concatenate
        # several quoted sentences without commas. Preserve the page boundaries
        # from those comments and join each page's sentences into one string.
        title_match = re.search(
            r'"title"\s*:\s*("(?:\\.|[^"\\])*")',
            candidate,
            re.DOTALL,
        )
        pages_match = re.search(r'"pages"\s*:\s*\[', candidate)

        if not title_match or not pages_match:
            raise ValueError("Model response is missing a title or pages array")

        title = json.loads(title_match.group(1))
        pages_text = candidate[pages_match.end():candidate.rfind("]")]
        sections = re.split(r'//\s*Page\s*\d+', pages_text, flags=re.IGNORECASE)
        pages = [
            " ".join(_decode_json_strings(section)).strip()
            for section in sections
        ]
        pages = [page for page in pages if page]

        # If the model omitted page comments, each quoted value is one page.
        if len(pages) == 1:
            pages = _decode_json_strings(pages_text)

        story = {"title": title, "pages": pages}

    title = story.get("title")
    pages = story.get("pages")
    if not isinstance(title, str) or not title.strip():
        raise ValueError("Story title must be a non-empty string")
    if not isinstance(pages, list) or not 5 <= len(pages) <= 7:
        raise ValueError("Story must contain 5 to 7 pages")
    if any(not isinstance(page, str) or not page.strip() for page in pages):
        raise ValueError("Every story page must be a non-empty string")

    return {
        "title": title.strip(),
        "pages": [page.strip() for page in pages],
    }


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

    print("\nMODEL REPLY:")
    print(repr(result["reply"]), flush=True)

    try:
        story = parse_story_reply(result["reply"])
    except ValueError as error:
        print(f"\nINVALID MODEL RESPONSE: {error}", flush=True)
        raise HTTPException(
            status_code=502,
            detail="The model returned an invalid story. Please try again.",
        ) from error

    return story
