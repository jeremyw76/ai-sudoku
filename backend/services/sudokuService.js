/**
 * Sudoku Service
 * Handles generation of Sudoku puzzles
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

export { generatePuzzle }

