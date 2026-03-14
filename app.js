const posts = [
  {
    title: '我的个人站上线了（第一版）',
    slug: 'first-post',
    date: '2026-03-14',
    tags: ['建站', '记录']
  },
  {
    title: '为什么先做静态站',
    slug: 'why-static-site',
    date: '2026-03-14',
    tags: ['架构', '效率']
  }
];

const postListEl = document.getElementById('post-list');
const viewer = document.getElementById('viewer');
const contentEl = document.getElementById('post-content');
const backBtn = document.getElementById('back-btn');

document.getElementById('year').textContent = new Date().getFullYear();

function renderList() {
  postListEl.innerHTML = posts.map(p => `
    <li>
      <a class="post-link" href="#${p.slug}" data-slug="${p.slug}">${p.title}</a>
      <div class="post-meta">${p.date} · ${p.tags.join(' / ')}</div>
    </li>
  `).join('');
}

function mdToHtml(md) {
  return md
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>');
}

async function openPost(slug) {
  const target = posts.find(p => p.slug === slug);
  if (!target) return;

  const text = await fetch(`./posts/${slug}.md`).then(r => r.text());
  contentEl.innerHTML = `<p>${mdToHtml(text)}</p>`;
  viewer.classList.remove('hidden');
  document.getElementById('posts').classList.add('hidden');
}

postListEl.addEventListener('click', (e) => {
  const el = e.target.closest('a[data-slug]');
  if (!el) return;
  e.preventDefault();
  openPost(el.dataset.slug);
});

backBtn.addEventListener('click', () => {
  viewer.classList.add('hidden');
  document.getElementById('posts').classList.remove('hidden');
});

renderList();

if (location.hash) {
  openPost(location.hash.replace('#', ''));
}
