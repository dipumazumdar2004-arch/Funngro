import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const siteRoot = path.resolve(__dirname, 'funngro-website');
  const distDir = path.resolve(__dirname, 'dist');

  return {
    root: siteRoot,
    build: {
      outDir: distDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(siteRoot, 'index.html'),
          company: path.resolve(siteRoot, 'company.html'),
        },
      },
    },
    plugins: [
      {
        name: 'copy-funngro-static-files',
        configureServer(server) {
          server.middlewares.use('/SEO-Audit-Report.md', (_req, res, next) => {
            const reportPath = path.resolve(__dirname, 'SEO-Audit-Report.md');
            if (!fs.existsSync(reportPath)) {
              next();
              return;
            }
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename="SEO-Audit-Report.md"');
            fs.createReadStream(reportPath).pipe(res);
          });
        },
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const imagesSrc = path.resolve(siteRoot, 'images');
          const imagesDest = path.resolve(distDir, 'images');
          if (fs.existsSync(distDir) && fs.existsSync(imagesSrc)) {
            fs.cpSync(imagesSrc, imagesDest, {recursive: true, force: true});
          }

          for (const filename of ['sitemap.xml', 'robots.txt', 'manifest.json']) {
            const srcFile = path.resolve(siteRoot, filename);
            const destFile = path.resolve(distDir, filename);
            if (fs.existsSync(srcFile) && fs.existsSync(distDir)) {
              fs.copyFileSync(srcFile, destFile);
            }
          }

          const reportSrc = path.resolve(__dirname, 'SEO-Audit-Report.md');
          const reportDest = path.resolve(distDir, 'SEO-Audit-Report.md');
          if (fs.existsSync(reportSrc) && fs.existsSync(distDir)) {
            fs.copyFileSync(reportSrc, reportDest);
          }
        },
      },
    ],
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
