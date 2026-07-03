# 🏰 Tower Defense

**Tower Defense** is a browser-based 2D strategy game built with **JavaScript** and **HTML5 Canvas**, where the player defends a path against waves of enemies by placing different tower types on the map.

The game combines **grid-based map design**, **wave spawning**, **tower placement**, **enemy path progression**, **projectile combat**, and **resource management** to create a complete tower defense experience inside the browser.

This project demonstrates key game development concepts such as **object-oriented JavaScript**, **real-time rendering**, **collision and targeting systems**, **wave progression**, and **interactive UI design**.

---

## 🧠 About the Project

Tower Defense is inspired by classic strategy defense games where the player must stop enemies from reaching the end of a path.

The player begins with a limited amount of money and lives. By placing towers on valid cells, the player can attack incoming enemies before they reach the endpoint. Each enemy that reaches the end reduces the player’s lives, while each defeated enemy rewards money that can be used to place more towers.

The project was built to practice and demonstrate:

* **game loop architecture**
* **grid-based map systems**
* **enemy wave spawning**
* **tower targeting and shooting logic**
* **projectile and health systems**
* **UI interactions with mouse-based tower placement**
* **game state management for victory and defeat**

The result is a playable tower defense game implemented fully with front-end web technologies.

---

## 🧱 Project Structure

```bash id="y2xj1m"
Tower-Defense/
├── index.html                     # Main game page
├── game.js                        # Core game engine, loop, keyboard/mouse input
├── myCode.js                      # Tower defense gameplay logic and game objects
├── assets/
│   └── sounds/
│       └── Background-Music.mp3   # Background soundtrack
├── README.md
└── .gitignore
```
---

## 🎮 Gameplay Overview

The game takes place on a grid-based map that contains:

* **path cells** where enemies travel
* **grass cells** where towers can be placed
* **start and end points** for the enemy route
* **blocked cells** that cannot be used

The player must place towers strategically to stop waves of enemies before they reach the end of the path.

### The player can:

* select a tower type from the UI panel
* place towers on valid green cells
* spend money to build defenses
* earn money by defeating enemies
* survive multiple waves to win the game

### The game ends when:

* **all waves are completed** → **You Win**
* **lives drop to 0** after too many enemies reach the end → **Game Over**

---

## 🚀 Features

* 🏰 **Tower Placement System** – place towers only on valid buildable cells
* 🎯 **Targeting & Shooting Logic** – towers automatically detect enemies in range and fire projectiles
* 👾 **Enemy Waves** – enemies spawn in multiple waves with increasing difficulty
* 💥 **Projectile System** – bullets track targets and deal damage on impact
* 💰 **Economy System** – earn money by defeating enemies and spend it on new towers
* ❤️ **Lives System** – lose lives when enemies reach the end of the path
* 📊 **Live Game Stats** – track money, lives, kills, wave number, and selected tower
* 🎵 **Background Music** – looping soundtrack during gameplay
* 🏁 **Win / Lose States** – full game-end handling with overlays
* 🖱️ **Interactive UI** – tower selection and placement through mouse clicks
* 🗺️ **Custom Grid Map** – path, grass, blocked, start, and end cells rendered in the game area

---

## 🧩 Core Components

The project is structured around several gameplay classes.

### **Game**

Responsible for:

* creating the canvas context
* running the game loop
* storing sprites
* handling keyboard and mouse events

### **GameState**

Acts as the main controller of the tower defense game. It manages:

* money, lives, kills, and wave progression
* tower selection and placement
* enemy spawning
* win and game-over states
* path generation and map setup

### **Cell**

Represents a single map tile. Each cell can be:

* **G** → grass / buildable tower cell
* **P** → enemy path
* **S** → start cell
* **E** → end cell
* **B** → blocked cell

### **Tower**

Represents a defensive tower placed by the player. Towers automatically target enemies in range and fire bullets.

### **Enemy**

Represents an enemy traveling along the predefined path toward the endpoint. Each enemy has:

* health
* speed
* reward value
* path progression state

### **Bullet**

Represents a projectile fired by a tower. Bullets track a target, move toward it, and deal damage on impact.

