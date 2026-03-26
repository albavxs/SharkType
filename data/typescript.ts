import { Snippet } from '@/lib/types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-001',
    concept: 'Interface',
    difficulty: 'easy',
    prompt: 'Defina uma interface TypeScript para um usuario com campos obrigatorios e opcionais.',
    code: `interface User {
  name: string;
  age: number;
  email?: string;
}`,
  },
  {
    id: 'ts-002',
    concept: 'Type Alias',
    difficulty: 'easy',
    prompt: 'Crie um type alias representando os possiveis status de um recurso usando union type.',
    code: `type Status = 'active' | 'inactive' | 'pending';`,
  },
  {
    id: 'ts-003',
    concept: 'Generics',
    difficulty: 'medium',
    prompt: 'Escreva uma funcao generica que retorna o primeiro elemento de qualquer array tipado.',
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}`,
  },
  {
    id: 'ts-004',
    concept: 'Enum',
    difficulty: 'easy',
    prompt: 'Defina um enum de direcoes com valores string para uso em navegacao.',
    code: `enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}`,
  },
  {
    id: 'ts-005',
    concept: 'Type Narrowing',
    difficulty: 'medium',
    prompt: 'Escreva uma funcao que aceita string ou numero e usa type narrowing para tratar cada tipo diferente.',
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
    concept: 'Utility Types',
    difficulty: 'medium',
    prompt: 'Use os utility types Pick, Partial e Readonly para criar variacoes de um tipo existente.',
    code: `type UserPreview = Pick<User, 'name' | 'email'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;`,
  },
  {
    id: 'ts-007',
    concept: 'Generic Constraint',
    difficulty: 'hard',
    prompt: 'Implemente uma funcao generica com constraint keyof para acessar propriedades de forma completamente tipada.',
    code: `function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}`,
  },
  {
    id: 'ts-008',
    concept: 'Mapped Type',
    difficulty: 'hard',
    prompt: 'Crie um mapped type que transforma todas as propriedades de um tipo em opcionais.',
    code: `type Optional<T> = {
  [K in keyof T]?: T[K];
};`,
  },
  {
    id: 'ts-009',
    concept: 'Intersection Type',
    difficulty: 'easy',
    prompt: 'Crie o tipo Employee combinando Person com campos de trabalho usando intersection type.',
    code: `type Employee = Person & {
  company: string;
  role: string;
};`,
  },
  {
    id: 'ts-010',
    concept: 'Type Guard',
    difficulty: 'medium',
    prompt: 'Escreva uma type guard function que verifica em tempo de execucao se um valor e do tipo string.',
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
  },
]
