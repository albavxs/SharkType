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
  {
    id: 'pat-007',
    concept: { pt: 'Padrão Factory', en: 'Factory Pattern' },
    difficulty: 'medium',
    prompt: {
      pt: 'O Factory Pattern encapsula a criação de objetos, delegando a lógica de instanciação a um método. Crie uma factory que produz diferentes tipos de notificação.',
      en: 'The Factory Pattern encapsulates object creation, delegating instantiation logic to a method. Create a factory that produces different notification types.',
    },
    code: `class EmailNotification {
  send(msg) { console.log(\`Email: \${msg}\`); }
}

class SmsNotification {
  send(msg) { console.log(\`SMS: \${msg}\`); }
}

class PushNotification {
  send(msg) { console.log(\`Push: \${msg}\`); }
}

function createNotification(type) {
  const map = {
    email: EmailNotification,
    sms: SmsNotification,
    push: PushNotification,
  };
  const Ctor = map[type];
  if (!Ctor) throw new Error(\`Unknown type: \${type}\`);
  return new Ctor();
}

createNotification('email').send('Olá!');`,
  },
  {
    id: 'pat-008',
    concept: { pt: 'Padrão Observer', en: 'Observer Pattern' },
    difficulty: 'medium',
    prompt: {
      pt: 'O Observer Pattern permite que objetos se inscrevam pra receber notificações de mudanças. Implemente um EventEmitter simples com on, off e emit.',
      en: 'The Observer Pattern allows objects to subscribe for change notifications. Implement a simple EventEmitter with on, off, and emit.',
    },
    code: `class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    (this.listeners[event] ??= []).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    this.listeners[event] = this.listeners[event]?.filter(f => f !== fn);
  }

  emit(event, ...args) {
    this.listeners[event]?.forEach(fn => fn(...args));
  }
}

const bus = new EventEmitter();
const unsub = bus.on('save', (data) => console.log('Saved:', data));
bus.emit('save', { id: 1 });
unsub();`,
  },
  {
    id: 'pat-009',
    concept: { pt: 'Padrão Strategy', en: 'Strategy Pattern' },
    difficulty: 'hard',
    prompt: {
      pt: 'O Strategy Pattern define uma família de algoritmos intercambiáveis em tempo de execução. Implemente diferentes estratégias de ordenação que podem ser trocadas.',
      en: 'The Strategy Pattern defines a family of interchangeable algorithms at runtime. Implement different sorting strategies that can be swapped.',
    },
    code: `const strategies = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
  newest: (a, b) => new Date(b.date) - new Date(a.date),
};

function sortProducts(products, strategy = 'price_asc') {
  const compareFn = strategies[strategy];
  if (!compareFn) throw new Error(\`Unknown strategy: \${strategy}\`);
  return [...products].sort(compareFn);
}

const products = [
  { name: 'Mouse', price: 59, date: '2026-01-10' },
  { name: 'Teclado', price: 120, date: '2026-03-05' },
];
sortProducts(products, 'price_desc');`,
  },
  {
    id: 'pat-010',
    concept: { pt: 'Padrão Singleton', en: 'Singleton Pattern' },
    difficulty: 'easy',
    prompt: {
      pt: 'O Singleton garante que uma classe tenha apenas uma instância global. Em JavaScript moderno, use um módulo que exporta a instância diretamente.',
      en: 'The Singleton ensures a class has only one global instance. In modern JavaScript, use a module that exports the instance directly.',
    },
    code: `class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    this.connection = null;
    Database.instance = this;
  }

  connect(url) {
    this.connection = url;
    console.log(\`Connected to \${url}\`);
  }

  query(sql) {
    if (!this.connection) throw new Error('Not connected');
    return \`Result of: \${sql}\`;
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true`,
  },
  {
    id: 'pat-011',
    concept: { pt: 'Padrão Adapter', en: 'Adapter Pattern' },
    difficulty: 'medium',
    prompt: {
      pt: 'O Adapter converte a interface de uma classe em outra que o cliente espera. Crie um adapter que normaliza diferentes APIs de pagamento numa interface única.',
      en: 'The Adapter converts a class interface into another the client expects. Create an adapter that normalizes different payment APIs into a single interface.',
    },
    code: `class StripeGateway {
  createCharge(amount, currency) {
    return { id: 'ch_123', amount, currency };
  }
}

class PayPalGateway {
  makePayment(value, curr) {
    return { txn: 'pp_456', value, curr };
  }
}

class PaymentAdapter {
  constructor(gateway) { this.gw = gateway; }

  pay(amount, currency) {
    if (this.gw instanceof StripeGateway)
      return this.gw.createCharge(amount, currency);
    if (this.gw instanceof PayPalGateway)
      return this.gw.makePayment(amount, currency);
  }
}

const adapter = new PaymentAdapter(new StripeGateway());
adapter.pay(5000, 'BRL');`,
  },
  {
    id: 'pat-012',
    concept: { pt: 'Clean Code -- Nomes e Funções Pequenas', en: 'Clean Code -- Naming and Small Functions' },
    difficulty: 'easy',
    prompt: {
      pt: 'Clean Code prioriza nomes descritivos e funções pequenas que fazem uma coisa só. Refatore uma função longa em funções menores com nomes claros.',
      en: 'Clean Code prioritizes descriptive names and small functions that do one thing. Refactor a long function into smaller ones with clear names.',
    },
    code: `function calculateOrderTotal(order) {
  const subtotal = sumItemPrices(order.items);
  const discount = applyDiscount(subtotal, order.coupon);
  const shipping = calculateShipping(order.address, subtotal);
  const tax = calculateTax(discount + shipping, order.address.state);
  return discount + shipping + tax;
}

function sumItemPrices(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function applyDiscount(subtotal, coupon) {
  if (!coupon) return subtotal;
  return subtotal * (1 - coupon.percent / 100);
}`,
  },
]
