import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

app.use(express.json());

// Load scores
async function readScores() {
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save scores
async function writeScores(scores) {
  await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(scores, null, 2), 'utf8');
}

// GET scores
app.get('/api/scores', async (req, res) => {
  const scores = await readScores();
  const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 10);
  res.json(sorted);
});

// POST scores
app.post('/api/scores', async (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Name and score are required' });
  }
  
  const formattedName = name.trim().substring(0, 10).toUpperCase() || 'ANON';
  const scores = await readScores();
  scores.push({ name: formattedName, score });
  const sorted = scores.sort((a, b) => b.score - a.score).slice(0, 10);
  
  await writeScores(sorted);
  res.json(sorted);
});

// Serve frontend static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other routes to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
