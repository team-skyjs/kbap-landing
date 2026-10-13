import { getCollection } from 'astro:content';

/** Published posts, each with its language and slug split out of the file id. */
export async function posts() {
  const all = await getCollection('blog', (p) => !p.data.draft);
  return all
    .map((p) => {
      const [lang, slug] = p.id.split('/');
      return { ...p, lang, slug };
    })
    .sort((a, b) => b.data.date - a.data.date);
}

export const releases = async () =>
  (await getCollection('changelog', (e) => !e.data.draft)).sort((a, b) => b.data.date - a.data.date);
