// Separate entry point for /blog and /blog/<slug>.
// Blog pages previously loaded the whole map builder for nothing, and the
// homepage loaded every article body. Two entries let Rollup keep them apart,
// with React and the shared styles hoisted into a common chunk.
import { createRoot } from 'react-dom/client';
import { BlogIndex, BlogPost } from './Blog.jsx';
// Summary only. Importing posts.js here would pull every article body into the
// entry chunk, which is exactly what the per-article split avoids.
import { metaBySlug } from './content/posts-meta.js';
import './styles.css';

const path = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
const slug = path.match(/^\/blog\/(.+)$/)?.[1];
const post = slug ? metaBySlug(slug) : null;

const container = document.getElementById('root');
container.__oikosRoot = container.__oikosRoot || createRoot(container);
container.__oikosRoot.render(post ? <BlogPost post={post} /> : <BlogIndex />);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
