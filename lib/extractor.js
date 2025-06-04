import fs from 'fs/promises';

export async function extractFunctionFromFile(filePath, functionName) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const funcRegex = new RegExp(
    `function\\s+${functionName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`,
    'gm'
  );
  const match = fileContent.match(funcRegex);

  if (!match || match.length === 0) {
    throw new Error(`Function "${functionName}" not found in ${filePath}`);
  }

  return match[0];
}
