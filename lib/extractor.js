import fs from 'fs/promises';
import path from 'path';

export const extractFunctionFromFile = async (filePath, functionName) => {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const fileExtension = path.extname(filePath).toLowerCase();

  const language = getLanguageFromExtension(fileExtension);

  const patterns = getFunctionPatterns(language, functionName);

  for (const pattern of patterns) {
    const match = fileContent.match(pattern);
    if (match && match.length > 0) {
      return match[0].trim();
    }
  }

  throw new Error(`Function "${functionName}" not found in ${filePath}`);
}

const getLanguageFromExtension = (extension) => {
  const languageMap = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.php': 'php',
    '.rb': 'ruby',
    '.go': 'go',
    '.rs': 'rust',
    '.kt': 'kotlin',
    '.swift': 'swift'
  };

  return languageMap[extension] || 'unknown';
}

const getFunctionPatterns = (language, functionName) => {
  const escapedName = functionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  switch (language) {
    case 'javascript':
    case 'typescript':
      return [
        new RegExp(`function\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`(?:const|let|var)\\s+${escapedName}\\s*=\\s*(?:async\\s+)?\\([^)]*\\)\\s*=>\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`(?:const|let|var)\\s+${escapedName}\\s*=\\s*(?:async\\s+)?[^=\\s]+\\s*=>\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^\\s*}`, 'gm'),
        new RegExp(`async\\s+function\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`(?:async\\s+)?${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^\\s*}`, 'gm'),
        new RegExp(`export\\s+(?:async\\s+)?function\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm')
      ];

    case 'python':
      return [
        new RegExp(`def\\s+${escapedName}\\s*\\([^)]*\\):[\\s\\S]*?(?=^\\S|^def\\s|^class\\s|^$|\\Z)`, 'gm'),
        new RegExp(`async\\s+def\\s+${escapedName}\\s*\\([^)]*\\):[\\s\\S]*?(?=^\\S|^def\\s|^class\\s|^async\\s+def\\s|^$|\\Z)`, 'gm'),
        new RegExp(`def\\s+${escapedName}\\s*\\([^)]*\\):[\\s\\S]*?(?=^\\s{0,4}\\S|^$|\\Z)`, 'gm')
      ];

    case 'java':
      return [
        new RegExp(`(?:public|private|protected)?\\s*(?:static)?\\s*(?:final)?\\s*(?:\\w+\\s+)?${escapedName}\\s*\\([^)]*\\)\\s*(?:throws\\s+[\\w,\\s]+)?\\s*{[\\s\\S]*?^\\s*}`, 'gm')
      ];

    case 'cpp':
    case 'c':
      return [
        new RegExp(`(?:\\w+\\s+)*${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`\\w+\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm')
      ];

    case 'csharp':
      return [
        new RegExp(`(?:public|private|protected|internal)?\\s*(?:static)?\\s*(?:virtual|override)?\\s*(?:async)?\\s*\\w+\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^\\s*}`, 'gm')
      ];

    case 'php':
      return [
        new RegExp(`function\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`(?:public|private|protected)?\\s*(?:static)?\\s*function\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^\\s*}`, 'gm')
      ];

    case 'ruby':
      return [
        new RegExp(`def\\s+${escapedName}[\\s\\S]*?^end`, 'gm')
      ];

    case 'go':
      return [
        new RegExp(`func\\s+${escapedName}\\s*\\([^)]*\\)(?:\\s*\\([^)]*\\))?\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`func\\s*\\([^)]*\\)\\s*${escapedName}\\s*\\([^)]*\\)(?:\\s*\\([^)]*\\))?\\s*{[\\s\\S]*?^}`, 'gm')
      ];

    case 'rust':
      return [
        new RegExp(`fn\\s+${escapedName}\\s*\\([^)]*\\)(?:\\s*->\\s*[^{]+)?\\s*{[\\s\\S]*?^}`, 'gm')
      ];

    case 'kotlin':
      return [
        new RegExp(`fun\\s+${escapedName}\\s*\\([^)]*\\)(?:\\s*:\\s*[^{]+)?\\s*{[\\s\\S]*?^}`, 'gm')
      ];

    case 'swift':
      return [
        // Function
        new RegExp(`func\\s+${escapedName}\\s*\\([^)]*\\)(?:\\s*->\\s*[^{]+)?\\s*{[\\s\\S]*?^}`, 'gm')
      ];

    default:
      // Fallback - try common patterns
      return [
        new RegExp(`function\\s+${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm'),
        new RegExp(`def\\s+${escapedName}\\s*\\([^)]*\\):[\\s\\S]*?(?=^\\S|^def\\s|^class\\s|^$|\\Z)`, 'gm'),
        new RegExp(`${escapedName}\\s*\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'gm')
      ];
  }
}


// Fallback
export async function extractFunctionFromFileAdvanced(filePath, functionName) {
  try {
    return await extractFunctionFromFile(filePath, functionName);
  } catch (error) {
    throw error;
  }
}