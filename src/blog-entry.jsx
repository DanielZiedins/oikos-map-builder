// Separate entry point for /blog and /blog/<slug>.
// Blog pages previously loaded the whole map builder for nothing, and the
// homepage loaded every article body. Two entries let Rollup keep them apart,
// with React and the shared styles hoisted into a common chunk.
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BlogIndex, BlogPost, loadBody } from './Blog.jsx';
// Summary only. Importing posts.js here would pull every article body into the
// entry chunk, which is exactly what the per-article split avoids.
import { metaBySlug } from './content/posts-meta.js';
import { trackOutboundClicks } from './track.js';
import './styles.css';

const path = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
const slug = path.match(/^\/blog\/(.+)$/)?.[1];
const post = slug ? metaBySlug(slug) : null;

const container = document.getElementById('root');

// Every journal page is prerendered (scripts/prerender.mjs), so hydrate the
// HTML that is already on screen; createRoot only for HMR or a page that
// somehow shipped without it.
function mount(page) {
  if (container.__oikosRoot) {
    container.__oikosRoot.render(page);
  } else if (container.firstElementChild) {
    container.__oikosRoot = hydrateRoot(container, page, {
      onRecoverableError: (error) => {
        if (import.meta.env.DEV) console.warn('Hydration recovered:', error);
      },
    });
  } else {
    container.__oikosRoot = createRoot(container);
    container.__oikosRoot.render(page);
  }
}

if (post) {
  // The article body has to be in hand before hydrating, or the first client
  // render (header only) would not match the prerendered article.
  loadBody(post.slug)
    .catch(() => null)
    .then((body) => mount(<BlogPost post={post} initialBody={body} />));
} else {
  mount(<BlogIndex />);
}

if (!container.__oikosTracking) {
  container.__oikosTracking = true;
  trackOutboundClicks();
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
