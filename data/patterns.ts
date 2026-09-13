import { Snippet } from '@/lib/types'

export const patternsSnippets: Snippet[] = [
  {
    id: 'pat-001',
    concept: { pt: 'Responsabilidade Única (SOLID S)', en: 'Single Responsibility (SOLID S)' },
    difficulty: 'easy',
    prompt: {
      pt: 'O princípio S do SOLID diz que uma classe deve ter apenas um motivo pra mudar. Separe a lógica de validação da lógica de persistência em classes distintas.',
      en: 'The S principle of SOLID says a class should have only one reason to change. Separate validation logic from persistence logic into distinct classes.',
    },
    code: `class UserValidator {
  validate(user) {
    if (!user.email.includes('@')) throw new Error('Invalid email');
    if (user.name.length < 2) throw new Error('Name too short');
    return true;
  }
}

class UserRepository {
  async save(user) {
    const validator = new UserValidator();
    validator.validate(user);
    return await db.users.insert(user);
  }
}`,
  },
  {
    id: 'pat-002',
    concept: { pt: 'Aberto/Fechado (SOLID O)', en: 'Open/Closed (SOLID O)' },
    difficulty: 'medium',
    prompt: {
      pt: 'O princípio O diz que entidades devem ser abertas pra extensão mas fechadas pra modificação. Use polimorfismo pra adicionar novos tipos de desconto sem alterar o cálculo existente.',
      en: 'The O principle says entities should be open for extension but closed for modification. Use polymorphism to add new discount types without changing existing calculation.',
    },
    code: `class PercentDiscount {
  constructor(percent) { this.percent = percent; }
  apply(price) { return price * (1 - this.percent / 100); }
}

class FixedDiscount {
  constructor(amount) { this.amount = amount; }
  apply(price) { return Math.max(0, price - this.amount); }
}

function calculateTotal(price, discount) {
  return discount.apply(price);
}

calculateTotal(100, new PercentDiscount(20));
calculateTotal(100, new FixedDiscount(15));`,
  },
  {
    id: 'pat-003',
    concept: { pt: 'Substituição de Liskov (SOLID L)', en: 'Liskov Substitution (SOLID L)' },
    difficulty: 'medium',
    prompt: {
      pt: 'O princípio L garante que subclasses podem substituir a classe pai sem quebrar o comportamento. Mostre uma hierarquia onde as subclasses respeitam o contrato da base.',
      en: 'The L principle ensures subclasses can replace the parent without breaking behavior. Show a hierarchy where subclasses respect the base contract.',
    },
    code: `class Shape {
  area() { throw new Error('Not implemented'); }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  area() { return this.width * this.height; }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() { return Math.PI * this.radius ** 2; }
}

function printArea(shape) {
  console.log(\`Área: \${shape.area().toFixed(2)}\`);
}

printArea(new Rectangle(5, 3));
printArea(new Circle(4));`,
  },
  {
    id: 'pat-004',
    concept: { pt: 'Segregação de Interface (SOLID I)', en: 'Interface Segregation (SOLID I)' },
    difficulty: 'medium',
    prompt: {
      pt: 'O princípio I diz que nenhum cliente deve depender de métodos que não usa. Em TypeScript, divida interfaces grandes em interfaces menores e específicas.',
      en: 'The I principle says no client should depend on methods it doesn\'t use. In TypeScript, split large interfaces into smaller, specific ones.',
    },
    code: `interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface Closable {
  close(): void;
}

class FileStream implements Readable, Writable, Closable {
  read() { return 'data'; }
  write(data: string) { console.log(data); }
  close() { console.log('closed'); }
}

class ReadOnlyStream implements Readable {
  read() { return 'readonly data'; }
}`,
  },
  {
    id: 'pat-005',
    concept: { pt: 'Inversão de Dependência (SOLID D)', en: 'Dependency Inversion (SOLID D)' },
    difficulty: 'hard',
    prompt: {
      pt: 'O princípio D diz que módulos de alto nível não devem depender dos de baixo nível -- ambos devem depender de abstrações. Injete a dependência de banco de dados via construtor.',
      en: 'The D principle says high-level modules shouldn\'t depend on low-level ones -- both should depend on abstractions. Inject the database dependency via constructor.',
    },
    code: `interface UserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<void>;
}

class PostgresUserRepo implements UserRepository {
  async findById(id: string) { return db.query('SELECT...', [id]); }
  async save(user: User) { await db.query('INSERT...', [user]); }
}

class UserService {
  constructor(private repo: UserRepository) {}

  async getUser(id: string) {
    return this.repo.findById(id);
  }
}

const service = new UserService(new PostgresUserRepo());`,
  },
  {
    id: 'pat-006',
    concept: { pt: 'DRY -- Extrair Função', en: 'DRY -- Extract Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'DRY (Don\'t Repeat Yourself) elimina duplicação extraindo lógica comum em funções reutilizáveis. Extraia a formatação de data que aparece em vários lugares.',
      en: 'DRY (Don\'t Repeat Yourself) eliminates duplication by extracting common logic into reusable functions. Extract date formatting that appears in multiple places.',
    },
    code: `const formatDate = (date, locale = 'pt-BR') =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

console.log(formatDate('2026-03-31'));
console.log(formatDate('2026-01-15', 'en-US'));`,
  },
]
