<h1 align="center">
    Picture Sizer
</h1>
<br/>
<div align="center">
  <!-- <img src="https://img.shields.io/badge/⚙%20Routers%20count-%2048%20Best%20Practices-blue.svg" alt="48 items"/>  -->
  <img id="last-update-badge" src="https://img.shields.io/badge/%F0%9F%93%85%20Last%20update%20-%20September%20042C%202025-green.svg" alt="Last update: September 4, 2025" /> 
  <img src="https://img.shields.io/badge/ %E2%9C%94%20Version%20-%200.0.1-brightgreen.svg" alt="Version 0.0.1"/>
</div>

<div align="center">
  <img src="./preview/gifs/gif.gif" alt="Picture Sizer"/>
</div>

## Welcome!

### Description

Resize screenshots or saved images (snippets) to exact target dimensions (e.g., **512×512**) while preserving **quality** and **aspect ratio**. If the resized image doesn’t fully cover the target size, the remaining area is filled with **transparent padding**.

**Resizing engines:**

-   **Client-side:** [Pica](https://github.com/nodeca/pica) for fast, high-quality in-browser scaling
-   **Server-side:** [Sharp](https://github.com/lovell/sharp) for high-performance processing on the backend

**Tech stack:**

-   **Backend:** [Express.js](https://github.com/expressjs/express)
-   **Frontend:** [Vue.js](https://github.com/vuejs/core)

### Prerequisites

-   Node.js
-   NPM or Yarn installed

# 1. How to launch this project

**[✔] 1.1 Start from frontend**

-   Run inside the root of the project:

```bash
cd frontend
```

to access frontend part

**[✔] 1.2 Install dependencies**

-   To install the required packages run:

```bash
npm install
```

**[✔] 1.3 Launch the project**

-   To build project use:

```bash
npm run build
```

**[✔] 2.1 Start from backend**

-   Run inside the root of the project:

```bash
cd backend
```

if you are inside frontend run:

```bash
cd ../backend
```

to access backend part

**[✔] 2.2 Install dependencies**

-   To install the required packages run:

```bash
npm install
```

**[✔] 2.3 Build project**

-   To build project use:

```bash
npm run build
```

**[✔] 2.4 Launch the project**

-   To start project run:

```bash
nodemon server.js
```

if you don't have nodemon use `node .`, `node server.js`.