### **UIButton / UIText / UIPanel**

These classes handle the in-game interface for:

* tower selection
* game stats display
* side panel rendering

### **EndLabel**

Displays the final overlay when the player wins or loses.

---

## 🏹 Tower Types

The game currently includes **three tower types**, each with different strengths.

### 1. **Basic Tower**

* balanced range, fire rate, and damage
* cost-effective default option

### 2. **Sniper Tower**

* high range
* high damage
* slower firing speed
* useful for hitting enemies earlier from a distance

### 3. **Rapid Tower**

* lower damage per shot
* very fast attack speed
* useful for sustained damage against faster enemies

This creates a simple strategy layer where the player must decide which tower mix is best for each wave.

---

## 👾 Enemy Types

The game currently includes multiple enemy types:

### **Normal Enemy**

* balanced health and speed

### **Fast Enemy**

* lower health but higher speed

### **Tank Enemy**

* high health, slower movement, and higher reward

Enemy types vary by wave, increasing the game’s difficulty and encouraging better tower placement strategy.

---

## 📈 Game Progression

The game progresses through **multiple waves** of enemies.

As waves increase:

* more enemies are spawned
* stronger enemy types begin appearing
* the player must manage resources more carefully
* tower choice and placement become more important

The player wins after surviving all configured waves.

---

## 🧰 Tech Stack

| Category         | Technology                 |
| ---------------- | -------------------------- |
| **Language**     | JavaScript                 |
| **Rendering**    | HTML5 Canvas               |
| **Architecture** | Object-Oriented JavaScript |
| **Audio**        | HTML5 Audio                |
| **Frontend**     | HTML, CSS, JavaScript      |

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash id="4b1c8w"
git clone https://github.com/MarcoBitar/Tower-Defense.git
cd Tower-Defense
```

### 2️⃣ Make sure the project contains:

* `index.html`
* `game.js`
* `myCode.js`
* `assets/sounds/Background-Music.mp3`

---

## ▶️ Running the Game

Since this is a browser-based JavaScript game, you can run it by opening the main HTML file in your browser.

### Option 1: Open directly

Open:

```bash id="j2nqq5"
index.html
```

in your browser.

### Option 2: Run with VS Code Live Server

If you are using **VS Code**, running the project with **Live Server** is recommended for smoother development and easier asset loading.

---

## 🖱️ Controls

| Input                           | Action                              |
| ------------------------------- | ----------------------------------- |
| **Mouse Click on Tower Button** | Select a tower type                 |
| **Mouse Click on Green Cell**   | Place selected tower                |
| **Automatic Gameplay**          | Towers attack enemies automatically |

---

## 📌 Current Game Logic Summary

The current implementation includes:

* a **10×10 custom grid map**
* **start-to-end enemy path**
* **tower placement restricted to buildable cells**
* **three unique tower types**
* **normal, fast, and tank enemies**
* **enemy waves with progression**
* **projectile-based combat**
* **money, kills, lives, and wave tracking**
* **victory and game-over overlays**
* **side UI panel for tower selection and game information**
* **background music**

---

## 🌟 Possible Future Enhancements

The project can be expanded with more advanced tower defense mechanics, such as:

* 🌊 **More wave types** with custom enemy patterns
* 🧠 **Smarter enemy behavior** or alternate pathing
* ⬆️ **Tower upgrade system** to improve damage, range, or fire rate
* 💣 **Special towers** such as splash-damage or slowing towers
* 🎯 **Projectile effects** like explosions, freeze, or poison
* 🏆 **High score / survival mode**
* ⏸️ **Pause / restart buttons**
* 🗺️ **Multiple maps and difficulty levels**
* 🎨 **Improved sprites, animations, and effects**
* 🔊 **Additional sound effects for tower shots, enemy deaths, and wave starts**

---

## 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your fork
5. Open a pull request

---

## 👨‍💻 Author

**Marco Bitar**
🎓 Computer Science Student
📧 [bitar.marco21@gmail.com](mailto:bitar.marco21@gmail.com)
🌐 [GitHub](https://github.com/MarcoBitar) | [LinkedIn](https://www.linkedin.com/in/marco-bitar-545046285)
