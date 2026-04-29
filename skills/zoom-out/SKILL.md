---
name: zoom-out
description: Tell the agent to zoom out and give broader context or a higher-level perspective on an unfamiliar section of Laravel code. Use when unfamiliar with a section of code, need to understand where something fits in the request lifecycle, or need to know whether logic belongs in a Job, Action, or Controller.
disable-model-invocation: true
---

I don't know this area of code well. Go up a layer of abstraction. Give me a map of all the relevant Laravel layers and callers, using the project's domain glossary vocabulary.

Specifically tell me:

- Where does this code sit in the **Laravel request lifecycle**? (Middleware → Controller → Form Request → Action → Model → Response)
- Should this logic live in an **Action**, a **Job**, a **Controller**, or a **Model**? Why?
- Which **routes** invoke this code?
- Which **tests** cover this code path?
- Are there any **ADRs** that explain why this code is structured the way it is?
