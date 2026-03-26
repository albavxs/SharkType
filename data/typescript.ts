import { Snippet } from '@/lib/types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-001',
    concept: 'Interface',
    difficulty: 'easy',
    prompt: 'Interfaces definem o formato esperado de um objeto em TypeScript. Crie a interface User com os campos obrigatorios "name" (string) e "age" (number), e o campo opcional "email" — marcado com ? para indicar que pode ser omitido.',
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
    prompt: 'Type aliases criam nomes para tipos existentes ou para uniao de tipos literais. Defina Status como um union type que aceita apenas tres valores possiveis: "active", "inactive" e "pending" — o TypeScript rejeitara qualquer outro valor.',
    code: `type Status = 'active' | 'inactive' | 'pending';`,
  },
  {
    id: 'ts-003',
    concept: 'Generics',
    difficulty: 'medium',
    prompt: 'Funcoes genericas funcionam com qualquer tipo enquanto mantem seguranca de tipos. Escreva first<T>: ela recebe um array de qualquer tipo T e retorna o primeiro elemento — ou undefined se o array estiver vazio.',
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}`,
  },
  {
    id: 'ts-004',
    concept: 'Enum',
    difficulty: 'easy',
    prompt: 'Enums representam um conjunto fixo de valores nomeados. Defina Direction com quatro direcoes de navegacao, atribuindo a cada uma um valor string explicito (UP, DOWN, LEFT, RIGHT) para serializar e depurar com mais facilidade.',
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
    prompt: 'Type narrowing refina o tipo de uma variavel dentro de um bloco. Implemente printId que aceita string | number e usa typeof para executar .toUpperCase() em strings e .toFixed(2) em numeros — o TypeScript entende cada ramo.',
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
    prompt: 'TypeScript oferece utility types para derivar novos tipos sem reescrever definicoes. Use Pick para selecionar apenas name e email, Partial para tornar todos os campos opcionais, e Readonly para proibir qualquer mutacao pos-criacao.',
    code: `type UserPreview = Pick<User, 'name' | 'email'>;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;`,
  },
  {
    id: 'ts-007',
    concept: 'Generic Constraint',
    difficulty: 'hard',
    prompt: 'Constraints em genericos restringem quais tipos sao aceitos com "extends". Implemente getProperty com dois parametros de tipo: T (o objeto) e K extends keyof T (uma chave valida de T) — retornando T[K] com seguranca de tipos completa.',
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
    prompt: 'Mapped types iteram sobre as chaves de um tipo para construir uma variacao. Crie Optional<T> que usa [K in keyof T]? para tornar cada propriedade opcional — e o equivalente manual ao utility type Partial<T> nativo.',
    code: `type Optional<T> = {
  [K in keyof T]?: T[K];
};`,
  },
  {
    id: 'ts-009',
    concept: 'Intersection Type',
    difficulty: 'easy',
    prompt: 'Intersection types (&) combinam dois tipos em um unico que exige todos os campos de ambos. Crie Employee como a intersecao de Person com um objeto que adiciona "company" e "role" — uma instancia valida precisara de todos os campos.',
    code: `type Employee = Person & {
  company: string;
  role: string;
};`,
  },
  {
    id: 'ts-010',
    concept: 'Type Guard',
    difficulty: 'medium',
    prompt: 'Type guards sao funcoes que narram o tipo de um valor em tempo de execucao para o compilador. Implemente isString com retorno "value is string": ao retornar true, o TypeScript refina automaticamente o tipo no bloco seguinte.',
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}`,
  },
]
