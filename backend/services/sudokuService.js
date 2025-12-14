/**
 * Sudoku Service
 * Handles generation and verification of Sudoku puzzles
 */

/**
 * Checks if a number can be placed at a given position
 */
function isValidPlacement(grid, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false
    }
  }

  return true
}

/**
 * Solves a Sudoku puzzle using backtracking
 * Returns the solution if found, null otherwise
 */
function solveSudoku(grid) {
  const solution = grid.map(row => [...row]) // Deep copy

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (solution[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(solution, row, col, num)) {
            solution[row][col] = num
            if (solveSudoku(solution)) {
              return solution
            }
            solution[row][col] = null
          }
        }
        return null // No valid number found
      }
    }
  }
  return solution // Puzzle is solved
}

/**
 * Counts the number of solutions for a Sudoku puzzle
 * Stops counting after finding 2 solutions (for efficiency)
 */
function countSolutions(grid, limit = 2) {
  const solution = grid.map(row => [...row]) // Deep copy
  let count = 0

  function backtrack() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (solution[row][col] === null) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(solution, row, col, num)) {
              solution[row][col] = num
              backtrack()
              solution[row][col] = null
              if (count >= limit) return // Early exit
            }
          }
          return
        }
      }
    }
    count++ // Found a solution
  }

  backtrack()
  return count
}

/**
 * Generates a complete valid Sudoku solution
 */
function generateCompleteSolution() {
  const grid = Array(9).fill(null).map(() => Array(9).fill(null))

  // Fill diagonal 3x3 boxes first (they are independent)
  for (let box = 0; box < 9; box += 3) {
    fillBox(grid, box, box)
  }

  // Solve the rest
  solveSudoku(grid)
  return grid
}

/**
 * Fills a 3x3 box with random valid numbers
 */
function fillBox(grid, startRow, startCol) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  shuffleArray(numbers)

  let index = 0
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      grid[startRow + row][startCol + col] = numbers[index++]
    }
  }
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * Generates a Sudoku puzzle with a unique solution
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Object containing puzzle and solution
 */
function generatePuzzle(difficulty = 'medium') {
  // Generate a complete solution
  const solution = generateCompleteSolution()
  const puzzle = solution.map(row => [...row]) // Deep copy

  // Determine number of cells to remove based on difficulty
  const cellsToRemove = {
    easy: 35,    // ~40 cells remain
    medium: 45,  // ~36 cells remain
    hard: 55     // ~26 cells remain
  }

  const targetRemovals = cellsToRemove[difficulty] || cellsToRemove.medium

  // Create list of all cell positions
  const positions = []
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push({ row, col })
    }
  }
  shuffleArray(positions)

  let removals = 0
  for (const { row, col } of positions) {
    if (removals >= targetRemovals) break

    // Save the value
    const value = puzzle[row][col]
    puzzle[row][col] = null

    // Check if puzzle still has unique solution
    const solutionCount = countSolutions(puzzle, 2)
    
    if (solutionCount === 1) {
      removals++
    } else {
      // Restore the value if removing it creates multiple solutions
      puzzle[row][col] = value
    }
  }

  return {
    puzzle,
    solution,
    difficulty
  }
}

/**
 * Verifies if a Sudoku solution is correct
 * @param {Array<Array<number|null>>} solution - 9x9 grid representing the solution
 * @returns {Object} Object with success status and message
 */
function verifySolution(solution) {
  // Validate input
  if (!solution || !Array.isArray(solution) || solution.length !== 9) {
    return {
      success: false,
      message: 'Invalid solution format'
    }
  }

  // Check each row
  for (let row = 0; row < 9; row++) {
    if (!Array.isArray(solution[row]) || solution[row].length !== 9) {
      return {
        success: false,
        message: 'Invalid solution format'
      }
    }

    const rowSet = new Set()
    for (let col = 0; col < 9; col++) {
      const value = solution[row][col]
      if (value === null || value < 1 || value > 9 || !Number.isInteger(value)) {
        return {
          success: false,
          message: 'All cells must contain numbers from 1 to 9'
        }
      }
      if (rowSet.has(value)) {
        return {
          success: false,
          message: `Duplicate number ${value} in row ${row + 1}`
        }
      }
      rowSet.add(value)
    }
  }

  // Check each column
  for (let col = 0; col < 9; col++) {
    const colSet = new Set()
    for (let row = 0; row < 9; row++) {
      const value = solution[row][col]
      if (colSet.has(value)) {
        return {
          success: false,
          message: `Duplicate number ${value} in column ${col + 1}`
        }
      }
      colSet.add(value)
    }
  }

  // Check each 3x3 box
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const boxSet = new Set()
      const startRow = boxRow * 3
      const startCol = boxCol * 3

      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          const value = solution[row][col]
          if (boxSet.has(value)) {
            return {
              success: false,
              message: `Duplicate number ${value} in box (${boxRow + 1}, ${boxCol + 1})`
            }
          }
          boxSet.add(value)
        }
      }
    }
  }

  return {
    success: true,
    message: 'Solution is correct!'
  }
}

/**
 * Gets a hint for the current puzzle state
 * Returns a random empty cell's correct value
 * @param {Array<Array<number|null>>} puzzle - The original puzzle (with initial values)
 * @param {Array<Array<number|null>>} currentGrid - The current grid state
 * @returns {Object} Object with row, col, and value, or null if no hints available
 */
function getHint({puzzle, currentGrid}) {
  // Solve the puzzle from the current grid state (includes original puzzle + user inputs)
  // This ensures we get the correct solution based on what the user has entered
  const solution = solveSudoku(currentGrid.map(row => [...row]))
  
  if (!solution) {
    return null // Puzzle is unsolvable (user may have made incorrect entries)
  }

  // Find empty cells that are:
  // 1. Not part of the original puzzle (puzzle[row][col] === null)
  // 2. Not filled by the user (currentGrid[row][col] === null)
  const emptyCells = []
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const isOriginal = puzzle[row][col] !== null
      const isFilled = currentGrid[row][col] !== null
      
      if (!isOriginal && !isFilled) {
        const hintValue = solution[row][col]
        // Make sure the solution value is valid (not null)
        if (hintValue !== null && hintValue >= 1 && hintValue <= 9) {
          emptyCells.push({ row, col, value: hintValue })
        }
      }
    }
  }

  if (emptyCells.length === 0) {
    return null // No empty cells available for hints
  }

  // Return a random empty cell
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  return emptyCells[randomIndex]
}

export { generatePuzzle, verifySolution, getHint }

