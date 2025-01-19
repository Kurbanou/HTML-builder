const fs = require('fs/promises');
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    // Создаем целевую папку (рекурсивно)
    await fs.mkdir(destDir, { recursive: true });

    // Читаем содержимое исходной папки
    const entries = await fs.readdir(srcDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        // Если это папка, рекурсивно копируем ее содержимое
        await copyDir(srcPath, destPath);
      } else if (entry.isFile()) {
        // Если это файл, копируем его
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

async function main() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    // Удаляем папку `files-copy`, если она существует, для очистки содержимого
    await fs.rm(destDir, { recursive: true, force: true });

    // Копируем папку
    await copyDir(srcDir, destDir);
    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error in main function:', err);
  }
}

main();
