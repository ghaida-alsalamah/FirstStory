"""
config.py — every setting lives here. Nothing else in the project has a number in it.

Why keep them all in one file?
  · you can change behaviour without reading any other file
  · when something goes wrong, there is one place to look
  · a teammate who does not write Python can still adjust it

Edit this file first. Most of the time it is the only file you need to touch.
"""

# ══════════════════════════════════════════════════════════════
#  1 · MODEL
# ══════════════════════════════════════════════════════════════

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"

# Other models that fit on a Colab T4 or a decent laptop:
#   "Qwen/Qwen2.5-1.5B-Instruct"            better quality, needs a GPU
#   "HuggingFaceTB/SmolLM2-360M-Instruct"   smallest, works on CPU
#   "meta-llama/Llama-3.2-1B-Instruct"      gated — accept the licence first


# ══════════════════════════════════════════════════════════════
#  2 · API KEY  (only if you use a hosted model instead)
# ══════════════════════════════════════════════════════════════
# ⚠️  NEVER put a real key in this file and push it to GitHub.
#     Put it in an environment variable and read it here.

import os

API_KEY = os.getenv("LLM_API_KEY", "")     # empty = we are running locally
USE_API = False                            # True = call a hosted model


# ══════════════════════════════════════════════════════════════
#  3 · GENERATION SETTINGS
# ══════════════════════════════════════════════════════════════

TEMPERATURE        = 0.7     # 0 = same answer every time · 1 = varied
TOP_P              = 0.9     # keep the most likely tokens
MAX_NEW_TOKENS     = 200     # cap on the ANSWER length
DO_SAMPLE          = True    # ⚠️ False makes TEMPERATURE do nothing
REPETITION_PENALTY = 1.1     # stops it looping


# ══════════════════════════════════════════════════════════════
#  4 · MEMORY
# ══════════════════════════════════════════════════════════════

MAX_TURNS   = 6                # how many past turns to send with each request
MEMORY_FILE = "memory.json"    # where the conversation is saved


# ══════════════════════════════════════════════════════════════
#  5 · INTERFACE
# ══════════════════════════════════════════════════════════════

APP_TITLE    = "Study Buddy"
APP_SUBTITLE = "Ask me anything. I keep answers short."
GREETING     = "Hi! I am Study Buddy. What are you working on today?"
PLACEHOLDER  = "Type your question..."

EXAMPLES = [
    "Explain what a neural network is",
    "ما الفرق بين التعلم الآلي والتعلم العميق؟",
    "Give me three tips for studying before an exam",
]


# ══════════════════════════════════════════════════════════════
#  6 · LIMITS
# ══════════════════════════════════════════════════════════════

MAX_INPUT_CHARS = 2000        # reject anything longer


if __name__ == "__main__":
    print(f"model       : {MODEL_NAME}")
    print(f"temperature : {TEMPERATURE}")
    print(f"do_sample   : {DO_SAMPLE}")
    print(f"max tokens  : {MAX_NEW_TOKENS}")
    print(f"memory      : last {MAX_TURNS} turns → {MEMORY_FILE}")
