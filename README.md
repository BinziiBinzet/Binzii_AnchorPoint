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
1. Download the [latest release](https://github.com/evefalcao/EF_Manipulate-Anchor-Point/archive/refs/heads/main.zip) of the script.
2. Copy the script file (`Binzii_AnchorPoint.jsx`) to your After Effects scripts folder:
    - **Windows**: `C:\Program Files\Adobe\Adobe After Effects (version)\Support Files\Scripts\ScriptUI Panels`
    - **Mac**: `/Applications/Adobe After Effects (version)/Scripts/ScriptUI Panels`
3. Alternatively, in After Effects, go to `File > Scripts > Install ScriptUI Panel` select the script file (`Binzii_AnchorPoint.jsx`) and restart After Effects.

## Options
- Anchor Point: select the point in the layer where the anchor point will be moved to
- Offset Point: offset to the anchor point from the selected layer position
- Add Null: add null to anchor point
- Parent to Null: parent layer to null
- Rotate Null: rotate the created null to match the layer rotation
- Auto Apply: auto apply anchor point when activated (next to the Apply button)

> **Fork changes:** compared to the upstream version, this fork removes the *Add Expression* option and adds an *Auto Apply* checkbox that re-runs the script automatically whenever any control changes while it is activated.

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

