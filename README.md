# 🚀 Striver's A2Z DSA Sheet (100% Free & Unlocked Clone)

A modern, high-performance, and paywall-free clone of **Striver's A2Z DSA Sheet** (from takeUforward), specifically built so you can learn and practice all DSA concepts freely without credit restrictions, subscriptions, or logins.

---

## ✨ Key Highlights & Features

1. **Complete 18-Step Curriculum (474 Problems)**
   - Authentically extracted all 18 steps and 70+ subcategories directly from the latest curriculum:
     - **Step 1**: Learn the basics (Basics, Patterns, STL/Collections, Maths, Recursion, Hashing)
     - **Step 2**: Sorting Techniques (Selection, Bubble, Insertion, Merge, Quick)
     - **Step 3**: Arrays (Easy, Medium, Hard)
     - **Step 4**: Binary Search (1D, 2D Arrays, Search Space)
     - **Step 5**: Strings (Basic & Medium)
     - **Step 6**: Linked Lists (Singly, Doubly, Medium, Hard)
     - **Step 7**: Recursion (Patterns, Subsequences, Combinations)
     - **Step 8**: Bit Manipulation (Basics, Interview Problems, Advanced)
     - **Step 9**: Stacks & Queues (Prefix/Infix/Postfix, Monotonic Stack, Implementations)
     - **Step 10**: Sliding Window & Two Pointers
     - **Step 11**: Heaps & Priority Queues
     - **Step 12**: Greedy Algorithms
     - **Step 13**: Binary Trees (Traversals, Medium & Hard)
     - **Step 14**: Binary Search Trees (Concepts & Practice)
     - **Step 15**: Graphs (BFS/DFS, Cycles, Shortest Path, MST, Disjoint Set)
     - **Step 16**: Dynamic Programming (1D, 2D/3D, Subsequences, Stocks, LIS, MCM, Partition)
     - **Step 17**: Tries (Theory, Operations, XOR problems)
     - **Step 18**: Advanced Strings (KMP, Z-algorithm, Rabin Karp)

2. **Zero Credits / 100% Free Solve Links**
   - **Direct LeetCode links**: 1-click jump to the official LeetCode problem.
   - **Direct GeeksforGeeks practice links**: Clean links to GFG practice problems without navigating paywalls.
   - **Free YouTube Video Solutions**: Watch Striver's YouTube lectures with exact timestamps directly in an embedded popup player or in a new tab.
   - **takeUforward Free Articles**: Direct links to comprehensive editorial articles.

3. **In-Browser Code Sandbox & Runner (Zero Credits Needed)**
   - Write solutions in **Python**, **C++**, **Java**, or **JavaScript**.
   - Starter template preloaded for every single problem.
   - **Client-Side Execution**:
     - Runs **Python** directly in your browser using Pyodide (WebAssembly) with standard library support (`print()`, collections, math, etc.)!
     - Runs **JavaScript** directly in browser sandbox.
     - Zero backend server, zero latency, zero credits used.
   - **Saved Code**: Automatically stores your personal code solution for every problem in `localStorage`.

4. **Personal Notes & Revision System**
   - Save custom Markdown notes for each problem (intuition, edge cases, Time & Space complexities).
   - "Star" problems for revision before upcoming interviews.
   - Quick filters: View only **Starred**, **Unsolved**, **In Progress**, or **Solved** problems.

5. **Progress Tracking & Analytics**
   - Real-time overall completion bar & percentage.
   - Step-by-step progress bars (e.g. `24 / 40`).
   - Difficulty breakdown: **Easy**, **Medium**, and **Hard** counters.
   - **Study Streak Counter**: Automatically tracks consecutive days of solving DSA questions.
   - Confetti celebration 🎉 on completing problems and steps!

6. **100% Client-Side & Portable (You Own Your Data)**
   - **Export Progress**: Download a complete JSON backup of all your solved problems, code, and notes with 1 click.
   - **Import Progress**: Restore your progress anytime on any machine or browser.
   - No login, no telemetry, complete privacy.

---

## 🛠️ Quick Start

To run the development server locally:

```bash
# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

To build for production (e.g. for GitHub Pages, Vercel, or local static hosting):

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
DSA/
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx          # Search, difficulty, status, and step jump filters
│   │   ├── Navbar.tsx             # Header, streak, export/import JSON, reset
│   │   ├── ProblemRow.tsx         # Individual problem row with action links & indicators
│   │   ├── ProblemWorkspace.tsx   # In-browser code editor, Pyodide runner, & notes
│   │   ├── StatsDashboard.tsx     # Metrics, difficulty split, streak, revision queue
│   │   ├── StepAccordion.tsx      # Collapsible 18-step hierarchy & subcategories
│   │   └── VideoModal.tsx         # YouTube timestamped player modal
│   ├── data/
│   │   └── a2z-sheet.json         # All 474 problems and metadata
│   ├── hooks/
│   │   └── useDSAProgress.ts      # LocalStorage progress manager, streak, export/import
│   ├── types/
│   │   └── dsa.ts                 # TypeScript type definitions
│   ├── App.tsx                    # Main layout and state orchestrator
│   └── main.tsx                   # React root entry point
├── scripts/
│   └── prepare_dataset.py         # Enrichment script for the sheet dataset
└── package.json
```
