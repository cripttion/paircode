from fastapi import APIRouter
import schemas
import random

router = APIRouter()

@router.post("/autocomplete", response_model=schemas.AutocompleteResponse)
def autocomplete(request: schemas.AutocompleteRequest):
    # Mocked AI logic
    suggestions = [
        "print('Hello World')",
        "def main():\n    pass",
        "import os",
        "return True",
        "if __name__ == '__main__':"
    ]
    
    # Simple rule-based mock
    if "def" in request.code.split("\n")[-1]:
        suggestion = "    pass"
    elif "import" in request.code.split("\n")[-1]:
        suggestion = " sys"
    else:
        suggestion = random.choice(suggestions)
        
    return {"suggestion": suggestion}
