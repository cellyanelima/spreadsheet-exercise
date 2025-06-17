let spreadsheetData = {}
let columnIndex = {}
let numOfRowsTable = 100
let numOfColumnsTable = 100
let selectedCell = null

/**
 * 2. When loading index.html into Chrome or Firefox, it should draw a 100x100 grid of cells,
 *    with columns labelled A-Z, AA, AB, AC, etc. and rows numbered 1 to 100.
 */
function createTable(numRows, numColumns) {
  let table = document.createElement('table')

  // Loop over all rows (lines)
  for (let r = 0; r <= numRows; r++) {
    let row = document.createElement('tr')

    // Checking if it is the first line (header)
    if (r === 0) {
      // Create all colunmn labels
      for (let c = 0; c <= numColumns; c++) {
        let cell = document.createElement('th')
        // First cell must be empty
        if (c !== 0) {
          const columnLetter = getLettersHeader(c - 1)
          cell.innerText = columnLetter
          // Map the column letter to index (number) object
          columnIndex[columnLetter] = c
        }
        row.appendChild(cell)
      }
    } else {
      for (let c = 0; c <= numColumns; c++) {
        let cell = document.createElement('td')

        if (c === 0) {
          cell.innerText = r
        } else {
          // Assign a ID to each cell as 'column+row', like A1, B2...
          const columnLetter = getLettersHeader(c - 1)
          const id = `${columnLetter}${r}`
          cell.dataset.id = id // Attribute: data-id

          // Reloading the previous data before refresh button
          cell.innerText = spreadsheetData[id]?.value || ''

          // Events
          // Start editing mode
          cell.ondblclick = (e) => {
            const cell = e.target
            startEditMode(cell)
          }

          // Finish edit mode when focus is gone
          cell.onblur = (e) => {
            const cell = e.target
            exitEditMode(cell)
          }

          // Finish editing mode when press Enter
          cell.onkeydown = (e) => {
            if (e.key == 'Enter') cell.blur()
          }

          // Bold / Italic / Underline / Selected
          cell.onclick = (e) => {
            const cell = e.target
            if (selectedCell) selectedCell.classList.remove('selected')
            selectedCell = cell
            selectedCell.classList.add('selected')
          }
        }
        row.appendChild(cell)
      }
    }
    table.appendChild(row)
  }
  return table
}

/**
 * This function reads the position as parameter and calculate the header letters
 */
function getLettersHeader(position) {
  let alphabet = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]

  let letters = ''
  while (position >= 0) {
    letters = alphabet[position % alphabet.length] + letters
    position = Math.floor(position / alphabet.length) - 1
  }

  return letters
}

function drawGrid() {
  let grid = document.getElementById('grid')
  let table = createTable(numOfRowsTable, numOfColumnsTable)
  // Cleanup the previous table if exists
  grid.innerHTML = ''
  grid.appendChild(table)
}

/**
 * 3. When you click in a cell and enter a number, it should store the number in a JavaScript
 *    object (note: this would be lost when you refresh the page).
 */
function startEditMode(cell) {
  const id = cell.dataset.id

  // Replace the value of this TD to the formula if exists
  // The formula contained in the cell reappears
  const cellData = spreadsheetData[id]
  if (cellData?.formula.length > 0) {
    cell.innerText = cellData.formula
  }

  // Enable edit mode
  cell.contentEditable = true
  cell.focus()
}

function exitEditMode(cell) {
  const id = cell.dataset.id

  // Create the cell object, if it does not already exist
  if (!spreadsheetData[id]) spreadsheetData[id] = {}
  let cellData = spreadsheetData[id]

  // Update the raw value/formula first
  let newValue = cell.innerText.trim()
  if (newValue.startsWith('=')) {
    cellData.formula = newValue.toUpperCase()
    cellData.value = calculate(cellData.formula)

    // Update the cell with the calculated value
    cell.innerText = cellData.value
  } else {
    cellData.formula = ''
    cellData.value = newValue
  }

  // Update the remaining cells with formulas
  updateFormulaCells(id)

  // Disable edit mode
  cell.contentEditable = false
}

/**
 * 4. Have a refresh button that redraws the grid (without refreshing the page) and inserts data
 *    into cells where you've saved it.
 */
document.getElementById('refresh').onclick = (e) => {
  let grid = document.getElementById('grid')
  grid.innerHTML = 'Loading table...'
  setTimeout(() => drawGrid(), 100)
}

/*
 * 5. Add support for some basic formulas. For example if you enter "=A1+A2" into A3 it
 *    should calculate the sum of these two cells and display the result in A3. Updating A1 would
 *    update A3.
 */
function calculate(formula) {
  formula = formula.slice(1) // Remove "="

  if (formula.startsWith('SUM')) {
    formula = rangeCells(formula)
  }

  try {
    // Replaces references like A1, B2, etc
    formula = formula.replace(/([A-Z]+[0-9]+)/g, (idElement) => {
      const cellDataElement = spreadsheetData[idElement]
      return cellDataElement?.value || 0
    })
    return eval(formula)
  } catch (e) {
    return '#ERROR'
  }
}

// Update all cells (except the current) which contains formulas
function updateFormulaCells(currentId) {
  for (let id in spreadsheetData) {
    // Skipping the current one
    if (id !== currentId) {
      let cellData = spreadsheetData[id]

      // Checking if it is a formula
      if (cellData.formula.startsWith('=')) {
        cellData.value = calculate(cellData.formula)

        // Refreshing values on screen
        const cell = document
          .getElementById('grid')
          .querySelector(`[data-id="${id}"]`)

        if (cell) cell.innerText = cellData.value
      }
    }
  }
}

/*
 * 6. Add support for some basic functions. For example if you enter "=sum(A1:A10)" into
 *    A11, then it should calculate the sum of all cells in the range and display the result in
 *    A11. Updating any value in the range would recalculate A11.
 */
function rangeCells(formula) {
  let resultMatch = formula.match(/\(([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)\)/) // resultMatch = ["(A1:C3)", "A", "1", "C", "3"]

  if (resultMatch) {
    let [col1, row1, col2, row2] = resultMatch.slice(1, 5) // resultMatch.slice(1, 5) → ["A", "1", "C", "3"]

    // Convert the row numbers from String
    row1 = parseInt(row1)
    row2 = parseInt(row2)

    const startRow = Math.min(row1, row2)
    const endRow = Math.max(row1, row2)

    const colIndex1 = columnIndex[col1] // columnIndex["A"] = 1
    const colIndex2 = columnIndex[col2]

    if (colIndex1 === undefined || colIndex2 === undefined) return '#ERROR_COL'

    const startCol = Math.min(colIndex1, colIndex2)
    const endCol = Math.max(colIndex1, colIndex2)

    let expandedCells = []
    for (let c = startCol; c <= endCol; c++) {
      const colLetter = getLettersHeader(c - 1)
      for (let r = startRow; r <= endRow; r++) {
        expandedCells.push(`${colLetter}${r}`)
      }
    }
    return expandedCells.join('+')
  }
}

/*
 * 7. Add support for formatting, for example bold, italics and underline
 */
document.getElementById('bold').onclick = () => {
  if (selectedCell) selectedCell.classList.toggle('bold')
}

document.getElementById('italic').onclick = () => {
  if (selectedCell) selectedCell.classList.toggle('italic')
}

document.getElementById('underline').onclick = () => {
  if (selectedCell) selectedCell.classList.toggle('underline')
}

drawGrid()
