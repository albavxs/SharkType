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
  swift: [
    'func', 'var', 'let', 'if', 'else', 'guard', 'return', 'class', 'struct',
    'enum', 'for', 'in', 'while', 'import', 'override', 'init', 'self', 'super',
    'try', 'catch', 'throw', 'async', 'await', 'some', 'any', 'where', 'switch',
    'case', 'break', 'continue', 'nil', 'true', 'false', 'protocol', 'extension',
  ],
  scala: [
    'def', 'val', 'var', 'class', 'object', 'trait', 'extends', 'override',
    'return', 'if', 'else', 'for', 'yield', 'match', 'case', 'import', 'type',
    'abstract', 'sealed', 'given', 'using', 'new', 'with', 'null', 'true', 'false',
  ],
  ruby: [
    'def', 'end', 'if', 'else', 'elsif', 'unless', 'while', 'until', 'for',
    'in', 'do', 'begin', 'rescue', 'raise', 'return', 'class', 'module', 'require',
    'attr_reader', 'attr_writer', 'attr_accessor', 'nil', 'true', 'false', 'self',
    'super', 'yield', 'include', 'extend', 'puts', 'print',
  ],
  lua: [
    'function', 'local', 'if', 'then', 'else', 'elseif', 'end', 'for', 'do',
    'while', 'repeat', 'until', 'return', 'and', 'or', 'not', 'nil', 'true',
    'false', 'in', 'break', 'goto', 'require', 'print', 'pairs', 'ipairs',
    'setmetatable', 'getmetatable', 'pcall', 'error', 'type',
  ],
  html: [
    'div', 'span', 'class', 'href', 'src', 'type', 'id', 'name', 'value',
    'action', 'method', 'form', 'input', 'button', 'label', 'select', 'option',
    'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'table',
    'thead', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li', 'img', 'alt',
    'required', 'checked', 'disabled', 'placeholder', 'for', 'rel', 'charset',
  ],
  kotlin: [
    'fun', 'val', 'var', 'class', 'object', 'interface', 'data', 'sealed', 'enum',
    'if', 'else', 'when', 'for', 'while', 'return', 'import', 'package',
    'override', 'abstract', 'companion', 'init', 'constructor', 'super', 'this',
    'null', 'is', 'as', 'in', 'by', 'suspend', 'async', 'launch', 'coroutine',
    'lateinit', 'lazy', 'inline', 'reified', 'crossinline',
  ],
  docker: [
    'FROM', 'RUN', 'CMD', 'EXPOSE', 'ENV', 'COPY', 'ADD', 'WORKDIR', 'ARG',
    'LABEL', 'VOLUME', 'USER', 'ENTRYPOINT', 'HEALTHCHECK', 'STOPSIGNAL',
    'ONBUILD', 'SHELL', 'AS', 'interval', 'timeout', 'retries',
  ],
  git: [
    'init', 'add', 'commit', 'push', 'pull', 'fetch', 'clone', 'branch',
    'checkout', 'merge', 'rebase', 'reset', 'revert', 'stash', 'log',
    'status', 'diff', 'remote', 'cherry-pick', 'bisect', 'blame', 'tag',
  ],
  linux: [
    'ls', 'cd', 'pwd', 'cp', 'mv', 'rm', 'mkdir', 'touch', 'cat', 'grep',
    'find', 'chmod', 'chown', 'ps', 'kill', 'tar', 'curl', 'wget', 'awk',
    'sed', 'sort', 'uniq', 'head', 'tail', 'cut', 'echo', 'export', 'ssh',
    'systemctl', 'journalctl', 'zip', 'du', 'df',
  ],
  kubernetes: [
    'apiVersion', 'kind', 'metadata', 'spec', 'containers', 'replicas',
    'selector', 'template', 'ports', 'image', 'name', 'namespace', 'labels',
    'matchLabels', 'containerPort', 'port', 'targetPort', 'type',
    'kubectl', 'get', 'apply', 'describe', 'logs', 'rollout', 'scale',
    'autoscale', 'create', 'configmap', 'secret',
  ],
  terraform: [
    'resource', 'provider', 'variable', 'output', 'module', 'data', 'locals',
    'terraform', 'required_providers', 'default', 'type', 'value', 'source',
    'version', 'region', 'tags', 'init', 'plan', 'apply', 'destroy', 'workspace',
  ],
  ansible: [
    'hosts', 'tasks', 'name', 'become', 'handlers', 'roles', 'vars',
    'when', 'notify', 'register', 'with_items', 'template', 'service',
    'copy', 'apt', 'state', 'enabled', 'update_cache', 'upgrade',
  ],
  cicd: [
    'name', 'on', 'jobs', 'runs-on', 'steps', 'uses', 'with', 'run',
    'needs', 'if', 'push', 'pull_request', 'branches',
  ],
  nmap: [
    'nmap', 'scan', 'host', 'port', 'ports', 'sudo', 'grep',
  ],
  'web-recon': [
    'curl', 'dig', 'whois', 'nslookup', 'grep', 'resolve',
  ],
  firewall: [
    'sudo', 'ufw', 'iptables', 'INPUT', 'ACCEPT', 'DROP', 'allow', 'deny',
  ],
  'network-analysis': [
    'sudo', 'tcpdump', 'netstat', 'ss', 'grep', 'LISTEN',
  ],
  hardening: [
    'sudo', 'find', 'chmod', 'chown', 'grep', 'passwd', 'adduser', 'usermod',
  ],
  crypto: [
    'openssl', 'ssh', 'keygen', 'req', 'verify', 'chmod', 'cat',
  ],
}
