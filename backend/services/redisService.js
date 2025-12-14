import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Handle connection events
redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redis.on('close', () => {
  console.log('🔌 Redis connection closed');
});

/**
 * Store a Sudoku puzzle and solution in Redis
 * @param {string} sessionId - Unique session identifier
 * @param {Array} puzzle - The puzzle grid (9x9)
 * @param {Array} solution - The complete solution grid (9x9)
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 * @returns {Promise<boolean>}
 */
export async function storePuzzle(sessionId, puzzle, solution, ttl = 3600) {
  try {
    const key = `sudoku:${sessionId}`;
    const data = JSON.stringify({ puzzle, solution });
    await redis.setex(key, ttl, data);
    return true;
  } catch (error) {
    console.error('Error storing puzzle in Redis:', error);
    throw error;
  }
}

/**
 * Retrieve a Sudoku puzzle and solution from Redis
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<{puzzle: Array, solution: Array} | null>}
 */
export async function getPuzzle(sessionId) {
  try {
    const key = `sudoku:${sessionId}`;
    const data = await redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error retrieving puzzle from Redis:', error);
    throw error;
  }
}

/**
 * Delete a puzzle from Redis
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<boolean>}
 */
export async function deletePuzzle(sessionId) {
  try {
    const key = `sudoku:${sessionId}`;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Error deleting puzzle from Redis:', error);
    throw error;
  }
}

/**
 * Generate a unique session ID
 * @returns {string}
 */
export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export default redis;


