const API_BASE = import.meta.env.VITE_API_URL ?? '';

function getToken() {
  return localStorage.getItem('acat-admin-token') ?? '';
}

export function setAdminToken(token) {
  if (token) localStorage.setItem('acat-admin-token', token);
  else localStorage.removeItem('acat-admin-token');
}

async function request(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };
  if (options.auth) headers.Authorization = `Bearer ${getToken()}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

export const api = {
  fetchContent: () => request('/api/content'),
  saveContent: (content) => request('/api/content', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(content),
  }),
  login: (password) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  upload: (file, folder) => {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    return request('/api/upload', { method: 'POST', auth: true, body: form });
  },
};
