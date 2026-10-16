// Run after a production build, including with KBAP_DRAFT_PREVIEW=1.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const manifest = require('../docs/editorial/2026-10-16-manifest.json');
const root = path.resolve(__dirname, '..');
const slugs = new Set(manifest.map(row => row.slug));
assert.equal(slugs.size, 6);
for (const row of manifest) {
  const source = fs.readFileSync(path.join(root, 'src/content/blog/en', row.slug + '.md'));
  assert.equal(createHash('sha256').update(source).digest('hex'), row.article_sha256, `${row.slug}: reviewed copy changed`);
  assert.match(source.toString(), /^draft: true$/m);
  assert.equal(row.approval_status, 'pending');
  assert.equal(row.publish_status, 'unpublished');
  for (const [, target] of source.toString().matchAll(/\]\(\/blog\/([^/)]+)\/?\)/g)) {
    assert(slugs.has(target), `${row.slug}: unknown internal link ${target}`);
  }
}
const files = fs.readdirSync(path.join(root, 'dist'), { recursive: true });
assert(!files.some(f => /^blog(?:\/|$)/.test(f)), 'Draft blog routes leaked into production');
for (const file of files.filter(f => /\.(html|xml)$/.test(f))) {
  const text = fs.readFileSync(path.join(root, 'dist', file), 'utf8');
  for (const slug of slugs) assert(!text.includes('/blog/' + slug), `${file}: unpublished URL leaked`);
  assert(!text.includes('Unpublished draft'), `${file}: preview UI leaked`);
  assert(!text.includes('noindex'), `${file}: production indexing was disabled`);
}
console.log('ok — 6 reviewed copies unchanged, explicit drafts, valid batch links, no draft routes/links/sitemap entries in production');
