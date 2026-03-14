# personal-site（第一版）

一个可直接运行的轻量个人站（无后端、无数据库）。

## 本地启动

在项目目录执行：

```bash
python -m http.server 8787
```

然后打开：

- http://127.0.0.1:8787

## 目录

- `index.html` 主页
- `styles.css` 样式
- `app.js` 文章列表 + Markdown 渲染
- `posts/*.md` 文章内容

## 如何新增文章

1. 在 `posts/` 新建 `xxx.md`
2. 在 `app.js` 的 `posts` 数组里加一条元数据（title/slug/date/tags）
3. 刷新页面

## 下一步建议

- 迁移到 Astro + Cloudflare Pages
- 增加 RSS / SEO / 统计
- 增加后台发布页
