/**
 * This function create one table by adding rows and colunms with all input elements
 */

function createTable(numRows, numCells) {
  let table = document.createElement('table')

  // Loop over all rows (lines)
  for (let i = 0; i <= numRows; i++) {
    let row = document.createElement('tr')
    //console.log('hi tr')

    for (let j = 0; j <= numCells; j++) {
      let cell

      if (i === 0 && j === 0) {
        cell = document.createElement('th')
        cell.innerText = ' '
      } else if (i === 0) {
        cell = document.createElement('th')
        cell.innerText = getLettersHeader(j - 1)
      } else if (j === 0) {
        cell = document.createElement('th')
        cell.innerText = i
      } else {
        cell = document.createElement('td')
        //console.log('hi td')
        cell.innerText = ' here '
      }

      row.appendChild(cell)
    }

    table.appendChild(row)
  }

  document.getElementById('table').appendChild(table)
}

function getLettersHeader(pos) {
  let alf = [
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

  if (pos < alf.length - 1) {
    return alf[pos]
  }
}

createTable(100, 100)
