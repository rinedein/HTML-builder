const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.readdir(src, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      fs.readdir(dest, { withFileTypes: true }, (err, destFiles) => {
        if (err) {
          console.error(err);
          return;
        }
        const destFileNames = destFiles.map((file) => file.name);
        files.forEach((file) => {
          const srcPath = path.join(src, file.name);
          const destPath = path.join(dest, file.name);
          if (file.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFile(srcPath, destPath, fs.constants.COPYFILE_FICLONE, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log(`${srcPath} copy in ${destPath}`);
            });
          }
        });
        destFiles.forEach((destFile) => {
          const destFilePath = path.join(dest, destFile.name);
          if (!files.find((file) => file.name === destFile.name)) {
            fs.unlink(destFilePath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log(`${destFilePath} delete`);
            });
          }
        });
      });
    });
  });
}

copyDir('./04-copy-directory/files', './04-copy-directory/files-copy');