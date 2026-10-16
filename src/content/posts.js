import { getCollection } from 'astro:content';

// Drafts are visible only on an explicitly enabled development server.
// Even KBAP_DRAFT_PREVIEW=1 cannot include them in a production build.
export const draftPreview = import.meta.env.DEV && import.meta.env.KBAP_DRAFT_PREVIEW === '1';

/** Published posts, plus review drafts on the local-only preview server. */
export async function posts() {
  const all = await getCollection('blog', (p) => !p.data.draft || (draftPreview && !p.id.split('/').pop().startsWith('_')));
  return all
    .map((p) => {
      const [lang, slug] = p.id.split('/');
      return { ...p, lang, slug };
    })
    .sort((a, b) => b.data.date - a.data.date);
}

export const releases = async () =>
  (await getCollection('changelog', (e) => !e.data.draft)).sort((a, b) => b.data.date - a.data.date);
