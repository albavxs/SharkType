export const languageKeywords: Record<string, string[]> = {
  javascript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'async', 'await', 'import', 'export', 'from', 'class', 'new', 'try', 'catch',
    'throw', 'typeof', 'instanceof', 'this', 'default', 'switch', 'case', 'break',
  ],
  typescript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'async', 'await', 'import', 'export', 'from', 'class', 'new', 'try', 'catch',
    'throw', 'type', 'interface', 'enum', 'extends', 'implements', 'keyof', 'typeof',
    'readonly', 'public', 'private', 'protected', 'as', 'is', 'in', 'infer',
  ],
  python: [
    'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from',
    'class', 'with', 'as', 'try', 'except', 'raise', 'yield', 'lambda', 'pass',
    'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None',
  ],
  rust: [
    'fn', 'let', 'mut', 'if', 'else', 'for', 'while', 'match', 'return',
    'struct', 'impl', 'enum', 'pub', 'use', 'mod', 'move', 'async', 'await',
    'self', 'Self', 'where', 'trait', 'type', 'const', 'static', 'ref',
  ],
  go: [
    'func', 'var', 'if', 'else', 'for', 'range', 'return', 'struct', 'interface',
    'type', 'package', 'import', 'defer', 'go', 'chan', 'map', 'make', 'nil',
    'switch', 'case', 'default', 'break', 'continue', 'select',
  ],
  java: [
    'public', 'private', 'protected', 'class', 'interface', 'return', 'if', 'else',
    'for', 'while', 'new', 'try', 'catch', 'throw', 'throws', 'import', 'static',
    'void', 'final', 'abstract', 'extends', 'implements', 'default', 'switch', 'case',
    'record', 'var', 'sealed', 'permits',
  ],
  sql: [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'ON', 'GROUP',
    'BY', 'HAVING', 'ORDER', 'INSERT', 'INTO', 'UPDATE', 'DELETE', 'CREATE',
    'INDEX', 'WITH', 'AS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'SET',
    'VALUES', 'DESC', 'ASC', 'UNIQUE', 'NOT', 'NULL', 'AND', 'OR', 'IN',
    'OVER', 'PARTITION', 'RANK', 'COUNT', 'AVG', 'NOW', 'INTERVAL',
  ],
  bash: [
    'if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac',
    'function', 'return', 'local', 'echo', 'in', 'cat', 'grep', 'awk', 'sort',
    'uniq', 'head', 'wc', 'command',
  ],
  css: [
    'display', 'flex', 'grid', 'position', 'margin', 'padding', 'border', 'color',
    'background', 'font', 'animation', 'transition', 'content', 'width', 'height',
    'gap', 'align', 'justify', 'transform', 'opacity', 'none', 'auto', 'inherit',
    'repeat', 'minmax',
  ],
  cpp: [
    'template', 'typename', 'class', 'struct', 'namespace', 'return', 'if', 'else',
    'for', 'while', 'auto', 'const', 'void', 'int', 'double', 'using', 'std',
    'public', 'private', 'protected', 'virtual', 'override', 'constexpr',
  ],
}
