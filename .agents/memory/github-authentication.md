---
name: GitHub authentication
description: Authentication boundary between the GitHub connector and shell Git.
---

A working GitHub connector does not automatically authenticate shell `git push` in this environment. Connector-backed GitHub operations can use authenticated API access without exposing credentials.

**Why:** The shell required a GitHub username despite the connected integration having repository write access. Bulk Git writes through the connector proxy also encountered an opaque upstream transport failure, while the initialized SDK completed the same operations.

**How to apply:** Distinguish connector access from CLI authentication. Do not read or log tokens to bridge the two. Prefer the initialized SDK for batched Git writes when available; do not mistake non-JSON upstream failures for expired authorization. If synchronizing through the Git Data API, preserve commit identity and use non-forced branch updates so remote work is not overwritten.