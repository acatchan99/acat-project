import jwt from 'jsonwebtoken';

const TOKEN_TTL = '7d';

function getSecret() {
  return process.env.JWT_SECRET || 'acat-jwt-change-in-production';
}

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}
