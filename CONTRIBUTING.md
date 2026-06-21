# Contributing to Game Boy OS 🤝

We welcome developers of all skill levels! Whether you want to add a new game, fix a bug, improve performance, or update documentation, this guide will help you get started.

---

## 🚀 1. Boot Sequence (Local Setup)

To run the project locally, make sure you have [Node.js](https://nodejs.org) installed.

1. **Fork the Repository**: Click the "Fork" button at the top right of the GitHub page to create your own copy.
2. **Clone your Fork**: Download your copy to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/game-boy-os.git
   cd game-boy-os
   ```
3. **Install Dependencies**: Install the necessary development tools:
   ```bash
   npm install
   ```
4. **Run Local Dev Server**: Start the local Vite server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.
5. **Build Check**: Verify that compiling works:
   ```bash
   npm run build
   ```

---

## 🛠️ 2. DevKit: Add Your Own Game

Game Boy OS cartridge menu automatically registers and renders games. Here is how you can write and plug in your own game:

### Step 1: Create a Branch
Always make a new branch for your game:
```bash
git checkout -b game/my-cool-game
```

### Step 2: Create Your Game File
Create a new file: `src/games/my_cool_game.js`

### Step 3: Implement the Game Blueprint
Every game must export a standard object matching this template:

```javascript
import { M, ctx, C0, C1, C2, C3, txt, fr, sr, state } from '../engine/state.js';

export const MyCoolGame = {
    // 1. Name of the game (displayed in the menu list)
    n: "MY COOL GAME",

    // 2. Setup initial variables/state
    ini() {
        this.score = 0;
        this.playerX = 100;
    },

    // 3. Update game ticks (dt = delta time in milliseconds)
    upd(dt) {
        if (state.k.L) this.playerX -= 0.1 * dt; // Move left
        if (state.k.R) this.playerX += 0.1 * dt; // Move right
    },

    // 4. Handle button press triggers (A, B, START, SELECT, etc.)
    inp(btn) {
        if (btn === 'A') {
            this.score++;
        }
    },

    // 5. Render to the 200x200 canvas
    drw() {
        txt("SCORE: " + this.score, 10, 20, 8, 'left');
        fr(this.playerX, 150, 16, 16, C0); // Draw player
    },

    // 6. Draw a custom 80x50 retro thumbnail art for the main menu list
    art(x, y, w, h) {
        fr(x, y, w, h, C3); // Background
        sr(x, y, w, h, C0); // Border
        txt("COOL", x + w/2, y + h/2, 10, 'center');
    }
};
```

### Step 4: Register the Game
Open `src/games/index.js` and import and append your game:

```diff
+import { MyCoolGame } from './my_cool_game.js';

-export const GL = [T2, CR, IV, SN, SD, PG, BB, RP, BM];
+export const GL = [T2, CR, IV, SN, SD, PG, BB, RP, BM, MyCoolGame];
```

---

## 🎨 Design Rules (The 8-Bit Palette)
To maintain the authenticity of the console, you should only use the four primary Game Boy color constants exported from `../engine/state.js`:
*   `C0`: Darkest Green (`#0f380f`)
*   `C1`: Dark Green (`#306230`)
*   `C2`: Light Green (`#8bac0f`)
*   `C3`: Lightest Green (`#9bbc0f`)

---

## 📥 3. Submit Your Contribution

1. **Commit and Push**:
   ```bash
   git commit -am "feat: added my cool game"
   git push origin game/my-cool-game
   ```
2. **Open a Pull Request**: Submit your pull request to the `main` branch of the `OpenRetroDevs/game-boy-os` repository.
3. **Check CI/CD**: Ensure the automated build verification check passes. We'll review your PR and merge it!
