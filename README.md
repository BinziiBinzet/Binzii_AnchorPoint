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
- Anchor Point: select the point in the layer where the anchor point will be moved to (radio grid)
- Offset Point: offset to the anchor point from the selected layer position
- Add Null (button): add a null object at the new anchor point position of the selected layer(s)
- Parent to Null (button): parent the selected layer(s) to the last null created by the script (click *Add Null* first)
- Auto Apply (checkbox, next to the Apply button): automatically re-applies the **anchor point** only (radio grid + offset fields) whenever those controls change while it is activated. The *Add Null* and *Parent to Null* buttons are manual actions and are **not** affected by Auto Apply.
- Tooltips: every control in the panel has a tooltip explaining what it does

> **Fork changes:** compared to the upstream version, this fork removes the *Add Expression* and *Rotate Null* options, converts *Add Null* / *Parent to Null* from checkboxes into standalone buttons, adds an *Auto Apply* checkbox limited to the anchor point controls, and adds tooltips for all UI elements.

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

