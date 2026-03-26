import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: { pt: 'Arrow Function', en: 'Arrow Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Arrow functions são a forma concisa de definir funções em JS moderno. Em vez de escrever function add(a, b) { return a + b }, defina add usando a sintaxe de seta (=>) em uma única linha — sem chaves nem return explícito.',
      en: 'Arrow functions are the concise way to define functions in modern JS. Instead of writing function add(a, b) { return a + b }, define add using the arrow syntax (=>) in a single line — no braces or explicit return needed.',
    },
    code: `const add = (a, b) => a + b;`,
  },
  {
    id: 'js-002',
    concept: { pt: 'Array Destructuring', en: 'Array Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Desestruturação de array extrai elementos por posição sem usar índices manuais. A partir de [1, 2, 3, 4], capture o primeiro elemento em "first" e agrupe todos os restantes em "rest" com o rest operator (...).',
      en: 'Array destructuring extracts elements by position without manual indexing. From [1, 2, 3, 4], capture the first element into "first" and gather all remaining ones into "rest" using the rest operator (...).',
    },
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
  },
  {
    id: 'js-003',
    concept: { pt: 'Object Destructuring', en: 'Object Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Desestruturação de objeto extrai propriedades pelo nome em uma só atribuição. A partir do objeto "user", extraia "name" e "age" — e defina 0 como valor padrão para "age" caso a propriedade não exista no objeto.',
      en: 'Object destructuring extracts properties by name in a single assignment. From the "user" object, extract "name" and "age" — and set 0 as the default value for "age" in case the property doesn\'t exist on the object.',
    },
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: { pt: 'Promise', en: 'Promise' },
    difficulty: 'medium',
    prompt: {
      pt: 'Promises representam resultados de operações assíncronas como chamadas HTTP. Implemente fetchUser usando a API fetch: monte a URL com template literal, encadeie .then para converter a resposta em JSON e .catch para tratar erros.',
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
      pt: 'Async/await é syntax sugar sobre Promises que torna o código assíncrono tão legível quanto síncrono. Reimplemente getUser com async function, aguardando cada operação com await e capturando falhas com try/catch.',
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
      pt: 'Filter, map e sort são os três métodos mais usados em processamento funcional de listas. Em uma cadeia de chamadas, filtre apenas os usuários ativos, extraia o nome de cada um e ordene a lista alfabeticamente.',
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
      pt: 'Closures permitem que funções internas acessem e modifiquem variáveis da função externa mesmo após ela ter retornado. Implemente counter como uma fábrica que retorna {increment, decrement, value} — as três funções compartilham a mesma variável "count" via closure.',
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
      pt: 'O spread operator ({...obj}) copia todas as propriedades de um objeto para outro. Crie "merged" combinando "defaults" e "overrides": propriedades com o mesmo nome em "overrides" devem ter prioridade, sobrescrevendo as de "defaults".',
      en: 'The spread operator ({...obj}) copies all properties from one object to another. Create "merged" by combining "defaults" and "overrides": properties with the same name in "overrides" should take priority, overwriting those from "defaults".',
    },
    code: `const merged = { ...defaults, ...overrides };`,
  },
  {
    id: 'js-009',
    concept: { pt: 'Optional Chaining', en: 'Optional Chaining' },
    difficulty: 'easy',
    prompt: {
      pt: 'Ao acessar user.address.city, se "address" for null o JavaScript lança um TypeError. Use optional chaining (?.) em cada nível para um acesso seguro e o operador nullish coalescing (??) para retornar "Unknown" quando qualquer parte for null ou undefined.',
      en: 'When accessing user.address.city, if "address" is null JavaScript throws a TypeError. Use optional chaining (?.) at each level for safe access and the nullish coalescing operator (??) to return "Unknown" when any part is null or undefined.',
    },
    code: `const city = user?.address?.city ?? 'Unknown';`,
  },
  {
    id: 'js-010',
    concept: { pt: 'Class', en: 'Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes em JavaScript encapsulam estado e comportamento no estilo orientado a objetos. Defina Animal com um constructor que inicializa this.name e um método speak que retorna uma mensagem usando template literal com o nome do animal.',
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
