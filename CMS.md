# ACAT 内容管理系统 (CMS)

网站数据（文案、作品集、图片路径、社媒链接等）可通过后台自行修改。

## 本地开发

```bash
# 1. 安装依赖
npm install
npm install --prefix server

# 2. 初始化内容数据库
npm run seed

# 3. 配置管理密码（复制 server/.env.example → server/.env 并修改）
cp server/.env.example server/.env

# 4. 同时启动前台 + 后端
npm run dev
```

- **网站前台**：http://localhost:5174/
- **管理后台**：http://localhost:5174/admin  
- **默认密码**：见 `server/.env` 中 `ADMIN_PASSWORD`（示例：`acat-admin-2026`）

## 后台功能

| 模块 | 可编辑内容 |
|------|-----------|
| 文案 | Hero、艺术家、联系等中英文 |
| 作品集 | 三专辑作品、上传/替换图片 |
| 街头案例 | 标题、地点、图片 |
| 报价 | 规格、价格、示意图 |
| 社媒 | 各平台链接与分组 |
| 展览 | 年份与活动名称 |

保存后刷新前台页面即可看到更新（无需重新构建）。

## 生产部署（推荐 Railway / Render）

1. 构建前端：`npm run build`
2. 启动服务：`npm run start`（Express 同时提供 API + 静态站点）
3. 设置环境变量：
   - `ADMIN_PASSWORD` — 管理后台密码（务必修改）
   - `JWT_SECRET` — 随机长字符串
   - `NODE_ENV=production`
   - `PORT` — 平台分配的端口

## 安全提示

- 部署后立即修改默认密码
- 不要将 `server/.env` 提交到 Git
- 管理地址 `/admin` 仅分享给自己或客户
