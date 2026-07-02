const fs = require('fs');
const path = require('path');

const srcRoot = path.resolve(__dirname, '..', 'src');
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
}

walk(srcRoot);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;

  text = text.replace(/from\s+['"]src\/([^'"]+)['"]/g, (match, importPath) => {
    const targetPath = path.resolve(srcRoot, importPath);
    const candidates = [
      targetPath,
      `${targetPath}.ts`,
      `${targetPath}.js`,
      path.join(targetPath, 'index.ts'),
      path.join(targetPath, 'index.js'),
    ];

    let resolvedPath = null;
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        resolvedPath = candidate;
        break;
      }
    }

    if (!resolvedPath) {
      return match;
    }

    let relativePath = path.relative(path.dirname(file), resolvedPath);
    relativePath = toPosix(relativePath);

    if (!relativePath.startsWith('.')) {
      relativePath = `./${relativePath}`;
    }

    if (relativePath.endsWith('.ts')) {
      relativePath = relativePath.slice(0, -3);
    } else if (relativePath.endsWith('.js')) {
      relativePath = relativePath.slice(0, -3);
    }

    changed = true;
    return `from '${relativePath}'`;
  });

  if (changed) {
    fs.writeFileSync(file, text, 'utf8');
  }
}
