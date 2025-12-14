import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePuzzle } from './services/sudokuService.js';
import { storePuzzle, getPuzzle, generateSessionId } from './services/redisService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Full-Stack Application API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      hello: '/api/hello',
      game: '/game',
      sudoku: '/api/sudoku (GET) - Returns puzzle and sessionId',
      sudokuVerify: '/api/sudoku/verify (POST) - Requires sessionId and solution',
      sudokuHint: '/api/sudoku/hint (POST) - Requires sessionId and currentGrid'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Node.js backend!',
    nodeVersion: process.version
  });
});

app.get('/game', (req, res) => {
  const games = ['Rock Paper Scissors', 'Number Guessing', 'Word Puzzle', 'Trivia Quiz'];
  const randomGame = games[Math.floor(Math.random() * games.length)];
  
  res.json({ 
    game: randomGame,
    message: `Let's play ${randomGame}!`,
    availableGames: games,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/sudoku', async (req, res) => {
  try {
    const difficulty = req.query.difficulty || 'medium';
    
    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        error: 'Invalid difficulty. Must be easy, medium, or hard'
      });
    }

    // Generate puzzle and solution
    const { puzzle, solution, difficulty: generatedDifficulty } = generatePuzzle(difficulty);
    
    // Generate a unique session ID
    const sessionId = generateSessionId();
    
    // Store puzzle and solution in Redis (1 hour TTL)
    await storePuzzle(sessionId, puzzle, solution, 3600);
    console.log('Session generated: ', sessionId);
    
    res.json({
      puzzle: puzzle,
      difficulty: generatedDifficulty,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating puzzle:', error);
    res.status(500).json({
      error: 'Failed to generate puzzle',
      message: error.message
    });
  }
});

app.post('/api/sudoku/verify', async (req, res) => {
  try {
    const { solution, sessionId } = req.body;
    
    if (!solution) {
      return res.status(400).json({
        success: false,
        error: 'Solution is required'
      });
    }
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    // Get the stored solution from Redis
    const stored = await getPuzzle(sessionId);
    
    if (!stored) {
      return res.status(404).json({
        success: false,
        error: 'Session not found. Please start a new game.'
      });
    }
    
    const correctSolution = stored.solution;
    
    // Compare user solution with stored solution
    let isCorrect = true;
    const errors = [];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (solution[row][col] !== correctSolution[row][col]) {
          isCorrect = false;
          errors.push(`Cell (${row + 1}, ${col + 1}): expected ${correctSolution[row][col]}, got ${solution[row][col]}`);
        }
      }
    }
    
    if (isCorrect) {
      res.json({
        success: true,
        message: 'Congratulations! Your solution is correct!',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        success: false,
        message: `Solution is incorrect. Found ${errors.length} error(s).`,
        errors: errors.slice(0, 5), // Return first 5 errors
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error verifying solution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify solution',
      message: error.message
    });
  }
});

app.get('/api/sudoku/hint', async (req, res) => {
  try {
    const { sessionId, currentGrid } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }
    
    if (!currentGrid) {
      return res.status(400).json({
        success: false,
        error: 'Current grid is required'
      });
    }
    
    // Get the stored puzzle and solution from Redis
    const stored = await getPuzzle(sessionId);
    
    if (!stored) {
      return res.status(404).json({
        success: false,
        error: 'Session not found. Please start a new game.'
      });
    }
    
    const { puzzle, solution } = stored;
    
    // Find empty cells that are:
    // 1. Not part of the original puzzle (puzzle[row][col] === null)
    // 2. Not filled by the user (currentGrid[row][col] === null)
    const emptyCells = [];
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const isOriginal = puzzle[row][col] !== null;
        const isFilled = currentGrid[row][col] !== null;
        
        if (!isOriginal && !isFilled) {
          const hintValue = solution[row][col];
          // Make sure the solution value is valid
          if (hintValue !== null && hintValue >= 1 && hintValue <= 9) {
            emptyCells.push({ row, col, value: hintValue });
          }
        }
      }
    }
    
    if (emptyCells.length === 0) {
      return res.json({
        success: false,
        message: 'No hints available. All cells are filled or puzzle is already solved.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Return a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const hint = emptyCells[randomIndex];
    
    res.json({
      success: true,
      row: hint.row,
      col: hint.col,
      value: hint.value,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get hint',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Node.js version: ${process.version}`);
});


