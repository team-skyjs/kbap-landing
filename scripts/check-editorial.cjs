// Verify the approved batch against reviewed bytes and production output.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const manifest = require('../docs/editorial/2026-10-16-manifest.json');
const root = path.resolve(__dirname, '..');
const slugs = new Set(manifest.map(row => row.slug));
assert.equal(slugs.size, 6);
const dist = path.join(root, 'dist');
const sitemap = fs.readdirSync(dist).filter(f => /^sitemap.*\.xml$/.test(f)).map(f => fs.readFileSync(path.join(dist, f), 'utf8')).join('\n');
for (const row of manifest) {
  const source = fs.readFileSync(path.join(root, 'src/content/blog/en', row.slug + '.md'), 'utf8');
  // The only allowed change to approved copy is the publication flag.
  const reviewed = source.replace(/^draft: false$/m, 'draft: true');
  assert.equal(createHash('sha256').update(reviewed).digest('hex'), row.article_sha256, `${row.slug}: reviewed copy changed`);
  assert.match(source, /^draft: (true|false)$/m);
  const published = /^draft: false$/m.test(source);
  const file = path.join(dist, 'blog', row.slug, 'index.html');
  const url = `https://kbap.site/blog/${row.slug}/`;
  assert.equal(fs.existsSync(file), published, `${row.slug}: unexpected route status`);
  assert.equal(sitemap.includes(`<loc>${url}</loc>`), published, `${row.slug}: wrong sitemap status`);
  if (published) {
    assert.equal(row.approval_status, 'approved');
    const html = fs.readFileSync(file, 'utf8');
    assert(html.includes(`<link rel="canonical" href="${url}">`));
    assert(html.includes('property="og:type" content="article"'));
    assert(html.includes('"@type":"BlogPosting"'));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  }
}
for (const file of fs.readdirSync(dist, { recursive: true }).filter(f => /\.(html|xml)$/.test(f))) {
  const text = fs.readFileSync(path.join(dist, file), 'utf8');
  assert(!text.includes('Unpublished draft'), `${file}: preview UI leaked`);
  assert(!text.includes('noindex'), `${file}: production indexing disabled`);
  assert(!text.includes('/blog/_template/'), `${file}: template leaked`);
  for (const row of manifest.filter(row => row.approval_status !== 'approved')) {
    assert(!text.includes('/blog/' + row.slug), `${file}: unapproved URL leaked`);
  }
}
console.log('ok — reviewed editorial bytes, publication approval, routes, metadata and sitemap');
