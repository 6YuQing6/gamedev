---
name: Portfolio navigation
description: User's preferred homepage navigation format across portfolio projects.
---

Use the same fixed back-to-portfolio button style across experiment pages and the final project, with shared navigation CSS rather than page-specific copies. Do not use a boxed, bulleted Home-link list.

**Why:** The user explicitly disliked the old Home-list format and requested the same button format as Experiment 6.

**How to apply:** Keep new portfolio project pages consistent with this navigation style.

Homepage links should show only the project name, without an experiment label or number.

**Why:** The user wants to remove links without disrupting numbering.

**How to apply:** Use unnumbered project names when adding or updating homepage links.

Global p5 click callbacks receive clicks outside the canvas too. Returning `false` cancels the clicked link's normal navigation; a visible, clickable back button can therefore fail even when its URL and stacking order are correct.

**Why:** The isometric experiments cancelled back-button navigation through their global sketch click handlers, not through an overlay or a bad link.

**How to apply:** Restrict sketch click handling to its own canvas before cancelling default browser behavior. Keep link and form-control clicks outside the sketch handler.