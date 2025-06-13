/**
 * This function create one table by adding rows and colunms with all input elements
 */
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
        cell.contentEditable = true

        if (j === 0) {
          cell.innerText = i
        } else {
          cell.innerText = i === 3 && j === 2 ? '12' : ''
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
  let table = createTable(30, 30)
  document.getElementById('gridPlaceHolder').innerHTML = ''
  document.getElementById('gridPlaceHolder').appendChild(table)
}

// Create the initial grid
drawGrid()
