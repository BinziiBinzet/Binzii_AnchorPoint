# Binzii Anchor Point

A **ScriptUI panel for EffectCraft** that moves a layer's anchor point via a 3x3 grid — with full **2D & 3D rotation-safe math** (powered by [PivotCraft](#acknowledgments--thanks) logic) — plus a one-click **Add Null** button that creates a null at the selected layer(s)' anchor position and parents them to it automatically.

## Table of Contents

- [Credits](#credits)
- [Installation](#installation)
- [Feature](#feature)
- [Looks](#looks)
- [Contributing](#contributing)
- [License](#license)

## Credits
- **Created & maintained by:** [@BinziiBinzet](https://github.com/BinziiBinzet)
- **Inspired by:** Eveline Falcão ([@evefalcao](https://github.com/evefalcao))
- **Anchor-point engine:** PivotCraft logic (MIT License)

## Installation

> **Note:** This panel is intended to be used with **EffectCraft**, maybe supported for Adobe After Effects.

1. Download the latest version of this script (`Binzii_AnchorPoint.jsx`).
2. Copy the script file into your EffectsCraft ScriptUI Panels folder:
    - **Windows**: `%APPDATA%\EffectCraft\Scripts\ScriptUI Panels\`
3. Restart EffectsCraft so the panel gets picked up.

## Feature
- Anchor Point grid: a 3x3 grid of arrow buttons. Clicking an arrow moves the anchor point there **instantly**. Buttons have no persistent state, so multi-select is impossible by design; every button shows its position in a tooltip.
- Add Null (button): create a null object at the anchor point position of the selected layer(s) **and automatically parent the layer(s) to it** in one click (the layer stays visually in place)
- Support 3D Layer

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

