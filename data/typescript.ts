import { Snippet } from '@/lib/types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-001',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interfaces definem o formato esperado de um objeto em TypeScript. Crie a interface User com os campos obrigatórios "name" (string) e "age" (number), e o campo opcional "email" — marcado com ? para indicar que pode ser omitido.',
      en: 'Interfaces define the expected shape of an object in TypeScript. Create the User interface with required fields "name" (string) and "age" (number), and an optional "email" field — marked with ? to indicate it can be omitted.',
    },
    code: `interface User {
  name: string;
  age: number;
  email?: string;
}`,
  },
  {
    id: 'ts-002',
    concept: { pt: 'Type Alias', en: 'Type Alias' },
    difficulty: 'easy',
    prompt: {
      pt: 'Type aliases criam nomes para tipos existentes ou para união de tipos literais. Defina Status como um union type que aceita apenas três valores possíveis: "active", "inactive" e "pending" — o TypeScript rejeitará qualquer outro valor.',
      en: 'Type aliases create names for existing types or unions of literal types. Define Status as a union type that only accepts three possible values: "active", "inactive", and "pending" — TypeScript will reject anything else.',
    },
    code: `type Status = 'active' | 'inactive' | 'pending';`,
  },
  {
    id: 'ts-003',
    concept: { pt: 'Generics', en: 'Generics' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções genéricas funcionam com qualquer tipo enquanto mantêm segurança de tipos. Escreva first<T>: ela recebe um array de qualquer tipo T e retorna o primeiro elemento — ou undefined se o array estiver vazio.',
      en: 'Generic functions work with any type while preserving type safety. Write first<T>: it takes an array of any type T and returns the first element — or undefined if the array is empty.',
    },
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}`,
  },
  {
    id: 'ts-004',
    concept: { pt: 'Enum', en: 'Enum' },
    difficulty: 'easy',
    prompt: {
      pt: 'Enums representam um conjunto fixo de valores nomeados. Defina Direction com quatro direções de navegação, atribuindo a cada uma um valor string explícito (UP, DOWN, LEFT, RIGHT) para serializar e depurar com mais facilidade.',
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
    concept: { pt: 'Type Narrowing', en: 'Type Narrowing' },
    difficulty: 'medium',
    prompt: {
      pt: 'Type narrowing refina o tipo de uma variável dentro de um bloco. Implemente printId que aceita string | number e usa typeof para executar .toUpperCase() em strings e .toFixed(2) em números — o TypeScript entende cada ramo.',
      en: 'Type narrowing refines a variable\'s type within a block. Implement printId that accepts string | number and uses typeof to call .toUpperCase() on strings and .toFixed(2) on numbers — TypeScript understands each branch.',
    },
    code: `function printId(id: string | number) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}`,
  },
  {
    id: 'ts-006',
    concept: { pt: 'Utility Types', en: 'Utility Types' },
    difficulty: 'medium',
    prompt: {
      pt: 'TypeScript oferece utility types para derivar novos tipos sem reescrever definições. Use Pick para selecionar apenas name e email, Partial para tornar todos os campos opcionais, e Readonly para proibir qualquer mutação pós-criação.',
      en: 'TypeScript provides utility types to derive new types without rewriting definitions. Use Pick to select only name and email, Partial to make all fields optional, and Readonly to prevent any mutation after creation.',
    },
    code: `type UserPreview = Pick<User, 'name' | 'email'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;`,
  },
  {
    id: 'ts-007',
    concept: { pt: 'Generic Constraint', en: 'Generic Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Constraints em genéricos restringem quais tipos são aceitos com "extends". Implemente getProperty com dois parâmetros de tipo: T (o objeto) e K extends keyof T (uma chave válida de T) — retornando T[K] com segurança de tipos completa.',
      en: 'Generic constraints restrict which types are accepted using "extends". Implement getProperty with two type parameters: T (the object) and K extends keyof T (a valid key of T) — returning T[K] with full type safety.',
    },
    code: `function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}`,
  },
  {
    id: 'ts-008',
    concept: { pt: 'Mapped Type', en: 'Mapped Type' },
    difficulty: 'hard',
    prompt: {
      pt: 'Mapped types iteram sobre as chaves de um tipo para construir uma variação. Crie Optional<T> que usa [K in keyof T]? para tornar cada propriedade opcional — é o equivalente manual ao utility type Partial<T> nativo.',
      en: 'Mapped types iterate over a type\'s keys to build a variation. Create Optional<T> using [K in keyof T]? to make every property optional — the manual equivalent of the built-in Partial<T> utility type.',
    },
    code: `type Optional<T> = {
  [K in keyof T]?: T[K];
};`,
  },
  {
    id: 'ts-009',
    concept: { pt: 'Intersection Type', en: 'Intersection Type' },
    difficulty: 'easy',
    prompt: {
      pt: 'Intersection types (&) combinam dois tipos em um único que exige todos os campos de ambos. Crie Employee como a interseção de Person com um objeto que adiciona "company" e "role" — uma instância válida precisará de todos os campos.',
      en: 'Intersection types (&) combine two types into one that requires all fields from both. Create Employee as the intersection of Person with an object that adds "company" and "role" — a valid instance must have all fields.',
    },
    code: `type Employee = Person & {
  company: string;
  role: string;
};`,
  },
  {
    id: 'ts-010',
    concept: { pt: 'Type Guard', en: 'Type Guard' },
    difficulty: 'medium',
    prompt: {
      pt: 'Type guards são funções que narram o tipo de um valor em tempo de execução para o compilador. Implemente isString com retorno "value is string": ao retornar true, o TypeScript refina automaticamente o tipo no bloco seguinte.',
      en: 'Type guards are functions that tell the compiler about a value\'s type at runtime. Implement isString with return type "value is string": when it returns true, TypeScript automatically narrows the type in the following block.',
    },
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
  },
]
