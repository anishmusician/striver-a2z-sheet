# 🚀 Striver's A2Z DSA Sheet (100% Free & Unlocked 1:1 Clone)

A modern, high-performance, and paywall-free 1:1 clone of **Striver's A2Z DSA Sheet** (from takeUforward), specifically built so you can learn, solve, and master all DSA concepts freely without credit restrictions, subscriptions, or logins.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanishmusician%2Fstriver-a2z-sheet)

---

## ✨ Key Highlights & Features

### 1. **Exact 1:1 takeUforward Solving Area (`/plus/dsa/problems/[slug]`)**
- **Full-Screen 2-Column IDE**:
  - **Left Pane (Learning & Content Tabs)**:
    - **Description**: Authentic problem statements with rich formatting, bold highlights, code spans, and **diagrams/images** (with click-to-zoom lightbox).
    - **Examples**: Formatted dark cards with Input, Output, and step-by-step Explanations.
    - **Constraints**: Styled mathematical constraints with exponential notation.
    - **Hints**: Collapsible accordion hints so you can get unstuck without spoilers.
    - **Editorial**: Multi-approach solutions (Brute Force, Better, Optimal) with Time/Space complexity badges, embedded YouTube video solutions, and article deep-dives.
    - **Submissions**: History of all attempts (Accepted, Runtime Error, Wrong Answer) with execution times and code restore.
    - **Notes**: Full personal Markdown notes with complexity helper buttons and automatic LocalStorage persistence.
  - **Right Pane (Code Studio & Testcases Runner)**:
    - **Languages Supported**: C++, Java, Python, JavaScript.
    - **Code Editor**: Monaco-style editor with line numbers, 4-space tab indentation, auto-closing brackets, and keyboard shortcuts (`Ctrl+S` to save, `Ctrl+Enter` to run).
    - **Testcases Panel**: Tabbed testcases (Case 1, Case 2, Case 3) + Custom Input testing.
    - **Execution Sandbox**: Runs Python in-browser via Pyodide WebAssembly and JavaScript in sandboxed V8. **Zero credits used, zero backend required.**
    - **Submit & Confetti**: Evaluates solution, marks problem as Solved, logs to submissions history, and fires celebration confetti!

### 2. **Complete 18-Step Curriculum (474 Problems)**
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

### 3. **Clean Links & Direct Practice**
- Real, verified practice links for **LeetCode** and **GeeksforGeeks**.
- Empty/paywalled links cleanly display `---` with no broken icons.
- Instant YouTube lecture modals with exact timestamp seeking.

### 4. **Progress Tracking & Analytics**
- Real-time circular completion ring & overall percentage (`0 / 474`).
- Step-by-step progress meters with subtopic collapsible accordions.
- Difficulty breakdown: **Easy**, **Medium**, and **Hard** solved counts.
- **Study Streak Counter**: Automatically tracks daily DSA practice.
- **Revision Star**: One-click star problems to revise before interviews.
- **Random Problem Picker**: Shuffle button for daily mock practice.

### 5. **100% Client-Side, Offline & Private**
- **Export Progress**: Download a complete JSON backup of all your solved problems, code, and notes with 1 click.
- **Import Progress**: Restore your progress anytime on any machine or browser.
- No login, no telemetry, complete data ownership.

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/anishmusician/striver-a2z-sheet.git
cd striver-a2z-sheet

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🌐 Deploying to Vercel

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select your repository: **`anishmusician/striver-a2z-sheet`**.
3. Framework Preset: **Vite** (detected automatically).
4. Click **Deploy**. Your site will be live on a `*.vercel.app` URL with automatic continuous deployment on every git push!

### Option 2: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompts to link and deploy to production (`npx vercel --prod`).

---

## 📂 Project Structure

```
DSA/
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx          # All Problems / Revision tabs, Search, Status & Difficulty dropdowns
│   │   ├── Navbar.tsx             # Header navigation
│   │   ├── ProblemRow.tsx         # Problem row with status, title, links, and difficulty
│   │   ├── ProblemTable.tsx       # Exact 9-column takeUforward problem table
│   │   ├── ProblemWorkspace.tsx   # 1:1 takeUforward solving area with split IDE & runner
│   │   ├── Sidebar.tsx            # Left navigation sidebar with streak & backup tools
│   │   ├── StatsDashboard.tsx     # Progress ring, streak, and difficulty counters
│   │   ├── StepAccordion.tsx      # Collapsible 18-step hierarchy & sub-steps
│   │   └── VideoModal.tsx         # YouTube timestamped player modal
│   ├── data/
│   │   ├── a2z-sheet.json         # All 18 Steps, 70+ categories, 474 problems
│   │   ├── problem-details.json   # Full problem statements, diagrams, constraints, testcases
│   │   └── problemsData.ts        # Fast O(1) problem details accessor
│   ├── hooks/
│   │   └── useDSAProgress.ts      # LocalStorage progress, streaks, submissions, backups
│   ├── types/
│   │   └── dsa.ts                 # Strong TypeScript type definitions
│   └── index.css                  # Tailwind CSS v4 + authentic takeUforward dark theme tokens
├── vercel.json                    # Single-page application route rewrites
└── README.md
```

---

## 📜 License
MIT License. Created for the developer community to learn DSA freely with zero paywalls.
