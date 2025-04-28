import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulated database
let users: {
  [key: string]: {
    name: string;
    points: number;
    lastLogin?: string;
    lastTrack?: string;
  };
} = {};

app.post('/api/update-points', (req: Request, res: Response) => {
  const { userId, name, action } = req.body;
  if (!userId || !name || !action) {
    return res.status(400).json({ message: 'Missing userId, name, or action' });
  }

  const today = new Date().toISOString().split('T')[0]; // e.g. '2025-04-21'

  if (!users[userId]) {
    users[userId] = { name, points: 0 };
  }

  let alreadyDoneToday = false;

  if (action === 'login') {
    alreadyDoneToday = users[userId].lastLogin === today;
    if (!alreadyDoneToday) {
      users[userId].points += 1;
      users[userId].lastLogin = today;
    }
  }

  if (action === 'track') {
    alreadyDoneToday = users[userId].lastTrack === today;
    if (!alreadyDoneToday) {
      users[userId].points += 1;
      users[userId].lastTrack = today;
    }
  }

  res.json({
    userId,
    name,
    points: users[userId].points,
    action,
    pointAdded: !alreadyDoneToday,
    lastLogin: users[userId].lastLogin,
    lastTrack: users[userId].lastTrack,
  });
});

app.get('/api/leaderboard', (_req: Request, res: Response) => {
  const leaderboard = Object.entries(users)
    .map(([id, data]) => ({ userId: id, name: data.name, points: data.points }))
    .sort((a, b) => b.points - a.points);

  res.json(leaderboard);
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
