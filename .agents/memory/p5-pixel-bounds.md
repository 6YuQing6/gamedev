---
name: p5 pixel bounds
description: Fractional p5 graphics dimensions and visible-image centering.
---

When scanning a p5 graphics pixel array, use the underlying canvas's integer dimensions and account for pixel density, rather than assuming the graphics width and height are integers.

**Why:** Procedural fish dimensions are random floats. p5 retains those fractional graphics dimensions even though the backing canvas dimensions are integers; indexing pixels with a fractional row stride incorrectly reports an empty image.

**How to apply:** For density-one buffers, use the backing canvas width as the row stride. Center procedural images by their nontransparent bounds rather than the full buffer, whose transparent padding can be asymmetric.