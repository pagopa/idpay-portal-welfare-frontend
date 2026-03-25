const fs = require('fs');
const path = require('path');

const filePath = path.resolve(
  __dirname,
  '../generated/email-notification-swagger20.json'
);

if (!fs.existsSync(filePath)) {
  console.error(`File non trovato: ${filePath}`);
  process.exit(1);
}

try {
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    {
      pattern: /"items": \{\},/g,
      replacement: '"items":{"type": "object"},'
    },
    {
      pattern: /"rewardRule": \{\},/g,
      replacement: '"rewardRule":{"type": "object"},'
    },
    {
      pattern: /"operationId": "returns-fixed-automated-criteria",/g,
      replacement: '"operationId":"returnsFixedAutomatedCriteria",'
    }
  ];

  let changed = false;

  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

} catch (err) {
  console.error('Errore durante la generazione del file:', error);
  process.exit(1);
}