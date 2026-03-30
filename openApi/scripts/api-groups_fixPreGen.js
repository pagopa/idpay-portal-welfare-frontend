const fs = require('fs');
const path = require('path');

const filePath = path.resolve(
  __dirname,
  '../generated/groups-swagger20.json'
);

const tmpPath = `${filePath}.tmp`;

if (!fs.existsSync(filePath)) {
  console.error(`File non trovato: ${filePath}`);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  let changed = false;

  const deepFix = (obj) => {
    if (!obj || typeof obj !== 'object') return;

    if (
      obj.items &&
      typeof obj.items === 'object' &&
      !Array.isArray(obj.items) &&
      Object.keys(obj.items).length === 0
    ) {
      obj.items = { type: 'object' };
      changed = true;
    }

    if (
      obj.rewardRule &&
      typeof obj.rewardRule === 'object' &&
      !Array.isArray(obj.rewardRule) &&
      Object.keys(obj.rewardRule).length === 0
    ) {
      obj.rewardRule = { type: 'object' };
      changed = true;
    }

    if (obj.operationId === 'returns-fixed-automated-criteria') {
      obj.operationId = 'returnsFixedAutomatedCriteria';
      changed = true;
    }

    Object.values(obj).forEach(deepFix);
  };

  deepFix(json);

  if (changed) {
    fs.writeFileSync(tmpPath, JSON.stringify(json, null, 2), 'utf8');
    fs.renameSync(tmpPath, filePath);
  }

} catch (err) {
  console.error('Errore durante la generazione del file:', err);
  process.exit(1);
}