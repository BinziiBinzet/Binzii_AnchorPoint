# Binzii Anchor Point

A **ScriptUI panel for EffectCraft** that moves a layer's anchor point via a 3x3 grid — with full **2D & 3D rotation-safe math** (powered by [PivotCraft](#acknowledgments--thanks) logic) — plus a one-click **Add Null** button that creates a null at the selected layer(s)' anchor position and parents them to it automatically.

## Table of Contents

- [Project Status & Credits](#project-status--credits)
- [Installation](#installation)
- [Options](#options)
- [Looks](#looks)
- [Acknowledgments / Thanks](#acknowledgments--thanks)
- [Contributing](#contributing)
- [License](#license)

## Project Status & Credits

This project started life as a fork of [EF_Manipulate-Anchor-Point](https://github.com/evefalcao/EF_Manipulate-Anchor-Point) by **[Eveline Falcão (@evefalcao)](https://github.com/evefalcao)**, but it has since been **fully reworked from scratch** — the UI was rebuilt independently by [@BinziiBinzet](https://github.com/BinziiBinzet) and the anchor-point engine was replaced entirely with the [PivotCraft](#acknowledgments--thanks) logic. It is no longer a fork; this repository now stands on its own.

That said, this project is still **inspired by Eveline Falcão's original idea**, and all credit for the initial concept goes to her. The anchor-point math powering this panel comes directly from **PivotCraft** — huge thanks to its authors (see [Acknowledgments](#acknowledgments--thanks)).

- **Created & maintained by:** [@BinziiBinzet](https://github.com/BinziiBinzet)
- **Inspired by:** Eveline Falcão ([@evefalcao](https://github.com/evefalcao))
- **Anchor-point engine:** PivotCraft logic (MIT License)

## Installation

> **Note:** This panel is intended to be used with **EffectCraft**, not Adobe After Effects.

1. Download the latest version of this script (`Binzii_AnchorPoint.jsx`).
2. Copy the script file into your EffectsCraft ScriptUI Panels folder:
    - **Windows**: `%APPDATA%\EffectCraft\Scripts\ScriptUI Panels\`
      (this resolves to `AppData\Roaming\EffectCraft\Scripts\ScriptUI Panels` inside your user profile — no need to hardcode a specific username or drive letter)
3. Restart EffectsCraft so the panel gets picked up.

## Options
- Anchor Point grid: a 3x3 grid of arrow buttons (↖ ↑ ↗ / ← • → / ↙ ↓ ↘) wrapped in a centered panel — Top Left, Top Center, ... Bottom Right. Clicking an arrow moves the anchor point there **instantly**. Buttons have no persistent state, so multi-select is impossible by design; every button shows its position in a tooltip.
- Add Null (button): create a null object at the anchor point position of the selected layer(s) **and automatically parent the layer(s) to it** in one click (the layer stays visually in place)
- Rotation-safe math: anchor moves use the PivotCraft logic — bounds via `sourceRectAtTime` plus scale/rotation matrix compensation for **both 2D and 3D layers** (orientation + X/Y/Z rotation), so rotated, scaled or 3D-transformed layers never jump visually when the pivot changes. Animated keyframes (anchor & position, including separated dimensions and Z) are shifted too.
- Tooltips: every control in the panel has a tooltip explaining what it does

> **Rework notes:** compared to the original concept, this panel removes the *Add Expression*, *Rotate Null*, *Apply button*, *Auto Apply checkbox* and *Offset Point* options, as well as the *"Anchor Point"* group title label. The grid now uses plain arrow buttons instead of radio buttons/checkboxes: each click applies immediately with single-selection guaranteed. The anchor-point math was replaced with the full PivotCraft logic (MIT): `sourceRectAtTime` bounds + 2D **and 3D** rotation/scale matrix compensation for position and keyframes (including separated dimensions). Grid buttons are 35x35 px. *Add Null* is a single button that creates a null at the layer's anchor point position and parents the selected layer(s) to it in one click. All UI elements have tooltips. The UI is built with the ScriptUI panel/group pattern (joonas.me style): a bordered panel centers the 3x3 grid inside the palette, with the Add Null button below — fully compatible with EffectCraft (no browser-only `window` object is used).

## Acknowledgments / Thanks

- **PivotCraft** (EffectCraft contributors, MIT License) — huge thanks! The entire anchor-point engine of this project (layer bounds detection via `sourceRectAtTime`, 2D rotation/scale matrix compensation, and the full 3D orientation/rotation matrix math with keyframe-aware position correction) is taken directly from PivotCraft.
- **[Eveline Falcão (@evefalcao)](https://github.com/evefalcao)** — this project is inspired by her original [EF_Manipulate-Anchor-Point](https://github.com/evefalcao/EF_Manipulate-Anchor-Point) script; all credit for the initial concept goes to her.
- Charles Bordenave ([nabscripts.com](https://www.nabscripts.com)) for *Reposition Anchor Point*, and Zack Lovatt ([lova.tt](https://lova.tt/)) for *zl_CreatePivotalNull*, which inspired the original upstream script.

## Looks
<img width="209" height="319" alt="{F76E37FB-CFF0-47FA-96AF-363F793BA6D8}" src="https://github.com/user-attachments/assets/a147230a-e3e2-4503-ae80-e610e996ae4a" />


## Contributing
Contributions are welcome! If you have any ideas for improvement, bug fixes, or new features, please open an issue or submit a pull request.

## License
This work is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License][cc-by-sa].
You're free to remix, tweak, and build upon your work non-commercially as long as you credit and license your new creations under the same terms. You're free to use this script in your workflow. Do not sell this as a product or iterate upon it and sell.

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg

