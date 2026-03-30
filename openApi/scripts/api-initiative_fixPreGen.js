const fs = require('fs');
const path = require('path');

const filePath = path.resolve(
  __dirname,
  '../generated/initiative-swagger20.json'
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

  const operationDtoReplacement = {
    type: 'object',
    properties: {
      operationId: { type: 'string' },
      operationType: { type: 'string' },
      operationDate: { type: 'string' },
      amountCents: { type: 'number' },
      accruedCents: { type: 'number' },
      brand: { type: 'string' },
      idTrxIssuer: { type: 'string' },
      idTrxAcquirer: { type: 'string' },
      brandLogo: { type: 'string' },
      maskedPan: { type: 'string' },
      channel: { type: 'string' },
      iban: { type: 'string' },
      eventId: { type: 'string' },
      status: { type: 'string' },
      businessName: { type: 'string' },
      instrumentType: { type: 'string' }
    },
    required: ['operationId', 'operationType', 'operationDate']
  };

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

    if (
      obj.OperationDTO &&
      typeof obj.OperationDTO === 'object' &&
      !Array.isArray(obj.OperationDTO) &&
      Object.keys(obj.OperationDTO).length === 0
    ) {
      obj.OperationDTO = operationDtoReplacement;
      changed = true;
    }

    if (
      obj.OperationListDTO &&
      typeof obj.OperationListDTO === 'object' &&
      !Array.isArray(obj.OperationListDTO)
    ) {
      const nextValue = {
        ...obj.OperationListDTO,
        type: 'object',
        items: {
          $ref: '#/definitions/OperationDTO'
        }
      };

      if (JSON.stringify(obj.OperationListDTO) !== JSON.stringify(nextValue)) {
        obj.OperationListDTO = nextValue;
        changed = true;
      }
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