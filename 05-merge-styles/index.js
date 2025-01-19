const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  try {
    const stylesDir = path.join(__dirname, 'styles');
    const outputDir = path.join(__dirname, 'project-dist');
    const outputFile = path.join(outputDir, 'bundle.css');

    // Создаем папку project-dist, если она не существует
    await fs.mkdir(outputDir, { recursive: true });

    // Читаем содержимое папки styles
    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    // Фильтруем только CSS-файлы
    const cssFiles = files.filter(
      file => file.isFile() && path.extname(file.name) === '.css'
    );

    const styles = [];

    // Читаем содержимое каждого CSS-файла
    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file.name);
      const fileContent = await fs.readFile(filePath, 'utf8');
      styles.push(fileContent);
    }

    // Объединяем стили и записываем в bundle.css
    await fs.writeFile(outputFile, styles.join('\n'));
    console.log('Styles merged into bundle.css successfully!');
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}

mergeStyles();
