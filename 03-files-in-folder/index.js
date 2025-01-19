const fs = require('fs/promises');
const path = require('path');

async function displayFilesInfo() {
    try {
      const folderPath = path.join(__dirname, 'secret-folder');
      const files = await fs.readdir(folderPath, { withFileTypes: true });
  
      // Проходим по каждому файлу в папке
      for (const file of files) {
        if (file.isFile()) {
          const filePath = path.join(folderPath, file.name);
          const stats = await fs.stat(filePath);  // Получаем информацию о файле
          const fileName = path.basename(file.name, path.extname(file.name));  // Имя файла без расширения
          const fileExt = path.extname(file.name).slice(1);  // Расширение файла
          const fileSize = (stats.size / 1024).toFixed(3);  // Размер файла в КБ с тремя знаками после запятой
  
          // Выводим информацию о файле
          console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
        }
      }
    } catch (err) {
      console.error('Ошибка при чтении директории:', err);
    }
}
  
displayFilesInfo();