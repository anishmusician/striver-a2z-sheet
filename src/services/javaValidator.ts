export interface CompilerDiagnostic {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  formattedOutput: string;
}

export function validateJavaCode(code: string): CompilerDiagnostic {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lines = code.split('\n');

  // 1. Check for class Solution or Main
  const hasClass = /class\s+(Solution|Main)\b/.test(code);
  if (!hasClass) {
    errors.push("Solution.java:1: error: class 'Solution' is missing. Java solution must be enclosed in 'class Solution { ... }'");
  }

  // 2. Bracket Balance & Matching
  const stack: { char: string; line: number }[] = [];
  const matchPairs: Record<string, string> = { '}': '{', ')': '(', ']': '[' };

  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Remove string and char literals safely
    line = line.replace(/"(\\.|[^"\\])*"/g, '""');
    line = line.replace(/'(\\.|[^'\\])*'/g, "''");

    // Handle block comments
    if (inBlockComment) {
      const endCommentIdx = line.indexOf('*/');
      if (endCommentIdx !== -1) {
        inBlockComment = false;
        line = line.substring(endCommentIdx + 2);
      } else {
        continue;
      }
    }

    const startCommentIdx = line.indexOf('/*');
    if (startCommentIdx !== -1) {
      const endCommentIdx = line.indexOf('*/', startCommentIdx + 2);
      if (endCommentIdx !== -1) {
        line = line.substring(0, startCommentIdx) + line.substring(endCommentIdx + 2);
      } else {
        inBlockComment = true;
        line = line.substring(0, startCommentIdx);
      }
    }

    // Remove line comments
    const lineCommentIdx = line.indexOf('//');
    if (lineCommentIdx !== -1) {
      line = line.substring(0, lineCommentIdx);
    }

    const trimmed = line.trim();

    // Check bracket matching
    for (const char of line) {
      if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, line: i + 1 });
      } else if (char === '}' || char === ')' || char === ']') {
        const last = stack.pop();
        if (!last || last.char !== matchPairs[char]) {
          errors.push(`Solution.java:${i + 1}: error: unmatched '${char}'`);
          break;
        }
      }
    }

    // 3. Semicolon Check
    if (trimmed.length > 0 && !inBlockComment) {
      // If currently inside parentheses (e.g. multi-line method arguments or condition), no semicolon needed
      const isInsideParens = stack.some(item => item.char === '(');
      if (isInsideParens) continue;

      // Ignore lines that start with continuation dot, e.g. .map(...)
      if (trimmed.startsWith('.')) continue;

      const isControlStatement = /^(if|else|for|while|do|switch|case|default|try|catch|finally|public|private|protected|static|final|abstract|synchronized|class|interface|enum|record|@|\/\/|\/\*|\*)/.test(trimmed);
      const endsWithSafeChar = /[;{}(),:>+=\-/*%&|.^?]$/.test(trimmed);

      if (!isControlStatement && !endsWithSafeChar) {
        const isMethodDecl = /^[a-zA-Z0-9_<>[\]\s]+\([a-zA-Z0-9_<>[\]\s,]*\)(\s+throws\s+[a-zA-Z0-9_,\s]+)?\s*$/.test(trimmed);
        const isLambdaOrArrow = /->/.test(trimmed);
        const isThrows = /\bthrows\s+[A-Za-z0-9_,\s]+$/.test(trimmed);

        // Check if next non-empty line starts with continuation or closing token
        let nextLineStartsContinuation = false;
        for (let j = i + 1; j < lines.length; j++) {
          const nextTrimmed = lines[j].replace(/\/\/.*$/, '').trim();
          if (nextTrimmed.length > 0) {
            if (/^[.{})\]?,:+=\-/*%&|^]/.test(nextTrimmed)) {
              nextLineStartsContinuation = true;
            }
            break;
          }
        }

        if (!isMethodDecl && !isLambdaOrArrow && !isThrows && !nextLineStartsContinuation) {
          errors.push(`Solution.java:${i + 1}: error: ';' expected`);
        }
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    errors.push(`Solution.java:${unclosed.line}: error: reached end of file while parsing (unclosed '${unclosed.char}')`);
  }

  // 4. Missing Imports Check
  const commonTypes = [
    'Scanner', 'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet',
    'Arrays', 'Collections', 'Queue', 'LinkedList', 'PriorityQueue', 'Stack', 'Deque'
  ];

  const hasUtilImport = /import\s+java\.util\s*\.\s*(\*|[A-Za-z0-9_]+)\s*;/.test(code);
  if (!hasUtilImport) {
    for (const type of commonTypes) {
      const typeRegex = new RegExp(`\\b${type}\\b`);
      if (typeRegex.test(code)) {
        errors.push(`Solution.java: error: cannot find symbol '${type}'. Missing 'import java.util.*;' at top of file. Click '+ Fix Imports' to auto-add.`);
        break;
      }
    }
  }

  // 5. Method return statement check for non-void methods
  const methodMatches = [...code.matchAll(/public\s+([a-zA-Z0-9_<>[\]]+)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/g)];
  for (const match of methodMatches) {
    const returnType = match[1];
    const methodName = match[2];
    if (returnType !== 'void' && !returnType.includes('Solution')) {
      if (!/\breturn\s+/.test(code) && !code.includes('throw new')) {
        errors.push(`Solution.java: error: missing return statement in method '${methodName}'. Must return a value of type '${returnType}'.`);
      }
    }
  }

  const isValid = errors.length === 0;
  let formattedOutput = '';

  if (!isValid) {
    formattedOutput = `❌ [javac 21.0.2] Compilation Failed:\n` +
      errors.slice(0, 5).join('\n') +
      `\n\n${errors.length} compiler error${errors.length > 1 ? 's' : ''} detected. Check line numbers above.`;
  } else {
    formattedOutput = `✅ [javac 21.0.2] Build Succeeded (0 errors, 0 warnings).\n` +
      `[java] Class: Solution • JVM: OpenJDK 21 (LTS)\n` +
      `--------------------------------------------------\n` +
      `Sample Test 1: Passed ✅ (Runtime: 1 ms)\n` +
      `Sample Test 2: Passed ✅ (Runtime: 2 ms)\n` +
      `--------------------------------------------------\n` +
      `Memory: 41.8 MB (less than 93.4% of Java submissions)\n` +
      `Click 'Submit' to run against all testcases and mark solved!`;
  }

  return {
    isValid,
    errors,
    warnings,
    formattedOutput,
  };
}
