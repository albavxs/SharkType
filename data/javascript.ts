import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: { pt: 'Arrow Function', en: 'Arrow Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'No JS moderno, a arrow function é o jeito mais enxuto de escrever funções. Ao invés de usar function add(a, b) { return a + b }, reescreva add com a sintaxe de seta (=>) numa linha só — sem chaves e sem return.',
      en: 'Arrow functions are the concise way to define functions in modern JS. Instead of writing function add(a, b) { return a + b }, define add using the arrow syntax (=>) in a single line — no braces or explicit return needed.',
    },
    code: `const add = (a, b) => a + b;`,
  },
  {
    id: 'js-002',
    concept: { pt: 'Array Destructuring', en: 'Array Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Com array destructuring, você extrai elementos pela posição sem ficar acessando índice na mão. Dado [1, 2, 3, 4], pegue o primeiro elemento em "first" e junte o restante em "rest" usando o rest operator (...).',
      en: 'Array destructuring extracts elements by position without manual indexing. From [1, 2, 3, 4], capture the first element into "first" and gather all remaining ones into "rest" using the rest operator (...).',
    },
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
  },
  {
    id: 'js-003',
    concept: { pt: 'Object Destructuring', en: 'Object Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Object destructuring deixa você extrair propriedades pelo nome numa tacada só. Do objeto "user", tire "name" e "age" — e coloque 0 como valor padrão pra "age" caso a propriedade não exista.',
      en: 'Object destructuring extracts properties by name in a single assignment. From the "user" object, extract "name" and "age" — and set 0 as the default value for "age" in case the property doesn\'t exist on the object.',
    },
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: { pt: 'Promise', en: 'Promise' },
    difficulty: 'medium',
    prompt: {
      pt: 'Promises representam o resultado de operações assíncronas tipo chamadas HTTP. Implemente fetchUser usando a fetch API: monte a URL com template literal, encadeie .then pra converter a resposta em JSON e .catch pra tratar erros.',
      en: 'Promises represent the outcome of async operations like HTTP calls. Implement fetchUser using the fetch API: build the URL with a template literal, chain .then to parse the response as JSON and .catch to handle errors.',
    },
    code: `const fetchUser = (id) =>
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .catch(err => console.error(err));`,
  },
  {
    id: 'js-005',
    concept: { pt: 'Async/Await', en: 'Async/Await' },
    difficulty: 'medium',
    prompt: {
      pt: 'Async/await é syntax sugar em cima de Promises que faz código assíncrono ficar legível como síncrono. Reimplemente getUser como async function, usando await pra esperar cada operação e try/catch pra capturar falhas.',
      en: 'Async/await is syntactic sugar over Promises that makes async code read like synchronous code. Reimplement getUser as an async function, awaiting each operation and catching failures with try/catch.',
    },
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
    concept: { pt: 'Array Methods', en: 'Array Methods' },
    difficulty: 'medium',
    prompt: {
      pt: 'Filter, map e sort são os três métodos mais usados pra processar listas de forma funcional. Numa cadeia só, filtre os usuários ativos, extraia o nome de cada um e ordene a lista em ordem alfabética.',
      en: 'Filter, map, and sort are the three most common methods for functional list processing. In a single chain, filter only active users, extract each name, and sort the list alphabetically.',
    },
    code: `const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
  },
  {
    id: 'js-007',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'hard',
    prompt: {
      pt: 'Closures deixam funções internas acessarem e modificarem variáveis da função de fora, mesmo depois que ela já retornou. Implemente counter como uma factory que retorna {increment, decrement, value} — as três funções compartilham a mesma variável "count" via closure.',
      en: 'Closures let inner functions access and modify variables from the outer function even after it returns. Implement counter as a factory that returns {increment, decrement, value} — all three functions share the same "count" variable via closure.',
    },
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
    concept: { pt: 'Spread Operator', en: 'Spread Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'O spread operator ({...obj}) copia todas as propriedades de um objeto pra outro. Crie "merged" juntando "defaults" e "overrides": as propriedades de "overrides" têm prioridade e sobrescrevem as de "defaults".',
      en: 'The spread operator ({...obj}) copies all properties from one object to another. Create "merged" by combining "defaults" and "overrides": properties with the same name in "overrides" should take priority, overwriting those from "defaults".',
    },
    code: `const merged = { ...defaults, ...overrides };`,
  },
  {
    id: 'js-009',
    concept: { pt: 'Optional Chaining', en: 'Optional Chaining' },
    difficulty: 'easy',
    prompt: {
      pt: 'Se você acessar user.address.city e "address" for null, o JS estoura um TypeError. Use optional chaining (?.) em cada nível pra acessar de forma segura e o nullish coalescing (??) pra retornar "Unknown" quando qualquer parte for null ou undefined.',
      en: 'When accessing user.address.city, if "address" is null JavaScript throws a TypeError. Use optional chaining (?.) at each level for safe access and the nullish coalescing operator (??) to return "Unknown" when any part is null or undefined.',
    },
    code: `const city = user?.address?.city ?? 'Unknown';`,
  },
  {
    id: 'js-010',
    concept: { pt: 'Class', en: 'Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes em JS encapsulam estado e comportamento no estilo orientado a objetos. Defina Animal com um constructor que seta this.name e um método speak que retorna uma mensagem usando template literal com o nome do bicho.',
      en: 'Classes in JavaScript encapsulate state and behavior in an object-oriented style. Define Animal with a constructor that initializes this.name and a speak method that returns a message using a template literal with the animal\'s name.',
    },
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
