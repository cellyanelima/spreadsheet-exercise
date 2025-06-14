/**
 * This function create one table by adding rows and colunms with all input elements
 */

let spreadsheetData = {
  cells: {}, // preciso que venha com letra e numero -> C1
}

function createTable(numRows, numColumns) {
  let table = document.createElement('table')

  // Loop over all rows (lines)
  for (let i = 0; i <= numRows; i++) {
    let row = document.createElement('tr')
    //console.log('hi tr')

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
          const colLetter = getLettersHeader(j - 1)
          const cellKey = `${colLetter}${i}`
          cell.innerText = spreadsheetData.cells[cellKey] || ''
          cell.ondblclick = startEditMode
          cell.onkeydown = (e) => {
            if (e.key == 'Enter') {
              e.target.contentEditable = false

              //cell.onpointerleave = exitEditMode
              spreadsheetData.cells[cellKey] = cell.innerText.trim()
              console.log(spreadsheetData)
            }
          }
        }
        row.appendChild(cell)
      }
    }
    table.appendChild(row)
  }
  return table
}
/*
function checkNavigation(e) {
  if (e.key == 'Enter') {
    e.target.contentEditable = false
    //console.log(e.key)
    return false
  }
}
*/
function startEditMode(e) {
  e.target.contentEditable = true
  e.target.focus()
}

function exitEditMode(e) {
  e.target.contentEditable = false
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
  let table = createTable(30, 30)
  document.getElementById('gridPlaceHolder').innerHTML = ''
  document.getElementById('gridPlaceHolder').appendChild(table)
}

// Create the initial grid
drawGrid()
