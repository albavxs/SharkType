import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: 'Arrow Function',
    difficulty: 'easy',
    prompt: 'Arrow functions sao a forma concisa de definir funcoes em JS moderno. Em vez de escrever function add(a, b) { return a + b }, defina add usando a sintaxe de seta (=>) em uma unica linha — sem chaves nem return explicito.',
    code: `const add = (a, b) => a + b;`,
  },
  {
    id: 'js-002',
    concept: 'Array Destructuring',
    difficulty: 'easy',
    prompt: 'Desestruturacao de array extrai elementos por posicao sem usar indices manuais. A partir de [1, 2, 3, 4], capture o primeiro elemento em "first" e agrupe todos os restantes em "rest" com o rest operator (...).',
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
  },
  {
    id: 'js-003',
    concept: 'Object Destructuring',
    difficulty: 'easy',
    prompt: 'Desestruturacao de objeto extrai propriedades pelo nome em uma so atribuicao. A partir do objeto "user", extraia "name" e "age" — e defina 0 como valor padrao para "age" caso a propriedade nao exista no objeto.',
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: 'Promise',
    difficulty: 'medium',
    prompt: 'Promises representam resultados de operacoes assincronas como chamadas HTTP. Implemente fetchUser usando a API fetch: monte a URL com template literal, encadeie .then para converter a resposta em JSON e .catch para tratar erros.',
    code: `const fetchUser = (id) =>
  fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .catch(err => console.error(err));`,
  },
  {
    id: 'js-005',
    concept: 'Async/Await',
    difficulty: 'medium',
    prompt: 'Async/await e syntax sugar sobre Promises que torna o codigo assincrono tao legivel quanto sincrono. Reimplemente getUser com async function, aguardando cada operacao com await e capturando falhas com try/catch.',
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
    prompt: 'Filter, map e sort sao os tres metodos mais usados em processamento funcional de listas. Em uma cadeia de chamadas, filtre apenas os usuarios ativos, extraia o nome de cada um e ordene a lista alfabeticamente.',
    code: `const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
  },
  {
    id: 'js-007',
    concept: 'Closure',
    difficulty: 'hard',
    prompt: 'Closures permitem que funcoes internas acessem e modifiquem variaveis da funcao externa mesmo apos ela ter retornado. Implemente counter como uma fabrica que retorna {increment, decrement, value} — as tres funcoes compartilham a mesma variavel "count" via closure.',
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
    prompt: 'O spread operator ({...obj}) copia todas as propriedades de um objeto para outro. Crie "merged" combinando "defaults" e "overrides": propriedades com o mesmo nome em "overrides" devem ter prioridade, sobrescrevendo as de "defaults".',
    code: `const merged = { ...defaults, ...overrides };`,
  },
  {
    id: 'js-009',
    concept: 'Optional Chaining',
    difficulty: 'easy',
    prompt: 'Ao acessar user.address.city, se "address" for null o JavaScript lanca um TypeError. Use optional chaining (?.) em cada nivel para um acesso seguro e o operador nullish coalescing (??) para retornar "Unknown" quando qualquer parte for null ou undefined.',
    code: `const city = user?.address?.city ?? 'Unknown';`,
  },
  {
    id: 'js-010',
    concept: 'Class',
    difficulty: 'medium',
    prompt: 'Classes em JavaScript encapsulam estado e comportamento no estilo orientado a objetos. Defina Animal com um constructor que inicializa this.name e um metodo speak que retorna uma mensagem usando template literal com o nome do animal.',
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
