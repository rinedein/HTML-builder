const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(secretFolderPath)
  .then((files) => {
    files.forEach(async (file) => {
      const filePath = path.join(secretFolderPath, file);
      const fileStat = await fs.promises.stat(filePath);

      if (fileStat.isFile()) {
        const fileName = path.parse(filePath).name;
        const fileExt = path.parse(filePath).ext.replace('.', '');
        const fileSize = fileStat.size;

        console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
      }
    });
  })
  .catch((err) => {
    console.error(err);
  });