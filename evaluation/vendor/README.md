# Vendored evaluation runtime

`crisp-game-lib/` is a fixed runtime based on crisp-game-lib v1.5.0, with drawing annotation and manual
logical-tick evaluation added.

- Upstream repository: `https://github.com/abagames/crisp-game-lib`
- Upstream tag: `v1.5.0`
- Upstream commit: `89c4b9af7e62f66d09d7e4fdb91bbaa80a177091`
- License: MIT (`crisp-game-lib/LICENSE.txt`)
- Evaluation bundle SHA-256: `6aa6b18a3ff3fd75866c3e758b4b1758aa234da1d72116e1fb5ed59164f558a4`

The added features are `beginDrawing(subject)` / `endDrawing()`, a HitBox annotation collector, manual
execution, `startEpisode()`, `step({pressed})`, and a seeded episode lifecycle. `docs/bundle.js` is the
pre-built bundle containing these.

This runtime provides no image evaluation. The minimal 2D API shim prepared by the Node VM executor is used
only to make crisp-game-lib primitives and character HitBox calculations work, and no raster artifacts are
generated or saved.
