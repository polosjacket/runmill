import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to file paths (required since project uses ES modules "type: module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Runs on port 3001 (port 3000 is occupied by Vite dev server)
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Middleware to parse incoming JSON payloads in POST requests
app.use(express.json());

/**
 * readScores - Asynchronously reads high scores list from the local leaderboard file.
 * Returns empty array if file reading fails.
 */
async function readScores() {
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty fallback array if file is missing/uncreated
    return [];
  }
}

/**
 * writeScores - Asynchronously writes the updated high score list to the local JSON database.
 */
async function writeScores(scores) {
  await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(scores, null, 2), 'utf8');
}

/**
 * GET /api/scores - Returns the leaderboard scores sorted in descending order (highest score first).
 * Returns maximum of top 10 scores.
 */
app.get('/api/scores', async (req, res) => {
  const scores = await readScores();
  const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 10);
  res.json(sorted);
});

/**
 * POST /api/scores - Uploads a new high score run.
 * Expected Body: { name: String, score: Number }
 * Stores user initials formatted (capped at 3 uppercase chars) and returns updated top 10 list.
 */
app.post('/api/scores', async (req, res) => {
  const { name, score } = req.body;
  
  // Basic validation check
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Name and score are required' });
  }
  
  // Clean name input (limit to 3 letters, uppercase to simulate arcade style)
  const formattedName = name.trim().substring(0, 3).toUpperCase() || 'AAA';
  
  const scores = await readScores();
  scores.push({ name: formattedName, score });
  
  // Sort descending and cap at 10 items
  const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 10);
  
  await writeScores(sorted);
  res.json(sorted);
});

// Serve frontend production assets compiled in the "dist" folder
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: route all non-API paths to serve the bundled index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start listening for connections
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
