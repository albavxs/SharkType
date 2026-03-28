import { Snippet } from '@/lib/types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-001',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interface define a forma que um objeto precisa ter no TypeScript. Crie a interface User com os campos obrigatórios "name" (string) e "age" (number), e "email" como opcional — marcado com ? pra indicar que pode ser omitido.',
      en: 'Interfaces define the expected shape of an object in TypeScript. Create the User interface with required fields "name" (string) and "age" (number), and an optional "email" field — marked with ? to indicate it can be omitted.',
    },
    code: `interface User {
  name: string;
  age: number;
  email?: string;
}`,
    slot: 'obj-interface',
  },
  {
    id: 'ts-002',
    concept: { pt: 'Alias de Tipo', en: 'Type Alias' },
    difficulty: 'easy',
    prompt: {
      pt: 'Type alias cria um nome pra tipos existentes ou pra uma união de tipos literais. Defina Status como um union type que só aceita três valores: "active", "inactive" e "pending" — qualquer outro valor o TypeScript rejeita.',
      en: 'Type aliases create names for existing types or unions of literal types. Define Status as a union type that only accepts three possible values: "active", "inactive", and "pending" — TypeScript will reject anything else.',
    },
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    slot: 'type-union',
  },
  {
    id: 'ts-003',
    concept: { pt: 'Genéricos', en: 'Generics' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções genéricas funcionam com qualquer tipo sem perder a segurança de tipos. Escreva first<T>: ela recebe um array de tipo T e retorna o primeiro elemento — ou undefined se o array estiver vazio.',
      en: 'Generic functions work with any type while preserving type safety. Write first<T>: it takes an array of any type T and returns the first element — or undefined if the array is empty.',
    },
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}`,
    slot: 'type-generic',
  },
  {
    id: 'ts-004',
    concept: { pt: 'Enumeração', en: 'Enum' },
    difficulty: 'easy',
    prompt: {
      pt: 'Enum representa um conjunto fixo de valores nomeados. Defina Direction com quatro direções, dando pra cada uma um valor string explícito (UP, DOWN, LEFT, RIGHT) — facilita na hora de serializar e debugar.',
      en: 'Enums represent a fixed set of named values. Define Direction with four navigation directions, assigning each an explicit string value (UP, DOWN, LEFT, RIGHT) for easier serialization and debugging.',
    },
    code: `enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}`,
  },
  {
    id: 'ts-005',
    concept: { pt: 'Estreitamento de Tipo', en: 'Type Narrowing' },
    difficulty: 'medium',
    prompt: {
      pt: 'Type narrowing refina o tipo de uma variável dentro de um bloco condicional. Implemente printId aceitando string | number e use typeof pra chamar .toUpperCase() em strings e .toFixed(2) em números — o TS entende cada branch.',
      en: 'Type narrowing refines a variable\'s type within a block. Implement printId that accepts string | number and uses typeof to call .toUpperCase() on strings and .toFixed(2) on numbers — TypeScript understands each branch.',
    },
    code: `function printId(id: string | number) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}`,
    slot: 'cond-if-else',
  },
  {
    id: 'ts-006',
    concept: { pt: 'Tipos Utilitários', en: 'Utility Types' },
    difficulty: 'medium',
    prompt: {
      pt: 'O TypeScript tem utility types pra derivar tipos novos sem reescrever definição nenhuma. Use Pick pra selecionar só name e email, Partial pra deixar tudo opcional, e Readonly pra impedir qualquer mutação depois de criado.',
      en: 'TypeScript provides utility types to derive new types without rewriting definitions. Use Pick to select only name and email, Partial to make all fields optional, and Readonly to prevent any mutation after creation.',
    },
    code: `type UserPreview = Pick<User, 'name' | 'email'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;`,
    slot: 'type-utility',
  },
  {
    id: 'ts-007',
    concept: { pt: 'Restrição de Genéricos', en: 'Generic Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Generic constraints restringem quais tipos são aceitos usando "extends". Implemente getProperty com dois type parameters: T (o objeto) e K extends keyof T (uma chave válida de T) — retornando T[K] com type safety total.',
      en: 'Generic constraints restrict which types are accepted using "extends". Implement getProperty with two type parameters: T (the object) and K extends keyof T (a valid key of T) — returning T[K] with full type safety.',
    },
    code: `function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}`,
    slot: 'type-constraint',
  },
  {
    id: 'ts-008',
    concept: { pt: 'Tipo Mapeado', en: 'Mapped Type' },
    difficulty: 'hard',
    prompt: {
      pt: 'Mapped types percorrem as chaves de um tipo pra construir uma variação dele. Crie Optional<T> usando [K in keyof T]? pra tornar cada propriedade opcional — basicamente o equivalente manual do Partial<T> que já vem no TS.',
      en: 'Mapped types iterate over a type\'s keys to build a variation. Create Optional<T> using [K in keyof T]? to make every property optional — the manual equivalent of the built-in Partial<T> utility type.',
    },
    code: `type Optional<T> = {
  [K in keyof T]?: T[K];
};`,
  },
  {
    id: 'ts-009',
    concept: { pt: 'Tipo Interseção', en: 'Intersection Type' },
    difficulty: 'easy',
    prompt: {
      pt: 'Intersection type (&) junta dois tipos num só que exige todos os campos de ambos. Crie Employee como a interseção de Person com um objeto que adiciona "company" e "role" — pra ser válido, tem que ter todos os campos.',
      en: 'Intersection types (&) combine two types into one that requires all fields from both. Create Employee as the intersection of Person with an object that adds "company" and "role" — a valid instance must have all fields.',
    },
    code: `type Employee = Person & {
  company: string;
  role: string;
};`,
  },
  {
    id: 'ts-010',
    concept: { pt: 'Guarda de Tipo', en: 'Type Guard' },
    difficulty: 'medium',
    prompt: {
      pt: 'Type guards são funções que informam o compilador sobre o tipo de um valor em runtime. Implemente isString com retorno "value is string": quando retornar true, o TS automaticamente refina o tipo no bloco seguinte.',
      en: 'Type guards are functions that tell the compiler about a value\'s type at runtime. Implement isString with return type "value is string": when it returns true, TypeScript automatically narrows the type in the following block.',
    },
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
    slot: 'cond-guard',
  },
  // ── If e Else ──────────────────────────────────────────────
  {
    id: 'ts-011',
    concept: { pt: 'If Simples', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'A estrutura if avalia uma condição e executa o bloco se for verdadeira. Verifique se o array está vazio e imprima um aviso.',
      en: 'The if statement evaluates a condition and runs the block if true. Check if the array is empty and print a warning.',
    },
    code: `if (items.length === 0) {
  console.log("No items found");
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'ts-012',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'O operador ternário retorna um valor baseado numa condição. Use-o pra definir a label baseada no tipo de usuário.',
      en: 'The ternary operator returns a value based on a condition. Use it to define the label based on the user type.',
    },
    code: `const label: string = isAdmin ? "Admin" : "User";`,
    slot: 'cond-ternary',
  },
  {
    id: 'ts-013',
    concept: { pt: 'Switch com Tipos', en: 'Switch with Types' },
    difficulty: 'medium',
    prompt: {
      pt: 'Switch combinado com tipos literais permite exhaustive checking. O TypeScript avisa se você esquecer de tratar algum caso de um union type.',
      en: 'Switch combined with literal types enables exhaustive checking. TypeScript warns if you forget to handle a case from a union type.',
    },
    code: `function handle(status: Status): string {
  switch (status) {
    case "active": return "Running";
    case "inactive": return "Stopped";
    case "pending": return "Waiting";
  }
}`,
    slot: 'cond-switch',
  },
  // ── Variáveis ──────────────────────────────────────────────
  {
    id: 'ts-014',
    concept: { pt: 'Declaração com Tipo', en: 'Typed Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: 'No TypeScript, você pode anotar o tipo de uma variável ao declarar. Declare variáveis com let e const indicando seus tipos explicitamente.',
      en: 'In TypeScript, you can annotate the type when declaring a variable. Declare variables with let and const specifying their types explicitly.',
    },
    code: `let count: number = 0;
const name: string = "Alice";`,
    slot: 'var-declare',
  },
  {
    id: 'ts-015',
    concept: { pt: 'Constante Tipada', en: 'Typed Constant' },
    difficulty: 'easy',
    prompt: {
      pt: 'const com anotação de tipo garante que o valor é imutável e tipado. Use "as const" pra inferir o tipo literal mais estreito possível.',
      en: 'const with type annotation ensures the value is immutable and typed. Use "as const" to infer the narrowest possible literal type.',
    },
    code: `const API_URL = "https://api.example.com" as const;
const MAX_RETRIES: number = 3;`,
    slot: 'var-const',
  },
  {
    id: 'ts-016',
    concept: { pt: 'Tipos Básicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'TypeScript adiciona tipagem estática sobre o JavaScript. Declare variáveis com os tipos primitivos: string, number, boolean e array.',
      en: 'TypeScript adds static typing on top of JavaScript. Declare variables with the primitive types: string, number, boolean, and array.',
    },
    code: `const name: string = "Alice";
const age: number = 30;
const scores: number[] = [90, 85, 92];`,
    slot: 'var-types',
  },
  {
    id: 'ts-017',
    concept: { pt: 'Template Literal Tipado', en: 'Typed Template Literal' },
    difficulty: 'easy',
    prompt: {
      pt: 'Template literals funcionam igual ao JS, mas o TypeScript garante que as variáveis interpoladas são do tipo certo.',
      en: 'Template literals work like JS, but TypeScript ensures the interpolated variables are the correct type.',
    },
    code: `const greeting: string = \`Hello, \${name}! Age: \${age}\`;`,
    slot: 'var-interpolation',
  },
  {
    id: 'ts-018',
    concept: { pt: 'Array Tipado', en: 'Typed Array' },
    difficulty: 'easy',
    prompt: {
      pt: 'Arrays em TypeScript são tipados, garantindo que todos os elementos tenham o mesmo tipo. Declare arrays usando a sintaxe tipo[] ou Array<tipo>.',
      en: 'Arrays in TypeScript are typed, ensuring all elements share the same type. Declare arrays using the type[] or Array<type> syntax.',
    },
    code: `const names: string[] = ["Alice", "Bob"];
const ages: Array<number> = [25, 30];`,
    slot: 'var-array',
  },
  {
    id: 'ts-019',
    concept: { pt: 'Desestruturação Tipada', en: 'Typed Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Desestruturação em TypeScript funciona como em JS, mas você pode anotar os tipos das variáveis extraídas.',
      en: 'Destructuring in TypeScript works like JS, but you can annotate the types of the extracted variables.',
    },
    code: `const { name, age }: { name: string; age: number } = user;`,
    slot: 'var-destructure',
  },
  // ── Funções ────────────────────────────────────────────────
  {
    id: 'ts-020',
    concept: { pt: 'Função Tipada', en: 'Typed Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em TypeScript, funções declaram os tipos dos parâmetros e do retorno. Crie uma função add que recebe dois numbers e retorna um number.',
      en: 'In TypeScript, functions declare parameter and return types. Create an add function that takes two numbers and returns a number.',
    },
    code: `function add(a: number, b: number): number {
  return a + b;
}`,
    slot: 'fn-basic',
  },
  {
    id: 'ts-021',
    concept: { pt: 'Arrow Function Tipada', en: 'Typed Arrow Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Arrow functions em TypeScript também recebem anotações de tipo nos parâmetros e no retorno.',
      en: 'Arrow functions in TypeScript also receive type annotations on parameters and return type.',
    },
    code: `const multiply = (a: number, b: number): number => a * b;`,
    slot: 'fn-arrow',
  },
  {
    id: 'ts-022',
    concept: { pt: 'Callback Tipado', en: 'Typed Callback' },
    difficulty: 'medium',
    prompt: {
      pt: 'Tipar callbacks garante que a função passada tem a assinatura esperada. Defina uma função que aceita um callback tipado como parâmetro.',
      en: 'Typing callbacks ensures the passed function has the expected signature. Define a function that accepts a typed callback as a parameter.',
    },
    code: `function fetchData(callback: (data: string) => void) {
  callback("result");
}`,
    slot: 'fn-callback',
  },
  {
    id: 'ts-023',
    concept: { pt: 'Closure Tipada', en: 'Typed Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures em TypeScript mantêm o acesso a variáveis externas com tipagem segura. Crie uma factory de contadores.',
      en: 'Closures in TypeScript maintain access to outer variables with type safety. Create a counter factory.',
    },
    code: `function makeCounter(): () => number {
  let count: number = 0;
  return () => ++count;
}`,
    slot: 'fn-closure',
  },
  {
    id: 'ts-024',
    concept: { pt: 'Parâmetro Padrão Tipado', en: 'Typed Default Parameter' },
    difficulty: 'easy',
    prompt: {
      pt: 'Parâmetros com valor padrão no TypeScript já inferem o tipo, mas você pode ser explícito pra maior clareza.',
      en: 'Default parameters in TypeScript already infer the type, but you can be explicit for clarity.',
    },
    code: `function greet(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}`,
    slot: 'fn-default-params',
  },
  // ── Loops ──────────────────────────────────────────────────
  {
    id: 'ts-025',
    concept: { pt: 'For Clássico', en: 'Classic For Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for clássico funciona igual ao JS, mas variáveis de controle podem ser tipadas. Itere sobre um array de números.',
      en: 'The classic for loop works like JS, but control variables can be typed. Iterate over a number array.',
    },
    code: `for (let i: number = 0; i < items.length; i++) {
  console.log(items[i]);
}`,
    slot: 'loop-for',
  },
  {
    id: 'ts-026',
    concept: { pt: 'While', en: 'While Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O while executa enquanto a condição é verdadeira. Use-o pra processar uma fila de tarefas até que fique vazia.',
      en: 'The while loop runs as long as the condition is true. Use it to process a task queue until it is empty.',
    },
    code: `const queue: string[] = ["a", "b", "c"];
while (queue.length > 0) {
  const item = queue.shift()!;
  console.log(item);
}`,
    slot: 'loop-while',
  },
  {
    id: 'ts-027',
    concept: { pt: 'ForEach Tipado', en: 'Typed ForEach' },
    difficulty: 'easy',
    prompt: {
      pt: 'forEach em arrays tipados infere automaticamente o tipo do elemento no callback. Itere sobre um array de strings.',
      en: 'forEach on typed arrays automatically infers the element type in the callback. Iterate over a string array.',
    },
    code: `const names: string[] = ["Alice", "Bob"];
names.forEach((name: string) => console.log(name));`,
    slot: 'loop-foreach',
  },
  {
    id: 'ts-028',
    concept: { pt: 'Filter Tipado', en: 'Typed Filter' },
    difficulty: 'medium',
    prompt: {
      pt: 'filter em TypeScript preserva o tipo do array. Filtre uma lista tipada de usuários pra manter só os ativos.',
      en: 'filter in TypeScript preserves the array type. Filter a typed user list to keep only the active ones.',
    },
    code: `const active = users.filter(
  (u: { name: string; active: boolean }) => u.active
);`,
    slot: 'loop-filter',
  },
  {
    id: 'ts-029',
    concept: { pt: 'Iteração com Range', en: 'Range Iteration' },
    difficulty: 'easy',
    prompt: {
      pt: 'Assim como em JS, TypeScript não tem range nativo. Use Array.from com tipagem pra criar uma sequência numérica.',
      en: 'Like JS, TypeScript has no native range. Use Array.from with typing to create a numeric sequence.',
    },
    code: `const range: number[] = Array.from({ length: 5 }, (_, i) => i);`,
    slot: 'loop-range',
  },
  // ── Objetos ────────────────────────────────────────────────
  {
    id: 'ts-030',
    concept: { pt: 'Criação de Objeto', en: 'Object Creation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Crie um objeto que satisfaz uma interface. O TypeScript valida que todas as propriedades obrigatórias estão presentes.',
      en: 'Create an object that satisfies an interface. TypeScript validates that all required properties are present.',
    },
    code: `const user: User = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
};`,
    slot: 'obj-create',
  },
  {
    id: 'ts-031',
    concept: { pt: 'Métodos de Objeto', en: 'Object Methods' },
    difficulty: 'medium',
    prompt: {
      pt: 'Objetos com métodos podem ser tipados via interface. Defina uma interface com métodos e crie um objeto que a implemente.',
      en: 'Objects with methods can be typed via interface. Define an interface with methods and create an object that implements it.',
    },
    code: `interface Calculator {
  add(a: number, b: number): number;
}
const calc: Calculator = {
  add: (a, b) => a + b,
};`,
    slot: 'obj-methods',
  },
  {
    id: 'ts-032',
    concept: { pt: 'Objeto Aninhado', en: 'Nested Object' },
    difficulty: 'medium',
    prompt: {
      pt: 'Tipos aninhados descrevem objetos dentro de objetos. Use optional chaining pra acessar propriedades profundas com segurança.',
      en: 'Nested types describe objects within objects. Use optional chaining to safely access deep properties.',
    },
    code: `interface Address {
  city: string;
  zip: string;
}
interface Person {
  name: string;
  address?: Address;
}`,
    slot: 'obj-nested',
  },
  // ── Classes ────────────────────────────────────────────────
  {
    id: 'ts-033',
    concept: { pt: 'Classe Tipada', en: 'Typed Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes em TypeScript declaram tipos nas propriedades e nos métodos. Crie uma classe Animal com propriedades tipadas e um método.',
      en: 'TypeScript classes declare types on properties and methods. Create an Animal class with typed properties and a method.',
    },
    code: `class Animal {
  constructor(public name: string) {}
  speak(): string {
    return \`\${this.name} makes a noise.\`;
  }
}`,
    slot: 'class-basic',
  },
  {
    id: 'ts-034',
    concept: { pt: 'Herança de Classe', en: 'Class Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'extends permite herdar de outra classe, e super() chama o construtor pai. TypeScript garante a tipagem em toda a cadeia.',
      en: 'extends inherits from another class, and super() calls the parent constructor. TypeScript ensures typing across the chain.',
    },
    code: `class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);
  }
}`,
    slot: 'class-inherit',
  },
  {
    id: 'ts-035',
    concept: { pt: 'Sobrescrita de Método', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma classe filha pode sobrescrever métodos da classe pai. O TypeScript verifica que a assinatura é compatível.',
      en: 'A child class can override parent methods. TypeScript checks that the signature is compatible.',
    },
    code: `class Cat extends Animal {
  override speak(): string {
    return \`\${this.name} meows.\`;
  }
}`,
    slot: 'class-override',
  },
  {
    id: 'ts-036',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'hard',
    prompt: {
      pt: 'Classes abstratas não podem ser instanciadas diretamente — servem como base que define métodos que as subclasses devem implementar.',
      en: 'Abstract classes cannot be instantiated directly — they serve as a base that defines methods subclasses must implement.',
    },
    code: `abstract class Shape {
  abstract area(): number;
  describe(): string {
    return \`Area: \${this.area()}\`;
  }
}`,
    slot: 'class-abstract',
  },
  // ── Erros ──────────────────────────────────────────────────
  {
    id: 'ts-037',
    concept: { pt: 'Try/Catch Tipado', en: 'Typed Try/Catch' },
    difficulty: 'medium',
    prompt: {
      pt: 'try/catch no TypeScript captura erros como unknown por padrão. Use narrowing pra acessar a mensagem com segurança.',
      en: 'try/catch in TypeScript catches errors as unknown by default. Use narrowing to safely access the message.',
    },
    code: `try {
  const data = JSON.parse(input);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'ts-038',
    concept: { pt: 'Erro Customizado', en: 'Custom Error' },
    difficulty: 'medium',
    prompt: {
      pt: 'Estenda Error com tipagem forte pra criar erros de domínio. Adicione propriedades tipadas pra informações extras.',
      en: 'Extend Error with strong typing to create domain errors. Add typed properties for extra information.',
    },
    code: `class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}`,
    slot: 'err-custom',
  },
  {
    id: 'ts-039',
    concept: { pt: 'Tipo Result', en: 'Result Type' },
    difficulty: 'hard',
    prompt: {
      pt: 'O padrão Result usa union types pra representar sucesso ou falha sem exceções. Defina um tipo discriminado com ok e err.',
      en: 'The Result pattern uses union types to represent success or failure without exceptions. Define a discriminated type with ok and err.',
    },
    code: `type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };`,
    slot: 'err-result',
  },
  {
    id: 'ts-040',
    concept: { pt: 'Finally', en: 'Finally Block' },
    difficulty: 'medium',
    prompt: {
      pt: 'O bloco finally sempre executa independente de erro. Use pra garantir a liberação de recursos.',
      en: 'The finally block always runs regardless of errors. Use it to ensure resource cleanup.',
    },
    code: `try {
  const conn = await db.connect();
  await conn.query(sql);
} catch (err: unknown) {
  console.error(err);
} finally {
  await db.disconnect();
}`,
    slot: 'err-finally',
  },
  // ── Avançado ───────────────────────────────────────────────
  {
    id: 'ts-041',
    concept: { pt: 'Async/Await Tipado', en: 'Typed Async/Await' },
    difficulty: 'hard',
    prompt: {
      pt: 'Funções async em TypeScript retornam Promise<T>. Anote o tipo de retorno pra deixar claro o que a promessa resolve.',
      en: 'Async functions in TypeScript return Promise<T>. Annotate the return type to clarify what the promise resolves to.',
    },
    code: `async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json() as Promise<User>;
}`,
    slot: 'adv-async',
  },
  {
    id: 'ts-042',
    concept: { pt: 'Discriminated Union', en: 'Discriminated Union' },
    difficulty: 'hard',
    prompt: {
      pt: 'Discriminated unions usam um campo literal comum pra diferenciar variantes. O TypeScript refina o tipo automaticamente no switch.',
      en: 'Discriminated unions use a common literal field to differentiate variants. TypeScript narrows the type automatically in switch.',
    },
    code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
  }
}`,
    slot: 'adv-pattern',
  },
  {
    id: 'ts-043',
    concept: { pt: 'Concorrência Tipada', en: 'Typed Concurrency' },
    difficulty: 'hard',
    prompt: {
      pt: 'Promise.all em TypeScript infere uma tupla de tipos. Desestruture o resultado com tipagem forte pra cada promessa.',
      en: 'Promise.all in TypeScript infers a tuple of types. Destructure the result with strong typing for each promise.',
    },
    code: `const [users, posts]: [User[], Post[]] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);`,
    slot: 'adv-concurrent',
  },
]
