const fs = require('fs');
const path = require('path');

const filePath = path.resolve(
  __dirname,
  '../../src/api/generated/email-notification/requestTypes.ts'
);

try {
  const content = fs.readFileSync(filePath, 'utf8');

  const updatedContent = content.replace(
    /readonly sort\?: array;/g,
    'readonly sort?: Array<string>;'
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }
} catch (error) {
  console.error('Errore durante la generazione del file:', error);
  process.exit(1);
}