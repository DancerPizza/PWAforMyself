import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = 'public';
const distDir = 'dist';

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run expo export --platform web first.');
  process.exit(1);
}

for (const entry of readdirSync(publicDir)) {
  if (entry === 'index.html') {
    continue;
  }

  const sourcePath = join(publicDir, entry);
  const targetPath = join(distDir, entry);

  if (!statSync(sourcePath).isFile()) {
    continue;
  }

  copyFileSync(sourcePath, targetPath);
  console.log(`Copied ${entry} -> dist/${entry}`);
}

writeFileSync(join(distDir, '.nojekyll'), '');
console.log('Created dist/.nojekyll');
