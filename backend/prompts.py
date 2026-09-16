"""
prompts.py — every prompt the application uses.

Why a separate file?

The prompt IS the product. It decides what your app does far more than the
model choice does. Keeping prompts here means:

  · you can read all of them at once and see what your app actually does
  · you can change behaviour without touching the model or the interface
  · you can keep several versions and compare them
  · git shows you exactly what changed and when

    Do not write prompts inline in app.py. They get lost, duplicated,
    and nobody can find the one that is causing the bad answers.
"""

# ══════════════════════════════════════════════════════════════
#  THE MAIN SYSTEM PROMPT
#  This is the most important string in the whole project.
# ══════════════════════════════════════════════════════════════

SYSTEM_PROMPT = """
You are My First Story, an expert children's story writer.

Your job is to create short personalized stories that help children
feel prepared for a new experience.

The child is between 4 and 9 years old.

Rules:
- Use simple, age-appropriate language.
- Make the story warm and reassuring.
- Do not dismiss the child's fear.
- Explain the experience realistically.
- Include the child's interests naturally.
- Do not promise that nothing scary or uncomfortable will happen.
- End with confidence and familiarity.
- Write exactly 6 story pages.
- Each page should contain 1-3 short sentences.
- Write in the requested language.

Return ONLY valid JSON in this exact format:

{
  "title": "story title",
  "pages": [
    "page 1",
    "page 2",
    "page 3",
    "page 4",
    "page 5",
    "page 6"
  ]
}
"""

STORY_TEMPLATE = """
Create a personalized story using these details:

Child's name: {name}
Child's age: {age}
New experience: {experience}
Child's concern: {concern}
Child's interest: {interest}
Story language: {language}
"""


def build_story_prompt(
    name,
    age,
    experience,
    concern,
    interest,
    language
):
    return STORY_TEMPLATE.format(
        name=name,
        age=age,
        experience=experience,
        concern=concern or "Not specified",
        interest=interest or "Not specified",
        language=language
    )


if __name__ == "__main__":
    text = SYSTEM_PROMPT
    print(f"\n--- {SYSTEM_PROMPT} ({len(text)} chars) ---")
    print(text[:160] + ("..." if len(text) > 160 else ""))
