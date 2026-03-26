import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: 'Arrow Function',
    difficulty: 'easy',
    prompt: 'Escreva uma arrow function que recebe dois numeros e retorna a soma.',
    code: `const add = (a, b) => a + b;`,
  },
  {
    id: 'js-002',
    concept: 'Array Destructuring',
    difficulty: 'easy',
    prompt: 'Use desestruturacao de array para separar o primeiro elemento dos demais usando rest.',
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
  },
  {
    id: 'js-003',
    concept: 'Object Destructuring',
    difficulty: 'easy',
    prompt: 'Extraia as propriedades name e age de um objeto com desestruturacao, definindo valor padrao para age.',
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: 'Promise',
    difficulty: 'medium',
    prompt: 'Crie uma funcao que busca um usuario via fetch usando encadeamento de Promises com .then e .catch.',
    code: `const fetchUser = (id) =>
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .catch(err => console.error(err));`,
  },
  {
    id: 'js-005',
    concept: 'Async/Await',
    difficulty: 'medium',
    prompt: 'Reescreva a busca de usuario com async/await e trate erros com try/catch.',
    code: `async function getUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}`,
  },
  {
    id: 'js-006',
    concept: 'Array Methods',
    difficulty: 'medium',
    prompt: 'Encadeie filter, map e sort para obter os nomes dos usuarios ativos em ordem alfabetica.',
    code: `const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
  },
  {
    id: 'js-007',
    concept: 'Closure',
    difficulty: 'hard',
    prompt: 'Implemente um contador com closure que exponha metodos para incrementar, decrementar e ler o valor.',
    code: `function counter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}`,
  },
  {
    id: 'js-008',
    concept: 'Spread Operator',
    difficulty: 'easy',
    prompt: 'Mescle dois objetos usando spread, com as propriedades de overrides sobrescrevendo defaults.',
    code: `const merged = { ...defaults, ...overrides };`,
  },
  {
    id: 'js-009',
    concept: 'Optional Chaining',
    difficulty: 'easy',
    prompt: 'Acesse uma propriedade aninhada com optional chaining e forneca valor padrao com nullish coalescing.',
    code: `const city = user?.address?.city ?? 'Unknown';`,
  },
  {
    id: 'js-010',
    concept: 'Class',
    difficulty: 'medium',
    prompt: 'Defina uma classe Animal com construtor e metodo speak que usa template string.',
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return \`\${this.name} makes a noise.\`;
  }
}`,
  },
]
