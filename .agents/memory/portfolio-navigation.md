---
name: Portfolio navigation
description: User's preferred homepage navigation format across portfolio projects.
---

Use Experiment 1 as the navigation style reference for all experiment pages: a fixed arrow-only back link with the project title beside it, using shared navigation CSS. Do not use a boxed, bulleted Home-link list.

**Why:** The user disliked the old Home-list format and subsequently requested that all experiment navigation match Experiment 1.

**How to apply:** Keep experiment pages consistent with Experiment 1 and give the arrow link an accessible back-to-portfolio label.

Homepage links, experiment page headings, and browser-tab titles should show only the project name, without an experiment label or number.

**Why:** The user wants to remove links without disrupting numbering.

**How to apply:** Use unnumbered project names when adding or updating homepage links, experiment headings, and HTML titles.

Global p5 click callbacks receive clicks outside the canvas too. Returning `false` cancels the clicked link's normal navigation; a visible, clickable back button can therefore fail even when its URL and stacking order are correct.

**Why:** The isometric experiments cancelled ordinary back-button navigation through their global sketch click handlers. A separate fullscreen stacking issue also put the canvas above the navigation bar.

**How to apply:** Restrict sketch click handling to its own canvas before cancelling default browser behavior. Keep link and form-control clicks outside the sketch handler, and verify real browser navigation both normally and in fullscreen; the fixed navigation must stay above the fullscreen canvas.