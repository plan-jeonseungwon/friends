import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');
const inputHtmlPath = path.join(distDir, 'index.html');
const outputHtmlPath = path.join(projectRoot, 'cashwalk_friends_single_file.html');

if (!fs.existsSync(inputHtmlPath)) {
  throw new Error(`Missing build output: ${inputHtmlPath}`);
}

const readUtf8 = (filePath) => fs.readFileSync(filePath, 'utf8');

const escapeInlineScript = (source) => source.replace(/<\/script/gi, '<\\/script');

const resolveAssetPath = (assetPath) => {
  const normalized = assetPath.replace(/^\//, '');
  const filename = path.basename(normalized);
  return path.join(distDir, 'assets', filename);
};

let html = readUtf8(inputHtmlPath);

html = html.replace(
  /<link\s+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
  (_, href) => {
    const cssPath = resolveAssetPath(href);
    const css = readUtf8(cssPath);
    return `<style>\n${css}\n</style>`;
  },
);

html = html.replace(
  /<script\s+type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (_, src) => {
    const jsPath = resolveAssetPath(src);
    const js = escapeInlineScript(readUtf8(jsPath));
    return `<script type="module">\n${js}\n</script>`;
  },
);

if (!/<meta name="generator" content="single-html-export">/.test(html)) {
  html = html.replace(
    '</head>',
    '  <meta name="generator" content="single-html-export" />\n</head>',
  );
}

fs.writeFileSync(outputHtmlPath, html, 'utf8');

console.log(`Created ${path.relative(projectRoot, outputHtmlPath)}`);
