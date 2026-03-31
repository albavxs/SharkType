import { Snippet } from '@/lib/types'

export const javascriptSnippets: Snippet[] = [
  {
    id: 'js-001',
    concept: { pt: 'Função Seta', en: 'Arrow Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'No JS moderno, a arrow function é o jeito mais enxuto de escrever funções. Ao invés de usar function add(a, b) { return a + b }, reescreva add com a sintaxe de seta (=>) numa linha só — sem chaves e sem return.',
      en: 'Arrow functions are the concise way to define functions in modern JS. Instead of writing function add(a, b) { return a + b }, define add using the arrow syntax (=>) in a single line — no braces or explicit return needed.',
    },
    code: `const add = (a, b) => a + b;`,
    slot: 'fn-arrow',
  },
  {
    id: 'js-002',
    concept: { pt: 'Desestruturação de Array', en: 'Array Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Com array destructuring, você extrai elementos pela posição sem ficar acessando índice na mão. Dado [1, 2, 3, 4], pegue o primeiro elemento em "first" e junte o restante em "rest" usando o rest operator (...).',
      en: 'Array destructuring extracts elements by position without manual indexing. From [1, 2, 3, 4], capture the first element into "first" and gather all remaining ones into "rest" using the rest operator (...).',
    },
    code: `const [first, ...rest] = [1, 2, 3, 4];`,
    slot: 'var-destructure',
  },
  {
    id: 'js-003',
    concept: { pt: 'Desestruturação de Objeto', en: 'Object Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Object destructuring deixa você extrair propriedades pelo nome numa tacada só. Do objeto "user", tire "name" e "age" — e coloque 0 como valor padrão pra "age" caso a propriedade não exista.',
      en: 'Object destructuring extracts properties by name in a single assignment. From the "user" object, extract "name" and "age" — and set 0 as the default value for "age" in case the property doesn\'t exist on the object.',
    },
    code: `const { name, age = 0 } = user;`,
  },
  {
    id: 'js-004',
    concept: { pt: 'Promessa', en: 'Promise' },
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
    slot: 'adv-async',
  },
  {
    id: 'js-006',
    concept: { pt: 'Métodos de Array', en: 'Array Methods' },
    difficulty: 'medium',
    prompt: {
      pt: 'Filter, map e sort são os três métodos mais usados pra processar listas de forma funcional. Numa cadeia só, filtre os usuários ativos, extraia o nome de cada um e ordene a lista em ordem alfabética.',
      en: 'Filter, map, and sort are the three most common methods for functional list processing. In a single chain, filter only active users, extract each name, and sort the list alphabetically.',
    },
    code: `const result = users
  .filter(u => u.active)
  .map(u => u.name)
  .sort();`,
    slot: 'loop-filter',
  },
  {
    id: 'js-007',
    concept: { pt: 'Clausura', en: 'Closure' },
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
    slot: 'fn-closure',
  },
  {
    id: 'js-008',
    concept: { pt: 'Operador de Espalhamento', en: 'Spread Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'O spread operator ({...obj}) copia todas as propriedades de um objeto pra outro. Crie "merged" juntando "defaults" e "overrides": as propriedades de "overrides" têm prioridade e sobrescrevem as de "defaults".',
      en: 'The spread operator ({...obj}) copies all properties from one object to another. Create "merged" by combining "defaults" and "overrides": properties with the same name in "overrides" should take priority, overwriting those from "defaults".',
    },
    code: `const merged = { ...defaults, ...overrides };`,
    slot: 'obj-create',
  },
  {
    id: 'js-009',
    concept: { pt: 'Encadeamento Opcional', en: 'Optional Chaining' },
    difficulty: 'easy',
    prompt: {
      pt: 'Se você acessar user.address.city e "address" for null, o JS estoura um TypeError. Use optional chaining (?.) em cada nível pra acessar de forma segura e o nullish coalescing (??) pra retornar "Unknown" quando qualquer parte for null ou undefined.',
      en: 'When accessing user.address.city, if "address" is null JavaScript throws a TypeError. Use optional chaining (?.) at each level for safe access and the nullish coalescing operator (??) to return "Unknown" when any part is null or undefined.',
    },
    code: `const city = user?.address?.city ?? 'Unknown';`,
    slot: 'obj-nested',
  },
  {
    id: 'js-010',
    concept: { pt: 'Classe', en: 'Class' },
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
    slot: 'class-basic',
  },
  // ── If e Else ──────────────────────────────────────────────
  {
    id: 'js-011',
    concept: { pt: 'If Simples', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'A estrutura if avalia uma condição e executa o bloco se for verdadeira. Verifique se age é maior ou igual a 18 e imprima a mensagem.',
      en: 'The if statement evaluates a condition and executes the block if true. Check if age is 18 or older and print the message.',
    },
    code: `if (age >= 18) {
  console.log("You are an adult");
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'js-012',
    concept: { pt: 'If e Else', en: 'If and Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'O else define o que acontece quando a condição do if é falsa. Verifique se o número é par ou ímpar e atribua o resultado a uma constante.',
      en: 'The else block runs when the if condition is false. Check whether a number is even or odd and assign the result to a constant.',
    },
    code: `const parity = n % 2 === 0 ? "even" : "odd";`,
    slot: 'cond-if-else',
  },
  {
    id: 'js-013',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'O operador ternário é um if/else inline que retorna um valor. Use-o pra definir o status do usuário baseado na propriedade active.',
      en: 'The ternary operator is an inline if/else that returns a value. Use it to define the user status based on the active property.',
    },
    code: `const status = user.active ? "online" : "offline";`,
    slot: 'cond-ternary',
  },
  {
    id: 'js-014',
    concept: { pt: 'Switch', en: 'Switch Statement' },
    difficulty: 'easy',
    prompt: {
      pt: 'Switch compara um valor contra vários casos e executa o bloco correspondente. Implemente uma função que retorna o nome do dia da semana a partir de um número.',
      en: 'Switch compares a value against multiple cases and runs the matching block. Implement a function that returns the weekday name from a number.',
    },
    code: `switch (day) {
  case 0: return "Sunday";
  case 1: return "Monday";
  default: return "Other";
}`,
    slot: 'cond-switch',
  },
  {
    id: 'js-015',
    concept: { pt: 'Cláusula de Guarda', en: 'Guard Clause' },
    difficulty: 'easy',
    prompt: {
      pt: 'Guard clauses retornam cedo pra evitar aninhamento excessivo. Valide a entrada no início da função e retorne antes de executar a lógica principal.',
      en: 'Guard clauses return early to avoid deep nesting. Validate the input at the top of the function and return before running the main logic.',
    },
    code: `function divide(a, b) {
  if (b === 0) return null;
  return a / b;
}`,
    slot: 'cond-guard',
  },
  // ── Variáveis ──────────────────────────────────────────────
  {
    id: 'js-016',
    concept: { pt: 'Declaração de Variável', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: 'let declara uma variável que pode ser reatribuída. Declare a variável count com let e atribua o valor inicial 0.',
      en: 'let declares a variable that can be reassigned. Declare the variable count with let and assign the initial value 0.',
    },
    code: `let count = 0;
count = count + 1;`,
    slot: 'var-declare',
  },
  {
    id: 'js-017',
    concept: { pt: 'Constante', en: 'Constant' },
    difficulty: 'easy',
    prompt: {
      pt: 'const declara uma variável que não pode ser reatribuída. Use const pra definir valores que não mudam, como configurações ou constantes matemáticas.',
      en: 'const declares a variable that cannot be reassigned. Use const to define values that do not change, like configuration or math constants.',
    },
    code: `const PI = 3.14159;
const MAX_RETRIES = 3;`,
    slot: 'var-const',
  },
  {
    id: 'js-018',
    concept: { pt: 'Tipos Primitivos', en: 'Primitive Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'JavaScript tem tipos primitivos: string, number, boolean, null e undefined. Declare variáveis de cada tipo pra entender a diferença entre eles.',
      en: 'JavaScript has primitive types: string, number, boolean, null and undefined. Declare variables of each type to understand the differences.',
    },
    code: `const name = "Alice";
const age = 30;
const active = true;`,
    slot: 'var-types',
  },
  {
    id: 'js-019',
    concept: { pt: 'Template Literal', en: 'Template Literal' },
    difficulty: 'easy',
    prompt: {
      pt: 'Template literals permitem interpolar variáveis dentro de strings usando crases e ${}. Monte uma mensagem de saudação com o nome e a idade.',
      en: 'Template literals let you interpolate variables inside strings using backticks and ${}. Build a greeting message with the name and age.',
    },
    code: `const msg = \`Hello, \${name}! You are \${age} years old.\`;`,
    slot: 'var-interpolation',
  },
  {
    id: 'js-020',
    concept: { pt: 'Array', en: 'Array' },
    difficulty: 'easy',
    prompt: {
      pt: 'Arrays armazenam listas ordenadas de valores. Crie um array de cores e acesse o primeiro elemento com índice 0.',
      en: 'Arrays store ordered lists of values. Create an array of colors and access the first element with index 0.',
    },
    code: `const colors = ["red", "green", "blue"];
const first = colors[0];`,
    slot: 'var-array',
  },
  // ── Funções ────────────────────────────────────────────────
  {
    id: 'js-021',
    concept: { pt: 'Função Básica', en: 'Basic Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Funções encapsulam lógica reutilizável. Declare uma função greet que recebe um nome e retorna uma saudação.',
      en: 'Functions encapsulate reusable logic. Declare a greet function that takes a name and returns a greeting.',
    },
    code: `function greet(name) {
  return "Hello, " + name + "!";
}`,
    slot: 'fn-basic',
  },
  {
    id: 'js-022',
    concept: { pt: 'Callback', en: 'Callback' },
    difficulty: 'medium',
    prompt: {
      pt: 'Callbacks são funções passadas como argumento pra serem chamadas depois. Use setTimeout com uma arrow function pra executar uma ação após 1 segundo.',
      en: 'Callbacks are functions passed as arguments to be called later. Use setTimeout with an arrow function to execute an action after 1 second.',
    },
    code: `setTimeout(() => {
  console.log("Done!");
}, 1000);`,
    slot: 'fn-callback',
  },
  {
    id: 'js-023',
    concept: { pt: 'Parâmetro Padrão', en: 'Default Parameter' },
    difficulty: 'easy',
    prompt: {
      pt: 'Parâmetros padrão definem valores caso o argumento não seja passado. Crie uma função greet com um parâmetro greeting que tem valor padrão "Hello".',
      en: 'Default parameters define fallback values when no argument is passed. Create a greet function with a greeting parameter that defaults to "Hello".',
    },
    code: `function greet(name, greeting = "Hello") {
  return \`\${greeting}, \${name}!\`;
}`,
    slot: 'fn-default-params',
  },
  // ── Loops ──────────────────────────────────────────────────
  {
    id: 'js-024',
    concept: { pt: 'For Clássico', en: 'Classic For Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for clássico usa inicialização, condição e incremento pra iterar. Imprima os números de 0 a 4 com um loop for.',
      en: 'The classic for loop uses initialization, condition, and increment to iterate. Print numbers from 0 to 4 with a for loop.',
    },
    code: `for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
    slot: 'loop-for',
  },
  {
    id: 'js-025',
    concept: { pt: 'While', en: 'While Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O while executa o bloco enquanto a condição for verdadeira. Conte de 1 até que o valor ultrapasse 100, dobrando a cada iteração.',
      en: 'The while loop runs the block as long as the condition is true. Count from 1 until the value exceeds 100, doubling each iteration.',
    },
    code: `let n = 1;
while (n <= 100) {
  n *= 2;
}`,
    slot: 'loop-while',
  },
  {
    id: 'js-026',
    concept: { pt: 'ForEach', en: 'ForEach' },
    difficulty: 'easy',
    prompt: {
      pt: 'forEach executa uma função pra cada elemento do array sem retornar um novo array. Imprima cada fruta da lista.',
      en: 'forEach runs a function for each array element without returning a new array. Print each fruit from the list.',
    },
    code: `const fruits = ["apple", "banana", "cherry"];
fruits.forEach(fruit => console.log(fruit));`,
    slot: 'loop-foreach',
  },
  {
    id: 'js-027',
    concept: { pt: 'Iteração com Intervalo', en: 'Range Iteration' },
    difficulty: 'easy',
    prompt: {
      pt: 'JavaScript não tem range nativo, mas Array.from cria uma sequência numérica. Gere um array de 0 a 9 usando Array.from com um callback de mapeamento.',
      en: 'JavaScript has no native range, but Array.from creates numeric sequences. Generate an array from 0 to 9 using Array.from with a mapping callback.',
    },
    code: `const range = Array.from({ length: 10 }, (_, i) => i);`,
    slot: 'loop-range',
  },
  // ── Objetos ────────────────────────────────────────────────
  {
    id: 'js-028',
    concept: { pt: 'Métodos de Objeto', en: 'Object Methods' },
    difficulty: 'medium',
    prompt: {
      pt: 'Objetos podem ter métodos — funções definidas como propriedades. Crie um objeto calculator com um método add que soma dois números.',
      en: 'Objects can have methods — functions defined as properties. Create a calculator object with an add method that sums two numbers.',
    },
    code: `const calculator = {
  add(a, b) {
    return a + b;
  },
};`,
    slot: 'obj-methods',
  },
  // ── Classes ────────────────────────────────────────────────
  {
    id: 'js-029',
    concept: { pt: 'Herança de Classe', en: 'Class Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'extends permite que uma classe herde propriedades e métodos de outra. Crie Dog estendendo Animal e chame super() no constructor.',
      en: 'extends lets a class inherit properties and methods from another. Create Dog extending Animal and call super() in the constructor.',
    },
    code: `class Dog extends Animal {
  constructor(name) {
    super(name);
  }
  speak() {
    return \`\${this.name} barks.\`;
  }
}`,
    slot: 'class-inherit',
  },
  {
    id: 'js-030',
    concept: { pt: 'Sobrescrita de Método', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma classe filha pode sobrescrever métodos da classe pai pra alterar o comportamento. Sobrescreva toString() na classe Product pra retornar uma representação personalizada.',
      en: 'A child class can override parent methods to change behavior. Override toString() in the Product class to return a custom representation.',
    },
    code: `class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }
  toString() {
    return \`\${this.name}: $\${this.price}\`;
  }
}`,
    slot: 'class-override',
  },
  {
    id: 'js-031',
    concept: { pt: 'Classe Abstrata (simulada)', en: 'Abstract Class (simulated)' },
    difficulty: 'hard',
    prompt: {
      pt: 'JavaScript não tem classes abstratas nativas, mas podemos simular lançando erro em métodos que devem ser implementados pelas subclasses.',
      en: 'JavaScript has no native abstract classes, but we can simulate them by throwing errors in methods that subclasses must implement.',
    },
    code: `class Shape {
  area() {
    throw new Error("Not implemented");
  }
}`,
    slot: 'class-abstract',
  },
  // ── Erros ──────────────────────────────────────────────────
  {
    id: 'js-032',
    concept: { pt: 'Try/Catch', en: 'Try/Catch' },
    difficulty: 'medium',
    prompt: {
      pt: 'try/catch captura erros em tempo de execução sem quebrar o programa. Tente parsear um JSON e capture o erro caso a string seja inválida.',
      en: 'try/catch catches runtime errors without crashing the program. Try to parse JSON and catch the error if the string is invalid.',
    },
    code: `try {
  const data = JSON.parse(input);
} catch (err) {
  console.error("Invalid JSON:", err.message);
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'js-033',
    concept: { pt: 'Erro Customizado', en: 'Custom Error' },
    difficulty: 'medium',
    prompt: {
      pt: 'Você pode estender Error pra criar tipos de erro personalizados com nomes e mensagens específicas. Crie ValidationError com um campo extra.',
      en: 'You can extend Error to create custom error types with specific names and messages. Create ValidationError with an extra field.',
    },
    code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = "ValidationError";
  }
}`,
    slot: 'err-custom',
  },
  {
    id: 'js-034',
    concept: { pt: 'Finally', en: 'Finally Block' },
    difficulty: 'medium',
    prompt: {
      pt: 'O bloco finally sempre executa, tenha dado erro ou não. Use-o pra limpar recursos como conexões ou timers.',
      en: 'The finally block always runs, whether an error occurred or not. Use it to clean up resources like connections or timers.',
    },
    code: `try {
  db.connect();
  db.query(sql);
} catch (err) {
  console.error(err);
} finally {
  db.disconnect();
}`,
    slot: 'err-finally',
  },
  // ── Avançado ───────────────────────────────────────────────
  {
    id: 'js-035',
    concept: { pt: 'Pattern Matching (objeto)', en: 'Pattern Matching (object)' },
    difficulty: 'hard',
    prompt: {
      pt: 'JavaScript não tem pattern matching nativo, mas objetos como lookup tables são o padrão idiomático. Use um objeto pra mapear ações a handlers.',
      en: 'JavaScript has no native pattern matching, but objects as lookup tables are the idiomatic pattern. Use an object to map actions to handlers.',
    },
    code: `const handlers = {
  click: () => console.log("clicked"),
  hover: () => console.log("hovered"),
};
const action = "click";
handlers[action]?.();`,
    slot: 'adv-pattern',
  },
  {
    id: 'js-036',
    concept: { pt: 'Concorrência com Promise.all', en: 'Concurrency with Promise.all' },
    difficulty: 'hard',
    prompt: {
      pt: 'Promise.all executa várias promessas em paralelo e espera todas terminarem. Use pra buscar dados de múltiplas APIs simultaneamente.',
      en: 'Promise.all runs multiple promises in parallel and waits for all to finish. Use it to fetch data from multiple APIs simultaneously.',
    },
    code: `const [users, posts] = await Promise.all([
  fetch("/api/users").then(r => r.json()),
  fetch("/api/posts").then(r => r.json()),
]);`,
    slot: 'adv-concurrent',
  },
  // ── DOM & Web APIs ────────────────────────────────────────
  {
    id: 'js-037',
    concept: { pt: 'querySelector e querySelectorAll', en: 'querySelector and querySelectorAll' },
    difficulty: 'easy',
    prompt: {
      pt: 'querySelector retorna o primeiro elemento que bate com o seletor CSS, e querySelectorAll retorna todos. Selecione um botão pelo id e todos os itens de uma lista.',
      en: 'querySelector returns the first element matching a CSS selector, and querySelectorAll returns all of them. Select a button by id and all items in a list.',
    },
    code: `const btn = document.querySelector('#submit-btn');
const items = document.querySelectorAll('.list-item');

items.forEach(item => {
  console.log(item.textContent);
});`,
  },
  {
    id: 'js-038',
    concept: { pt: 'addEventListener', en: 'addEventListener' },
    difficulty: 'easy',
    prompt: {
      pt: 'addEventListener registra um callback que executa quando um evento ocorre no elemento. Adicione listeners de click e keydown num formulário.',
      en: 'addEventListener registers a callback that runs when an event occurs on the element. Add click and keydown listeners to a form.',
    },
    code: `const form = document.querySelector('#my-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  console.log(Object.fromEntries(data));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') form.reset();
});`,
  },
  {
    id: 'js-039',
    concept: { pt: 'Delegação de Eventos', en: 'Event Delegation' },
    difficulty: 'medium',
    prompt: {
      pt: 'Delegação de eventos usa um único listener no pai pra capturar eventos dos filhos via bubbling. Adicione um listener na lista que detecta cliques nos botões de delete.',
      en: 'Event delegation uses a single listener on the parent to capture child events via bubbling. Add a listener on the list that detects clicks on delete buttons.',
    },
    code: `const list = document.querySelector('#todo-list');

list.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;

  const item = btn.closest('.todo-item');
  item.remove();
});`,
  },
  {
    id: 'js-040',
    concept: { pt: 'createElement e appendChild', en: 'createElement and appendChild' },
    difficulty: 'medium',
    prompt: {
      pt: 'createElement cria um novo elemento DOM e appendChild o insere como filho. Crie uma função que adiciona um item de tarefa à lista dinamicamente.',
      en: 'createElement creates a new DOM element and appendChild inserts it as a child. Create a function that dynamically adds a task item to the list.',
    },
    code: `function addTodo(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = \`
    <span>\${text}</span>
    <button class="delete-btn">x</button>
  \`;
  document.querySelector('#todo-list').appendChild(li);
}`,
  },
  {
    id: 'js-041',
    concept: { pt: 'classList', en: 'classList' },
    difficulty: 'easy',
    prompt: {
      pt: 'classList oferece métodos como add, remove e toggle pra manipular classes CSS de um elemento sem sobrescrever as existentes.',
      en: 'classList provides methods like add, remove, and toggle to manipulate CSS classes on an element without overwriting existing ones.',
    },
    code: `const menu = document.querySelector('.sidebar');

document.querySelector('#menu-toggle').addEventListener('click', () => {
  menu.classList.toggle('open');
});

menu.classList.add('animated');
menu.classList.remove('hidden');
console.log(menu.classList.contains('open'));`,
  },
  {
    id: 'js-042',
    concept: { pt: 'Dataset (data attributes)', en: 'Dataset (data attributes)' },
    difficulty: 'easy',
    prompt: {
      pt: 'O objeto dataset acessa atributos data-* do HTML como propriedades JavaScript em camelCase. Use dataset pra ler e escrever metadados nos elementos.',
      en: 'The dataset object accesses HTML data-* attributes as camelCase JavaScript properties. Use dataset to read and write metadata on elements.',
    },
    code: `const card = document.querySelector('.product-card');

const productId = card.dataset.productId;
const category = card.dataset.category;

card.dataset.selected = 'true';
card.dataset.lastViewed = Date.now();

console.log(productId, category);`,
  },
  {
    id: 'js-043',
    concept: { pt: 'Fetch com async/await completo', en: 'Full Fetch with async/await' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma chamada fetch completa verifica o status, trata erros de rede e parseia o body. Implemente uma função POST com headers, body JSON e tratamento de erro robusto.',
      en: 'A complete fetch call checks the status, handles network errors, and parses the body. Implement a POST function with headers, JSON body, and robust error handling.',
    },
    code: `async function postData(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('Request failed:', err.message);
    throw err;
  }
}`,
  },
  {
    id: 'js-044',
    concept: { pt: 'FormData API', en: 'FormData API' },
    difficulty: 'medium',
    prompt: {
      pt: 'FormData captura todos os campos de um formulário automaticamente, incluindo arquivos. Use FormData pra enviar um formulário com upload de arquivo via fetch.',
      en: 'FormData automatically captures all form fields including files. Use FormData to submit a form with file upload via fetch.',
    },
    code: `const form = document.querySelector('#upload-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append('timestamp', Date.now());

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const result = await res.json();
  console.log(result);
});`,
  },
  {
    id: 'js-045',
    concept: { pt: 'IntersectionObserver', en: 'IntersectionObserver' },
    difficulty: 'hard',
    prompt: {
      pt: 'IntersectionObserver detecta quando um elemento entra ou sai do viewport, perfeito pra lazy loading e animações no scroll. Observe imagens pra carregar sob demanda.',
      en: 'IntersectionObserver detects when an element enters or leaves the viewport, perfect for lazy loading and scroll animations. Observe images to load on demand.',
    },
    code: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;
    img.classList.add('loaded');
    observer.unobserve(img);
  });
}, { threshold: 0.1 });

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});`,
  },
  {
    id: 'js-046',
    concept: { pt: 'LocalStorage e SessionStorage', en: 'LocalStorage and SessionStorage' },
    difficulty: 'easy',
    prompt: {
      pt: 'localStorage persiste dados entre sessões e sessionStorage apenas durante a aba. Use localStorage pra salvar e recuperar preferências do usuário como JSON.',
      en: 'localStorage persists data across sessions and sessionStorage only during the tab. Use localStorage to save and retrieve user preferences as JSON.',
    },
    code: `const PREFS_KEY = 'user-preferences';

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function loadPrefs() {
  const raw = localStorage.getItem(PREFS_KEY);
  return raw ? JSON.parse(raw) : { theme: 'dark', lang: 'pt' };
}

const prefs = loadPrefs();
prefs.theme = 'light';
savePrefs(prefs);`,
  },
]
