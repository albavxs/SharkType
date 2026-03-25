import { Snippet } from '@/lib/types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-001',
    concept: 'Interface',
    difficulty: 'easy',
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
    code: `type Status = 'active' | 'inactive' | 'pending';`,
  },
  {
    id: 'ts-003',
    concept: 'Generics',
    difficulty: 'medium',
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}`,
  },
  {
    id: 'ts-004',
    concept: 'Enum',
    difficulty: 'easy',
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
    code: `type UserPreview = Pick<User, 'name' | 'email'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;`,
  },
  {
    id: 'ts-007',
    concept: 'Generic Constraint',
    difficulty: 'hard',
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
    code: `type Optional<T> = {
  [K in keyof T]?: T[K];
};`,
  },
  {
    id: 'ts-009',
    concept: 'Intersection Type',
    difficulty: 'easy',
    code: `type Employee = Person & {
  company: string;
  role: string;
};`,
  },
  {
    id: 'ts-010',
    concept: 'Type Guard',
    difficulty: 'medium',
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
  },
]
