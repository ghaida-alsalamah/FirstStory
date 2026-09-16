import re
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

import config


# ══════════════════════════════════════════════════════════════
#  Load once, reuse forever
# ══════════════════════════════════════════════════════════════

_tokenizer = None
_model = None


def load_model():
    """Load the model into memory. Called once, the first time it is needed."""
    global _tokenizer, _model

    if _model is not None:            # already loaded
        return _tokenizer, _model

    print(f"Loading {config.MODEL_NAME} ...")
    has_gpu = torch.cuda.is_available()

    _tokenizer = AutoTokenizer.from_pretrained(config.MODEL_NAME)
    _model = AutoModelForCausalLM.from_pretrained(
        config.MODEL_NAME,
        torch_dtype=torch.float16 if has_gpu else torch.float32,
        device_map="auto" if has_gpu else None,
    )
    _model.eval()

    n = sum(p.numel() for p in _model.parameters())
    print(f"Ready. {n:,} parameters on {'GPU' if has_gpu else 'CPU'}.")
    if not has_gpu:
        print("⚠️  No GPU — answers will be slow. That is normal.")

    return _tokenizer, _model


# ══════════════════════════════════════════════════════════════
#  The one function the rest of the app calls
# ══════════════════════════════════════════════════════════════

def generate(prompt: str):
    tok, model = load_model()

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    # ── 1 · the chat template turns the list into one string ────
    text = tok.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    inputs = tok(text, return_tensors="pt").to(model.device)

    # ── 2 · generate ────────────────────────────────────────────
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=config.MAX_NEW_TOKENS,
            temperature=config.TEMPERATURE,
            top_p=config.TOP_P,
            do_sample=config.DO_SAMPLE,
            repetition_penalty=config.REPETITION_PENALTY,
            pad_token_id=tok.eos_token_id,
        )

    n_in = inputs["input_ids"].shape[1]
    n_out = output.shape[1] - n_in
    reply = tok.decode(output[0][n_in:], skip_special_tokens=True)

    # ── 3 · clean it before anyone sees it ──────────────────────
    reply = clean(reply)

    return {
        "reply": reply,
        "input_tokens": n_in,
        "output_tokens": n_out,
        # the model never tells you it was cut off — you have to check
        "truncated": n_out >= config.MAX_NEW_TOKENS,
    }


def clean(text: str) -> str:
    """Strip anything the user should not see."""
    # reasoning models wrap their working in <think> ... </think>
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.S)
    return text.strip()


# ══════════════════════════════════════════════════════════════
#  If you switch to a hosted API later, only this file changes.
# ══════════════════════════════════════════════════════════════
#
# def ask(messages):
#     r = requests.post(
#         "https://api.example.com/v1/chat/completions",
#         headers={"Authorization": f"Bearer {config.API_KEY}"},
#         json={"model": config.MODEL_NAME,
#               "messages": messages,
#               "temperature": config.TEMPERATURE,
#               "max_tokens": config.MAX_NEW_TOKENS},
#     ).json()
#     return {"reply": r["choices"][0]["message"]["content"], ...}


if __name__ == "__main__":
    prompt = "Write one short sentence about a child's first airplane flight."

    out = generate(prompt)

    print(out["reply"])
    print(f"\n{out['input_tokens']} in · {out['output_tokens']} out")
