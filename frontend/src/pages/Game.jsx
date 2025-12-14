import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Game.css'

function Game() {
  const [mode, setMode] = useState('answer') // 'answer' or 'notes'
  const [selectedCell, setSelectedCell] = useState(null)
  const [selectedNumber, setSelectedNumber] = useState(null) // Selected number in answer mode
  const [loading, setLoading] = useState(false)
  const [grid, setGrid] = useState(() => {
    // Initialize empty 9x9 grid
    return Array(9).fill(null).map(() => Array(9).fill(null))
  })
  const [initialPuzzle, setInitialPuzzle] = useState(() => {
    // Track which cells are part of the initial puzzle (locked)
    return Array(9).fill(null).map(() => Array(9).fill(false))
  })
  const [notes, setNotes] = useState(() => {
    // Initialize notes grid (3D: row, col, number)
    return Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => new Set())
    )
  })
  const [toast, setToast] = useState(null)
  const [hasVerified, setHasVerified] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const fetchNewPuzzle = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sudoku')
      const data = await response.json()
      
      // Set the puzzle grid
      setGrid(data.puzzle)
      
      // Store the session ID
      setSessionId(data.sessionId)
      
      // Mark initial puzzle cells as locked
      const newInitialPuzzle = data.puzzle.map((row, rowIdx) =>
        row.map((cell, colIdx) => cell !== null)
      )
      setInitialPuzzle(newInitialPuzzle)
      
      // Clear notes
      setNotes(Array(9).fill(null).map(() => 
        Array(9).fill(null).map(() => new Set())
      ))
      
      // Clear selection
      setSelectedCell(null)
      setSelectedNumber(null)
      
      // Reset verification status
      setHasVerified(false)
      setToast(null)
    } catch (error) {
      console.error('Error fetching puzzle:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch puzzle when component mounts
    fetchNewPuzzle()
  }, [])

  const isGridComplete = (grid) => {
    // Check if all cells are filled (not null)
    return grid.every(row => row.every(cell => cell !== null))
  }

  const verifySolution = async (solution) => {
    if (!sessionId) {
      setToast({
        type: 'error',
        message: 'No active session. Please start a new game.'
      })
      setTimeout(() => setToast(null), 3000)
      return false
    }

    try {
      const response = await fetch('/api/sudoku/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ solution, sessionId }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        setToast({
          type: 'success',
          message: 'Congratulations! The solution is correct! 🎉'
        })
      } else {
        setToast({
          type: 'error',
          message: data.message || 'The solution is incorrect. Please try again.'
        })
      }
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setToast(null)
      }, 5000)
      
      return data.success
    } catch (error) {
      console.error('Error verifying solution:', error)
      setToast({
        type: 'error',
        message: 'Error verifying solution. Please try again.'
      })
      setTimeout(() => {
        setToast(null)
      }, 5000)
      return false
    }
  }

  useEffect(() => {
    // Check if grid is complete and verify solution
    if (isGridComplete(grid) && !hasVerified) {
      setHasVerified(true)
      verifySolution(grid)
    } else if (!isGridComplete(grid)) {
      // Reset verification status if grid becomes incomplete
      setHasVerified(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, hasVerified])

  const handleCellClick = (row, col) => {
    // Don't allow editing initial puzzle cells
    if (initialPuzzle[row][col]) {
      setSelectedCell({ row, col })
      return
    }

    setSelectedCell({ row, col })

    // In answer mode, if a number is selected, set it to the clicked cell
    if (mode === 'answer' && selectedNumber !== null) {
      const newGrid = grid.map((r, rIdx) => 
        r.map((cell, cIdx) => 
          rIdx === row && cIdx === col ? selectedNumber : cell
        )
      )
      setGrid(newGrid)
      // Clear notes for this cell
      const newNotes = notes.map((r, rIdx) =>
        r.map((cellNotes, cIdx) =>
          rIdx === row && cIdx === col ? new Set() : cellNotes
        )
      )
      setNotes(newNotes)
    }
  }

  const handleNumberClick = (number) => {
    if (mode === 'answer') {
      // In answer mode, select/deselect the number
      if (selectedNumber === number) {
        setSelectedNumber(null) // Deselect if clicking the same number
      } else {
        setSelectedNumber(number) // Select the number
      }
    } else {
      // In notes mode, toggle note for the selected cell (original behavior)
      if (!selectedCell) return

      const { row, col } = selectedCell

      // Don't allow editing initial puzzle cells
      if (initialPuzzle[row][col]) return

      // Toggle note
      const newNotes = notes.map((r, rIdx) =>
        r.map((cellNotes, cIdx) => {
          if (rIdx === row && cIdx === col) {
            const newCellNotes = new Set(cellNotes)
            if (newCellNotes.has(number)) {
              newCellNotes.delete(number)
            } else {
              newCellNotes.add(number)
            }
            return newCellNotes
          }
          return cellNotes
        })
      )
      setNotes(newNotes)
    }
  }

  const handleClear = () => {
    if (!selectedCell) return

    const { row, col } = selectedCell

    // Don't allow clearing initial puzzle cells
    if (initialPuzzle[row][col]) return

    // Clear the cell value
    const newGrid = grid.map((r, rIdx) => 
      r.map((cell, cIdx) => 
        rIdx === row && cIdx === col ? null : cell
      )
    )
    setGrid(newGrid)

    // Clear notes for this cell
    const newNotes = notes.map((r, rIdx) =>
      r.map((cellNotes, cIdx) =>
        rIdx === row && cIdx === col ? new Set() : cellNotes
      )
    )
    setNotes(newNotes)
  }

  const handleHint = async () => {
    if (!sessionId) {
      setToast({
        type: 'error',
        message: 'No active session. Please start a new game.'
      })
      setTimeout(() => setToast(null), 3000)
      return
    }

    try {
      const response = await fetch('/api/sudoku/hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          currentGrid: grid
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Set the hint value in the grid
        const newGrid = grid.map((r, rIdx) => 
          r.map((cell, cIdx) => 
            rIdx === data.row && cIdx === data.col ? data.value : cell
          )
        )
        setGrid(newGrid)

        // Clear notes for the hinted cell
        const newNotes = notes.map((r, rIdx) =>
          r.map((cellNotes, cIdx) =>
            rIdx === data.row && cIdx === data.col ? new Set() : cellNotes
          )
        )
        setNotes(newNotes)

        // Select the hinted cell
        setSelectedCell({ row: data.row, col: data.col })

        // Show a brief toast
        setToast({
          type: 'success',
          message: `Hint: Cell (${data.row + 1}, ${data.col + 1}) = ${data.value}`
        })
        setTimeout(() => {
          setToast(null)
        }, 3000)
      } else {
        setToast({
          type: 'error',
          message: data.message || 'No hints available'
        })
        setTimeout(() => {
          setToast(null)
        }, 3000)
      }
    } catch (error) {
      console.error('Error getting hint:', error)
      setToast({
        type: 'error',
        message: 'Error getting hint. Please try again.'
      })
      setTimeout(() => {
        setToast(null)
      }, 3000)
    }
  }

  const getBoxClass = (row, col) => {
    const boxRow = Math.floor(row / 3)
    const boxCol = Math.floor(col / 3)
    return `box-${boxRow}-${boxCol}`
  }

  return (
    <div className="game-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button 
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
      
      <header className="game-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Sudoku</h1>
      </header>

      <main className="game-main">
        <div className="sudoku-container">
          <div className="sudoku-grid">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="sudoku-row">
                {row.map((cell, colIdx) => {
                  const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                  const cellNotes = notes[rowIdx][colIdx]
                  const hasRightBorder = colIdx === 2 || colIdx === 5
                  const hasBottomBorder = rowIdx === 2 || rowIdx === 5

                  const isInitial = initialPuzzle[rowIdx][colIdx]

                  return (
                    <div
                      key={colIdx}
                      className={`sudoku-cell ${getBoxClass(rowIdx, colIdx)} ${
                        hasRightBorder ? 'border-right-thick' : ''
                      } ${hasBottomBorder ? 'border-bottom-thick' : ''} ${
                        isSelected ? 'selected' : ''
                      } ${isInitial ? 'initial-cell' : ''}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                    >
                      {cell ? (
                        <span className="cell-value">{cell}</span>
                      ) : cellNotes.size > 0 ? (
                        <div className="cell-notes">
                          {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                            <span
                              key={num}
                              className={`note-number ${cellNotes.has(num) ? 'active' : ''}`}
                            >
                              {cellNotes.has(num) ? num : ''}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="game-controls">
            <div className="game-actions">
              <button
                className="new-game-button"
                onClick={fetchNewPuzzle}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'New Game'}
              </button>
              <button
                className="hint-button"
                onClick={handleHint}
                disabled={loading}
              >
                Hint
              </button>
            </div>

            <div className="mode-toggle">
              <button
                className={`mode-button ${mode === 'answer' ? 'active' : ''}`}
                onClick={() => {
                  setMode('answer')
                  // Keep selected number when switching to answer mode
                }}
              >
                Answer Mode
              </button>
              <button
                className={`mode-button ${mode === 'notes' ? 'active' : ''}`}
                onClick={() => {
                  setMode('notes')
                  setSelectedNumber(null) // Clear selected number when switching to notes mode
                }}
              >
                Notes Mode
              </button>
            </div>

            <div className="number-buttons">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className={`number-button ${mode === 'answer' && selectedNumber === num ? 'selected' : ''}`}
                  onClick={() => handleNumberClick(num)}
                  disabled={mode === 'notes' && !selectedCell}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="clear-button-container">
              <button
                className="clear-button"
                onClick={handleClear}
                disabled={!selectedCell || (selectedCell && initialPuzzle[selectedCell.row]?.[selectedCell.col])}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Game

