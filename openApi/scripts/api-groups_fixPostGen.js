const fs = require('fs');
const path = require('path');

const filePath = path.resolve(
  __dirname,
  '../../src/api/generated/groups/requestTypes.ts'
);

const tmpPath = `${filePath}.tmp`;

if (!fs.existsSync(filePath)) {
  console.error(`File non trovato: ${filePath}`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(filePath, 'utf8');

  const pattern = /readonly sort\?: array;/g;
  const replacement = 'readonly sort?: Array<string>;';

  if (!pattern.test(content)) {
    process.exit(0);
  }

  const updated = content.replace(pattern, replacement);

  fs.writeFileSync(tmpPath, updated, 'utf8');
  fs.renameSync(tmpPath, filePath);

} catch (err) {
  console.error('Errore durante la generazione del file:', err);
  process.exit(1);
}