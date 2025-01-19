const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  try {
    const projectDist = path.join(__dirname, 'project-dist');
    const templatePath = path.join(__dirname, 'template.html');
    const componentsDir = path.join(__dirname, 'components');
    const stylesDir = path.join(__dirname, 'styles');
    const assetsDir = path.join(__dirname, 'assets');
    const outputHtml = path.join(projectDist, 'index.html');
    const outputCss = path.join(projectDist, 'style.css');
    const outputAssets = path.join(projectDist, 'assets');

    // 1. Создаем папку project-dist
    await fs.mkdir(projectDist, { recursive: true });

    // 2. Сборка HTML
    let templateContent = await fs.readFile(templatePath, 'utf8');
    const templateTags = templateContent.match(/{{\s*[\w-]+\s*}}/g) || [];

    for (const tag of templateTags) {
      const componentName = tag.replace(/{{\s*|\s*}}/g, '');
      const componentPath = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentPath, 'utf8');
        templateContent = templateContent.replace(tag, componentContent);
      } catch {
        console.error(`Component "${componentName}" not found.`);
      }
    }

    await fs.writeFile(outputHtml, templateContent);

    // 3. Сборка CSS
    const styleFiles = (await fs.readdir(stylesDir, { withFileTypes: true }))
      .filter(file => file.isFile() && path.extname(file.name) === '.css');

    const styles = await Promise.all(
      styleFiles.map(file => fs.readFile(path.join(stylesDir, file.name), 'utf8'))
    );

    await fs.writeFile(outputCss, styles.join('\n'));

    // 4. Копирование папки assets
    async function copyDir(src, dest) {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }

    await copyDir(assetsDir, outputAssets);

    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Error building the page:', err);
  }
}

buildPage();
