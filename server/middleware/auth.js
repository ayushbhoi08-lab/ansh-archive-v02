export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base64 = auth.slice(6);
  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');

  if (username !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    console.error('ADMIN_PASSWORD not set in environment');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (password !== expectedPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
