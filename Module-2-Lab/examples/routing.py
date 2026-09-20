def sales_agent(request):
    return f"[Sales] Let me get you pricing info for: {request}"


def technical_agent(request):
    return f"[Technical] Let's debug this: {request}"


def support_agent(request):
    return f"[Support] I can help with your account issue: {request}"


def router(request):
    """Stub standing in for an LLM classifying the request."""
    text = request.lower()
    if "price" in text or "buy" in text:
        return sales_agent
    if "error" in text or "bug" in text:
        return technical_agent
    return support_agent


if __name__ == "__main__":
    requests = [
        "What's the price for the enterprise plan?",
        "I'm getting a bug when I click submit.",
        "I can't log into my account.",
    ]

    for request in requests:
        handler = router(request)
        print(handler(request))
