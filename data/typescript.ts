import { Snippet } from '@/lib/types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-001',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interface define a forma que um objeto precisa ter no TypeScript. Crie a interface User com os campos obrigatórios "name" (string) e "age" (number), e "email" como opcional -- marcado com ? pra indicar que pode ser omitido.',
      en: 'Interfaces define the expected shape of an object in TypeScript. Create the User interface with required fields "name" (string) and "age" (number), and an optional "email" field -- marked with ? to indicate it can be omitted.',
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
      pt: 'Type alias cria um nome pra tipos existentes ou pra uma união de tipos literais. Defina Status como um union type que só aceita três valores: "active", "inactive" e "pending" -- qualquer outro valor o TypeScript rejeita.',
      en: 'Type aliases create names for existing types or unions of literal types. Define Status as a union type that only accepts three possible values: "active", "inactive", and "pending" -- TypeScript will reject anything else.',
    },
    code: `type Status = 'active' | 'inactive' | 'pending';`,
    slot: 'type-union',
  },
  {
    id: 'ts-003',
    concept: { pt: 'Genéricos', en: 'Generics' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções genéricas funcionam com qualquer tipo sem perder a segurança de tipos. Escreva first<T>: ela recebe um array de tipo T e retorna o primeiro elemento -- ou undefined se o array estiver vazio.',
      en: 'Generic functions work with any type while preserving type safety. Write first<T>: it takes an array of any type T and returns the first element -- or undefined if the array is empty.',
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
      pt: 'Enum representa um conjunto fixo de valores nomeados. Defina Direction com quatro direções, dando pra cada uma um valor string explícito (UP, DOWN, LEFT, RIGHT) -- facilita na hora de serializar e debugar.',
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
      pt: 'Type narrowing refina o tipo de uma variável dentro de um bloco condicional. Implemente printId aceitando string | number e use typeof pra chamar .toUpperCase() em strings e .toFixed(2) em números -- o TS entende cada branch.',
      en: 'Type narrowing refines a variable\'s type within a block. Implement printId that accepts string | number and uses typeof to call .toUpperCase() on strings and .toFixed(2) on numbers -- TypeScript understands each branch.',
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
]
