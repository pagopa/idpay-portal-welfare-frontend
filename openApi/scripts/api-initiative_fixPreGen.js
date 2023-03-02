const regexReplace = require('regex-replace');

regexReplace(
  '"items": \\{\\},',
  '"items":{"type": "object"},',
  'openApi/generated/initiative-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"rewardRule": \\{\\},',
  '"rewardRule":{"type": "object"},',
  'openApi/generated/initiative-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"OperationDTO": \\{\\},',
  '"OperationDTO":{"type": "object", "properties": { "operationId": {"type":"string"}, "operationType": {"type":"string"}, "operationDate": {"type":"string"}, "amount": {"type":"number"}, "accrued": {"type":"number"}, "brand": {"type":"string"}, "idTrxIssuer": {"type":"string"}, "idTrxAcquirer":{"type":"string"}, "brandLogo": {"type":"string"}, "maskedPan": {"type":"string"}, "channel": {"type":"string"}, "iban": {"type":"string"}, "eventId": {"type": "string"}}, "required": ["operationId","operationType","operationDate"]},',
  'openApi/generated/initiative-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"OperationListDTO": \\{',
  '"OperationListDTO":{"type": "object", "items": {"$ref": "#/definitions/OperationDTO"},',
  'openApi/generated/initiative-swagger20.json',
  {
    fileContentsOnly: true,
  }
);

regexReplace(
  '"operationId": "returns-fixed-automated-criteria",',
  '"operationId":"returnsFixedAutomatedCriteria",',
  'openApi/generated/initiative-swagger20.json',
  {
    fileContentsOnly: true,
  }
);
