# 🧮 Spreadsheet Exercise

## Overview

This project is a front-end engineering challenge that involves implementing a simplified spreadsheet application—similar in behavior and UI to Microsoft Excel—using **pure HTML, CSS, and JavaScript**. The main goal is to evaluate your ability to design and implement interactive UI logic, manipulate the DOM, and handle basic formula evaluation without any external libraries or frameworks.

---

## 🎯 Objective

Build a browser-based spreadsheet capable of:

- Rendering a 100x100 cell grid
- Supporting text and numerical inputs
- Evaluating simple formulas and functions
- Preserving data during runtime
- Redrawing the spreadsheet without refreshing the browser
- Providing basic cell formatting capabilities

---

## 🔧 Tech Stack

- **JavaScript**
- **HTML**
- **CSS**

> ⚠️ No third-party libraries (e.g., React, jQuery) or frameworks (e.g., Angular, Vue) are permitted.

---

## 🧱 Implementation Milestones

1. **HTML Initialization**  
   - `index.html` is the entry point.  
   - JavaScript can be embedded or referenced externally.

2. **Grid Rendering**  
   - Renders a 100x100 table dynamically on page load.  
   - Column headers follow Excel-like notation (`A`, `B`, ..., `Z`, `AA`, ..., `CV`).  
   - Rows numbered `1` through `100`.

3. **Data Input and Persistence (In-Memory)**  
   - Cells support numeric input.  
   - Input is stored in a JS object in-memory (non-persistent).

4. **Redraw Mechanism**  
   - A **Refresh** button re-renders the grid from memory without reloading the page.  
   - Retains previously entered values.

5. **Formula Parsing**  
   - Syntax such as `=A1+A2` is supported.  
   - Evaluated expressions reflect changes in dependent cells dynamically.

6. **Function Parsing**  
   - Support for functions like `=sum(A1:A10)`.  
   - Dynamic recalculation upon any data mutation within the specified range.

7. **Formatting Support**  
   - Optional support for **bold**, *italic*, and _underline_ styles applied to cells.


