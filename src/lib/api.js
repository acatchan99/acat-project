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

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error('无法连接后端。请先在项目目录运行：npm run dev');
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('后端未返回 JSON');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

function isValidCmsPayload(data) {
  return Boolean(data?.translations?.zh && data?.translations?.en);
}

export const api = {
  fetchContent: async () => {
    const data = await request('/api/content');
    if (!isValidCmsPayload(data)) throw new Error('CMS 数据无效');
    return data;
  },
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
