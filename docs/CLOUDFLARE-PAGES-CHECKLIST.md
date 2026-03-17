# Cloudflare Pages 极短操作单

目标：让 GitHub 仓库 `dony-hu/jerry-notes` 自动发布到 `https://jerry-notes.pages.dev/`

## 1. 连接仓库

1. 打开 Cloudflare Dashboard
2. 进入 `Workers & Pages`
3. 选择已有项目 `jerry-notes`
4. 如果还没连 GitHub：
   连接 GitHub
   选择仓库 `dony-hu/jerry-notes`
5. 如果已经有项目但内容没更新：
   进入 `Settings` -> `Builds`
   检查 Git 仓库是否就是 `dony-hu/jerry-notes`

## 2. 检查构建配置

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: 留空
- Node version: `22.16.0`

## 3. 触发一次生产部署

如果项目刚连上 Git：

1. 保存配置
2. 点击触发部署，或等待 Cloudflare 自动拉起首次构建

如果项目已经连上 Git 但线上还是旧内容：

1. 打开 `Deployments`
2. 找最近一次失败/成功记录
3. 先点 `Retry deployment`
4. 如果没有新部署，检查 Git 集成是否失效，必要时重新授权 `Cloudflare Workers and Pages` GitHub App

## 4. 验证

部署完成后检查：

- `https://jerry-notes.pages.dev/posts/posts.json`
- 页面里不应再出现 `2026-w12-weekly-report`
- 页面里应包含 `juhe-api-catalog-full-md`

## 5. 当前已准备好

仓库已经满足 Pages 构建要求：

- 已有 `npm run build`
- 已有 `dist` 输出
- 已有 `_headers`
- 已有 `wrangler.toml`
- 已推送到 GitHub `main`
