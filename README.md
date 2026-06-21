<div align="center">

# 👾 GAME BOY OS 👾

<br>
<img src="./img/ui_screenshot.png" alt="Game Boy OS Screenshot" width="400"/>
<br>

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)

**A modern, lightweight, high-performance web-based simulation of a classic handheld system, featuring a growing collection of nostalgic games built from scratch.**

</div>

---

## 📱 Mobile Experience

Game Boy OS is fully responsive and supports touch controls out of the box! For the most immersive retro experience:
- Open the application on your mobile device.
- You can play in both **Upright (Portrait)** or **Landscape** orientations.
- The UI scales beautifully to match the screen, simulating a real handheld console right in your hands!

---

## 🎨 The 8-Bit Palette

This project adheres to the classic 4-color dot-matrix palette for ultimate nostalgia:

| Color Hex | Preview | Description |
| :---: | :---: | :--- |
| **`#0f380f`** | 🟩 | **Darkest Green** (Shadows & Outlines) |
| **`#306230`** | 🫑 | **Dark Green** (Mid-tones) |
| **`#8bac0f`** | 🥬 | **Light Green** (Highlights) |
| **`#9bbc0f`** | 🍐 | **Lightest Green** (Background) |

---

## 🕹️ Controls & Key Bindings

These keyboard controls are designed for desktop/large screens. You can play using the default key bindings listed below, or fully customize them to your preference by clicking the **KEY BINDINGS** button at the top of the screen!

| Action | Game Boy Button | Default Keyboard Key |
|---|---|---|
| **Move Up** | `▲` D-Pad Up | `ArrowUp` |
| **Move Down** | `▼` D-Pad Down | `ArrowDown` |
| **Move Left** | `◀` D-Pad Left | `ArrowLeft` |
| **Move Right** | `▶` D-Pad Right | `ArrowRight` |
| **Action A** | `(A)` | `z` |
| **Action B** | `(B)` | `x` |
| **Start** | `START` | `Enter` *(Play / Start game)* |
| **Select** | `SELECT` | `Shift` *(Exit to Menu / Reset)* |

---


## 💾 Current Game Catalog

Our custom cartridge includes the following list of games. This is the current catalog, and it will continue to grow as developers contribute new games! Select them from the OS Menu:

| | Title | Genre | Description |
|---|---|---|---|
| 💣 | **Bomber Boy** | Action | Maze exploration with strategic bomb placement. |
| 💥 | **Brick Breaker**| Arcade | Retro brick deflection layout with bounce physics. |
| 🐱 | **Catrap** | Logic | Re-imagination of the vintage Game Boy puzzle mechanic. |
| 🛸 | **Invaders** | Arcade | A fast-paced space defense shooter. |
| 🏓 | **Pong** | Sports | Simple AI-driven paddle tennis simulation. |
| 🪂 | **Skydive** | Action | Free fall downward, avoiding obstacles on your way down. |
| 🐍 | **Snake** | Arcade | Guide the snake, consume food, avoid yourself. |
| 🧱 | **T2 (Tetris 2)** | Puzzle | Fall and fit blocks together in classic puzzle fashion. |
| ⚔️ | **Tale of Orb** | RPG | A complete RPG adventure with dungeon grids. |

---

## 🏗️ Internal Circuitry (Architecture)

```text
game-boy-os/
├── index.html          # Web page entry containing the Game Boy frame (Canvas)
├── src/
│   ├── main.js         # Core loop, OS boot-loader, and system-level routing
│   ├── style.css       # Retro custom styles (rotation, gamepad toggle, overlays)
│   ├── engine/         # System display & input managers
│   │   ├── display.js  # Screen orientation and rendering setups
│   │   ├── input.js    # Keyboard binding handlers & virtual gamepad events
│   │   └── state.js    # Global configurations, shapes/text draw tools
│   └── games/          # Game cartridges folder (contains index.js and game modules)
```

---

## 🤝 How to Contribute (Beginner Friendly!)

We welcome developers of all skill levels! Whether you want to add a new game, fix a bug, or improve documentation, we'd love your help.

Check out our step-by-step **[Contributing Guide (CONTRIBUTING.md)](./CONTRIBUTING.md)** to learn how to:
1. Setup the project locally and run the development server.
2. Build your own game cartridge using our 8-bit JavaScript game blueprint.
3. Submit your pull request.

If you get stuck, feel free to open an issue or ask for help. We are happy to guide you!


---

## 📄 License

This project is **100% Free and Open-Source**. 

It is distributed under the [MIT License](LICENSE), which means you can use it, modify it, and share it freely without any cost. See the `LICENSE` file for more details.

---

<div align="center">
    <b>Have fun, stay nostalgic, and happy hacking! 👾</b><br>
    <i>If you build a cool game, open a Pull Request!</i>
</div>
