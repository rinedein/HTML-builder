const fs = require('fs').promises;
const path = require('path');

const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputDir = path.join(__dirname, 'project-dist');

async function readTemplate() {
  try {
    const data = await fs.readFile(templatePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`File reading error: ${error.message}`);
  }
}

async function getComponentData(componentName) {
  const componentPath = path.join(componentsDir, `${componentName}.html`);
  try {
    const data = await fs.readFile(componentPath, 'utf8');
    return data;
  } catch (error) {
    console.error(`File reading error: ${error.message}`);
  }
}

async function replaceTemplateTags(data) {
  const re = /\{\{([^}]+)\}\}/g;
  const tags = data.match(re) || [];
  let result = data;
  for (const tag of tags) {
    const componentName = tag.slice(2, -2).trim();
    const componentData = await getComponentData(componentName);
    result = result.replace(tag, componentData);
  }
  return result;
}

async function buildIndexHtml() {
  try {
    const templateData = await readTemplate();
    const outputData = await replaceTemplateTags(templateData);
    await fs.mkdir(outputDir, { recursive: true });
    const indexPath = path.join(outputDir, 'index.html');
    const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
    if (!indexExists) {
      await fs.writeFile(indexPath, outputData);
      console.log('index.html successfully created');
    } else {
      await fs.writeFile(indexPath, outputData);
      console.log('index.html successfully rewritten');
    }
  } catch (error) {
    console.error(`Error during file creation index.html: ${error.message}`);
  }
}

async function buildStyleCss() {
  try {
    const cssFiles = await fs.readdir(stylesDir);
    const cssContent = await Promise.all(
      cssFiles
        .filter(file => path.extname(file) === '.css')
        .map(file => fs.readFile(path.join(stylesDir, file), 'utf8'))
    );
    await fs.writeFile(path.join(outputDir, 'style.css'), cssContent.join('\n'));
    console.log('style.css successfully created');
  } catch (error) {
    console.error(`rror during file creation style.css: ${error.message}`);
  }
}

async function copyAssets() {
  try {
    await fs.mkdir(path.join(outputDir, 'assets'), { recursive: true });

    const copyRecursive = async (src, dest) => {
      const stat = await fs.stat(src);
      if (stat.isDirectory()) {
        await fs.mkdir(dest, { recursive: true });
        const files = await fs.readdir(src);
        await Promise.all(files.map(file => copyRecursive(path.join(src, file), path.join(dest, file))));
      } else {
        await fs.copyFile(src, dest);
      }
    };

    await copyRecursive(assetsDir, path.join(outputDir, 'assets'));
    console.log('assets copied successfully');
  } catch (error) {
    console.error(`Error while copying files from a folder assets: ${error.message}`);
  }
}




async function buildProject() {
  await buildIndexHtml();
  await buildStyleCss();
  await copyAssets();
}

buildProject();