// Server-only entry used by scripts/prerender.mjs to render the journal to HTML.
// It imports posts.js (every article body), which the browser must never do —
// the client loads one body per article (see loadBody in Blog.jsx).
import { BlogIndex, BlogPost } from './Blog.jsx';
import { postBySlug, sortedPosts } from './content/posts.js';
import { metaBySlug } from './content/posts-meta.js';

export const slugs = sortedPosts.map((post) => post.slug);

export function blogIndexPage() {
  return <BlogIndex />;
}

export function blogPostPage(slug) {
  return <BlogPost post={metaBySlug(slug)} initialBody={postBySlug(slug)} />;
}
