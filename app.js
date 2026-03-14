let posts = [];
let activeTag = null;
let activeMonth = null;

const postListEl = document.getElementById('post-list');
const tagFilterEl = document.getElementById('tag-filter');
const monthFilterEl = document.getElementById('month-filter');
const resetFilterBtn = document.getElementById('reset-filter');

const viewer = document.getElementById('viewer');
const contentEl = document.getElementById('post-content');
const backBtn = document.getElementById('back-btn');
const postsSection = document.getElementById('posts');

document.getElementById('year').textContent = new Date().getFullYear();

function toMonth(dateStr = '') {
  return String(dateStr).slice(0, 7);
}

function getAllTags(list) {
  const set = new Set();
  list.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
  return Array.from(set);
}

function getAllMonths(list) {
  const set = new Set();
  list.forEach((p) => {
    const m = toMonth(p.date);
    if (m) set.add(m);
  });
  return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
}

function filterPosts() {
  return posts.filter((p) => {
    const hitTag = !activeTag || (p.tags || []).includes(activeTag);
    const hitMonth = !activeMonth || toMonth(p.date) === activeMonth;
    return hitTag && hitMonth;
  });
}

function renderList() {
  const current = filterPosts();

  if (!current.length) {
    postListEl.innerHTML = `<li><div class="post-meta">当前筛选下暂无文章</div></li>`;
    return;
  }

  postListEl.innerHTML = current
    .map(
      (p) => `
    <li>
      <a class="post-link" href="#${p.slug}" data-slug="${p.slug}">${p.title}</a>
      <div class="post-meta">${p.date || ''} · ${(p.tags || []).join(' / ')}</div>
    </li>
  `,
    )
    .join('');
}

function renderFilters() {
  const tags = getAllTags(posts);
  const months = getAllMonths(posts);

  tagFilterEl.innerHTML = tags
    .map(
      (tag) => `<button class="chip ${activeTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</button>`,
    )
    .join('');

  monthFilterEl.innerHTML = months
    .map(
      (m) => `<button class="chip ${activeMonth === m ? 'active' : ''}" data-month="${m}">${m}</button>`,
    )
    .join('');
}

function mdToHtml(md) {
  return md
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    .replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>');
}

async function openPost(slug) {
  const target = posts.find((p) => p.slug === slug);
  if (!target) return;

  const text = await fetch(`./posts/${slug}.md`).then((r) => r.text());
  contentEl.innerHTML = `<p>${mdToHtml(text)}</p>`;

  viewer.classList.remove('hidden');
  postsSection.classList.add('hidden');
}

postListEl.addEventListener('click', (e) => {
  const el = e.target.closest('a[data-slug]');
  if (!el) return;
  e.preventDefault();
  openPost(el.dataset.slug);
});

if (tagFilterEl) {
  tagFilterEl.addEventListener('click', (e) => {
    const el = e.target.closest('button[data-tag]');
    if (!el) return;
    const tag = el.dataset.tag;
    activeTag = activeTag === tag ? null : tag;
    renderFilters();
    renderList();
  });
}

if (monthFilterEl) {
  monthFilterEl.addEventListener('click', (e) => {
    const el = e.target.closest('button[data-month]');
    if (!el) return;
    const month = el.dataset.month;
    activeMonth = activeMonth === month ? null : month;
    renderFilters();
    renderList();
  });
}

if (resetFilterBtn) {
  resetFilterBtn.addEventListener('click', () => {
    activeTag = null;
    activeMonth = null;
    renderFilters();
    renderList();
  });
}

backBtn.addEventListener('click', () => {
  viewer.classList.add('hidden');
  postsSection.classList.remove('hidden');
});

async function bootstrap() {
  try {
    const data = await fetch('./posts/posts.json').then((r) => r.json());
    posts = data;
  } catch (e) {
    console.warn('failed to load posts.json, fallback to empty list', e);
    posts = [];
  }

  renderFilters();
  renderList();

  if (location.hash) {
    openPost(location.hash.replace('#', ''));
  }
}

bootstrap();
