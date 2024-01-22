const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');

fs.access(stylesDir)
  .then(() => fs.readdir(stylesDir))
  .then(files => files.filter(file => path.extname(file) === '.css'))
  .then(cssFiles => Promise.all(cssFiles.map(file => {
    const filePath = path.join(stylesDir, file);
    return fs.stat(filePath).then(stats => ({ filePath, stats }));
  })))
  .then(filesWithStats => filesWithStats.filter(file => file.stats.isFile()))
  .then(cssFiles => Promise.all(cssFiles.map(file => {
    const filePath = file.filePath;
    return fs.readFile(filePath, 'utf8');
  })))
  .then(cssContents => cssContents.join('\n'))
  .then(cssContent => fs.writeFile(path.join(outputDir, 'bundle.css'), cssContent))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });