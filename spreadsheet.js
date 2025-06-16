let spreadsheetData = {}

/**
 * 2. When loading index.html into Chrome or Firefox, it should draw a 100x100 grid of cells,
with columns labelled A-Z, AA, AB, AC, etc. and rows numbered 1 to 100.
 */
function createTable(numRows, numColumns) {
  let table = document.createElement('table')

  // Loop over all rows (lines)
  for (let i = 0; i <= numRows; i++) {
    let row = document.createElement('tr')

    // Checking if it is the first line (header)
    if (i === 0) {
      // Create all colunmn labels
      for (let j = 0; j <= numColumns; j++) {
        let cell = document.createElement('th')
        // First cell must be empty
        if (j !== 0) cell.innerText = getLettersHeader(j - 1)
        row.appendChild(cell)
      }
    } else {
      for (let j = 0; j <= numColumns; j++) {
        let cell = document.createElement('td')

        if (j === 0) {
          cell.innerText = i
        } else {
          // Assign a ID to each cell as 'column+row', like A1, B2...
          const columnLetter = getLettersHeader(j - 1)
          const id = `${columnLetter}${i}`
          cell.dataset.id = id // Attribute: data-id

          // Reloading the previous data before refresh button
          cell.innerText = spreadsheetData[id]?.value || ''
          //cell.contentEditable = true

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
  let table = createTable(30, 30)
  // Cleanup the previous table if exists
  grid.innerHTML = ''
  grid.appendChild(table)
}

/**
 * 3. When you click in a cell and enter a number, it should store the number in a JavaScript
object (note: this would be lost when you refresh the page).
 */

function startEditMode(cell) {
  const id = cell.dataset.id

  // Replace the value of this TD to the formula if exists
  // A formula contained in the cell reappears
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
    cellData.value = calculate(cellData)

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
into cells where you've saved it.
*/

document.getElementById('refresh').onclick = (e) => {
  let grid = document.getElementById('grid')
  grid.innerHTML = 'Loading table...'
  setTimeout(() => drawGrid(), 500)
}

/*
* 5. Add support for some basic formulas. For example if you enter "=A1+A2" into A3 it
should calculate the sum of these two cells and display the result in A3. Updating A1 would
update A3.
*/

function calculate(cellData) {
  let formula = cellData.formula.slice(1) // Remove "="

  // Replaces references like A1, B2, etc
  formula = formula.replace(/([A-Z]+[0-9]+)/g, (idElement) => {
    const cellDataElement = spreadsheetData[idElement]
    return cellDataElement?.value || 0
  })

  try {
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
        cellData.value = calculate(cellData)

        // Refreshing values on screen
        const cell = document
          .getElementById('grid')
          .querySelector(`[data-id="${id}"]`)

        if (cell) cell.innerText = cellData.value
      }
    }
  }
}

// Create the initial grid
drawGrid()
