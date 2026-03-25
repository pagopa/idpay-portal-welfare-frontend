const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];

console.log(`Fixing Swagger 2.0 schema array definition in ${inputPath}`);

if (!inputPath) {
  console.error('Missing file path argument.');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), inputPath);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const readFile = () => fs.readFileSync(filePath, 'utf8');
const writeFile = (content) => fs.writeFileSync(filePath, content, 'utf8');

function applyReplace(pattern, replacement) {
  const content = readFile();
  const updated = content.replace(pattern, replacement);
  const changed = content !== updated;

  if (changed) {
    writeFile(updated);
  }

  return changed;
}

const patternRef =
  /"schema"\s*:\s*\{[^{]+\{\s*"\$ref"\s*:\s*"#\/definitions\/([^"]+)"[^,]+,\s+"type"\s*:\s*"array"[^}]+}((?:\n|.)*"definitions"\s*:\s*\{)/gm;

const patternRef2 =
  /"schema"\s*:\s*\{\s*"type"\s*:\s*"array"[^{]+\{\s*"\$ref"\s*:\s*"#\/definitions\/([^"]+)"[^}]*}[^}]*}((?:\n|.)*"definitions"\s*:\s*\{)/gm;

const replaceRef =
  '"schema":{"$ref":"#/definitions/$1Array"}$2"$1Array":{"type": "array", "items": {"$ref": "#/definitions/$1"}},';

function fixArrayDef(pattern, replacement) {
  while (applyReplace(pattern, replacement)) {
   
  }
}

const patternNativeArrayType = (nativeType) =>
  new RegExp(
    `"schema"\\s*:\\s*\\{[^{]+\\{\\s*"type"\\s*:\\s*"${nativeType}"[^,]+,\\s+"type"\\s*:\\s*"array"[^}]+}`,
    'gm'
  );

const replaceNativeArrayType = (nativeType) =>
  `"schema":{"$ref":"#/definitions/${nativeType.toUpperCase()}Array"}`;

const patternNativeTypeRef = /"definitions"\s*:\s*\{/gm;

const replaceNativeArrayTypeRef = (nativeType) =>
  `"definitions" : {"${nativeType.toUpperCase()}Array":{"type": "array", "items": {"type": "${nativeType}"}},`;

function fixArrayNativeDef(nativeType) {
  applyReplace(
    patternNativeArrayType(nativeType),
    replaceNativeArrayType(nativeType)
  );

  applyReplace(
    patternNativeTypeRef,
    replaceNativeArrayTypeRef(nativeType)
  );
}

const patternNativeType = (nativeType) =>
  new RegExp(`"schema"\\s*:\\s*\\{\\s*"type"\\s*:\\s*"${nativeType}"\\s*}`, 'gm');

const replaceNativeType = (nativeType) =>
  `"schema":{"$ref":"#/definitions/${nativeType.toUpperCase()}Wrapper"}`;

const replaceNativeTypeRef = (nativeType) =>
  `"definitions" : {"${nativeType.toUpperCase()}Wrapper":{"type": "${nativeType}"},`;

function fixNativeDef(nativeType) {
  applyReplace(
    patternNativeType(nativeType),
    replaceNativeType(nativeType)
  );

  applyReplace(
    patternNativeTypeRef,
    replaceNativeTypeRef(nativeType)
  );
}

function exec() {
  fixArrayDef(patternRef, replaceRef);
  fixArrayDef(patternRef2, replaceRef);
  fixArrayNativeDef('string');
  fixNativeDef('string');
}

exec();