const regexReplace = require('regex-replace');

regexReplace(
  '"items": \\{\\},',
  '"items":{"type": "object"},',
  'openApi/generated/initiative-swagger20.json',
  {
    fileContentsOnly: true,
  }
);
