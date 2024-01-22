const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = './02-write-file/text.txt';

fs.promises.access(filePath, fs.constants.F_OK)
  .then(() => {})
  .catch(() => fs.promises.writeFile(filePath, ''));

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('--//--//--//-- Input text --//--//--//--');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('--//--//--//-- Ending --//--//--//--');
    writeStream.end();
    process.exit(0);
  }

  writeStream.write(input + '\n', (err) => {
    if (err) throw err;
  });
});

rl.on('close', () => {
  console.log('\n--//--//--//-- Ending --//--//--//--');
  writeStream.end();
});

process.on('SIGINT', () => {
  console.log('\n--//--//--//-- Ending --//--//--//--');
  writeStream.end();
  process.exit(0);
});