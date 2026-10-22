# Manipulate Anchor Point
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/M4M212BC7C)

ScriptUI that moves the anchor point of a layer, with options to create a null and/or add anchor point expression and offset it.

## Table of Contents

- [About This Fork](#about-this-fork)
- [Installation](https://github.com/evefalcao/EF_Manipulate-Anchor-Point?tab=readme-ov-file#installation)
- [Options](https://github.com/evefalcao/EF_Manipulate-Anchor-Point?tab=readme-ov-file#options)
- [Examples](https://github.com/evefalcao/EF_Manipulate-Anchor-Point?tab=readme-ov-file#examples)
- [Contributing](https://github.com/evefalcao/EF_Manipulate-Anchor-Point?tab=readme-ov-file#contributing)
- [License](https://github.com/evefalcao/EF_Manipulate-Anchor-Point?tab=readme-ov-file#license)

## About This Fork

This repository is a **fork** of [EF_Manipulate-Anchor-Point](https://github.com/evefalcao/EF_Manipulate-Anchor-Point), originally created by **[Eveline Falcão (@evefalcao)](https://github.com/evefalcao)**.

All original credit for the script and its concept goes to the upstream author. This fork exists so I can keep my own copy and apply personal modifications to it. If you like the original work, please consider supporting the author via their [Ko-fi page](https://ko-fi.com/M4M212BC7C).

- **Upstream repository:** https://github.com/evefalcao/EF_Manipulate-Anchor-Point
- **Original author:** Eveline Falcão ([@evefalcao](https://github.com/evefalcao))
- **Forked by:** [@BinziiBinzet](https://github.com/BinziiBinzet)
- **License:** CC BY-SA 4.0 (same as upstream — attribution and share-alike terms apply)

## Installation

> **Note:** This fork is intended to be used with **EffectsCraft**, not Adobe After Effects.

1. Download the latest version of this script (`Binzii_AnchorPoint.jsx`).
2. Copy the script file into your EffectsCraft ScriptUI Panels folder:
    - **Windows**: `%APPDATA%\EffectCraft\Scripts\ScriptUI Panels\`
      (this resolves to `AppData\Roaming\EffectCraft\Scripts\ScriptUI Panels` inside your user profile — no need to hardcode a specific username or drive letter)
3. Restart EffectsCraft so the panel gets picked up.

## Options
- Anchor Point grid: a 3x3 grid of arrow buttons (↖ ↑ ↗ / ← • → / ↙ ↓ ↘) wrapped in a centered panel — Top Left, Top Center, ... Bottom Right. Clicking an arrow moves the anchor point there **instantly**. Buttons have no persistent state, so multi-select is impossible by design; every button shows its position in a tooltip.
- Add Null (button): create a null object at the anchor point position of the selected layer(s) **and automatically parent the layer(s) to it** in one click (the layer stays visually in place)
- Rotation-safe math: anchor moves use PivotCraft-style bounds (`sourceRectAtTime`) plus a 2D scale/rotation matrix compensation, so rotated or scaled layers never jump visually when the pivot changes
- Tooltips: every control in the panel has a tooltip explaining what it does

> **Fork changes:** compared to the upstream version, this fork removes the *Add Expression*, *Rotate Null*, *Apply button*, *Auto Apply checkbox* and *Offset Point* options, as well as the *"Anchor Point"* group title label. The grid now uses plain arrow buttons instead of radio buttons/checkboxes: each click applies immediately with single-selection guaranteed. The anchor-point math was replaced with the PivotCraft logic (MIT): `sourceRectAtTime` bounds + 2D rotation/scale matrix compensation for position and keyframes (including separated dimensions). Grid buttons are 35x35 px. *Add Null* is a single button that creates a null at the layer's anchor point position and parents the selected layer(s) to it in one click. All UI elements have tooltips. The UI is built with the ScriptUI panel/group pattern (joonas.me style): a bordered panel centers the 3x3 grid inside the palette, with the Add Null button below — fully compatible with EffectsCraft (no browser-only `window` object is used).

## Examples
Work in progress.

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

