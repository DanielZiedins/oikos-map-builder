// Separate entry point for /blog and /blog/<slug>.
// Blog pages previously loaded the whole map builder for nothing, and the
// homepage loaded every article body. Two entries let Rollup keep them apart,
// with React and the shared styles hoisted into a common chunk.
import { createRoot } from 'react-dom/client';
import { BlogIndex, BlogPost } from './Blog.jsx';
import { postBySlug } from './content/posts.js';
import './styles.css';

const path = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
const slug = path.match(/^\/blog\/(.+)$/)?.[1];
const post = slug ? postBySlug(slug) : null;

const container = document.getElementById('root');
container.__oikosRoot = container.__oikosRoot || createRoot(container);
container.__oikosRoot.render(post ? <BlogPost post={post} /> : <BlogIndex />);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
