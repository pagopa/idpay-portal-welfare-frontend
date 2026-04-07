const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Missing file path argument.');
  process.exit(1);
}

const filePath = path.resolve(process.cwd(), inputPath);
const tmpPath = `${filePath}.tmp`;

console.log(`Fixing Swagger 2.0 schema array definition in ${inputPath}`);

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const patternRef =
  /"schema"\s*:\s*\{[^{]+\{\s*"\$ref"\s*:\s*"#\/definitions\/([^"]+)"[^,]+,\s+"type"\s*:\s*"array"[^}]+}((?:\n|.)*"definitions"\s*:\s*\{)/gm;

const patternRef2 =
  /"schema"\s*:\s*\{\s*"type"\s*:\s*"array"[^{]+\{\s*"\$ref"\s*:\s*"#\/definitions\/([^"]+)"[^}]*}[^}]*}((?:\n|.)*"definitions"\s*:\s*\{)/gm;

const replaceRef =
  '"schema":{"$ref":"#/definitions/$1Array"}$2"$1Array":{"type": "array", "items": {"$ref": "#/definitions/$1"}},';

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

const patternNativeType = (nativeType) =>
  new RegExp(`"schema"\\s*:\\s*\\{\\s*"type"\\s*:\\s*"${nativeType}"\\s*}`, 'gm');

const replaceNativeType = (nativeType) =>
  `"schema":{"$ref":"#/definitions/${nativeType.toUpperCase()}Wrapper"}`;

const replaceNativeTypeRef = (nativeType) =>
  `"definitions" : {"${nativeType.toUpperCase()}Wrapper":{"type": "${nativeType}"},`;

function applyReplace(content, pattern, replacement) {
  const updated = content.replace(pattern, replacement);
  return {
    content: updated,
    changed: content !== updated
  };
}

function fixArrayDef(content, pattern, replacement) {
  let current = content;
  let changed = false;

  while (true) {
    const result = applyReplace(current, pattern, replacement);

    if (!result.changed) {
      break;
    }

    current = result.content;
    changed = true;
  }

  return { content: current, changed };
}

function fixArrayNativeDef(content, nativeType) {
  let current = content;
  let changed = false;

  const firstPass = applyReplace(
    current,
    patternNativeArrayType(nativeType),
    replaceNativeArrayType(nativeType)
  );
  current = firstPass.content;
  changed = changed || firstPass.changed;

  const secondPass = applyReplace(
    current,
    patternNativeTypeRef,
    replaceNativeArrayTypeRef(nativeType)
  );
  current = secondPass.content;
  changed = changed || secondPass.changed;

  return { content: current, changed };
}

function fixNativeDef(content, nativeType) {
  let current = content;
  let changed = false;

  const firstPass = applyReplace(
    current,
    patternNativeType(nativeType),
    replaceNativeType(nativeType)
  );
  current = firstPass.content;
  changed = changed || firstPass.changed;

  const secondPass = applyReplace(
    current,
    patternNativeTypeRef,
    replaceNativeTypeRef(nativeType)
  );
  current = secondPass.content;
  changed = changed || secondPass.changed;

  return { content: current, changed };
}

function exec() {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;
    let changed = false;

    const refFix1 = fixArrayDef(content, patternRef, replaceRef);
    content = refFix1.content;
    changed = changed || refFix1.changed;

    const refFix2 = fixArrayDef(content, patternRef2, replaceRef);
    content = refFix2.content;
    changed = changed || refFix2.changed;

    const nativeArrayFix = fixArrayNativeDef(content, 'string');
    content = nativeArrayFix.content;
    changed = changed || nativeArrayFix.changed;

    const nativeFix = fixNativeDef(content, 'string');
    content = nativeFix.content;
    changed = changed || nativeFix.changed;

    if (changed) {
      fs.writeFileSync(tmpPath, content, 'utf8');
      fs.renameSync(tmpPath, filePath);
    }
  } catch (err) {
    console.error('Error while fixing Swagger schema definitions:', err);
    process.exit(1);
  }
}

exec();