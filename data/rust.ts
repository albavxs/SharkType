import { Snippet } from '@/lib/types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rs-001',
    concept: { pt: 'Function com Tipos', en: 'Function with Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Rust, todo tipo de parâmetro e de retorno precisa ser declarado explicitamente. Escreva a função "add" recebendo dois i32 e retornando i32 — o compilador não infere tipo de função pública.',
      en: 'In Rust, all parameter and return types must be declared explicitly. Write the "add" function that takes two i32 parameters and returns an i32 — the compiler doesn\'t infer types for public functions.',
    },
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
    slot: 'fn-basic',
  },
  {
    id: 'rs-002',
    concept: { pt: 'Propriedade', en: 'Ownership' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Rust, mover um valor transfere o ownership — depois disso, a variável original fica inválida. Use .clone() pra criar uma cópia independente de s1 em s2, permitindo usar as duas sem violar o sistema de ownership.',
      en: 'In Rust, moving a value transfers its ownership — after that, the original variable becomes invalid. Use .clone() to create an independent copy of s1 into s2, allowing both to be used without violating the ownership system.',
    },
    code: `let s1 = String::from("hello");
let s2 = s1.clone();
println!("{s1} and {s2}");`,
  },
  {
    id: 'rs-003',
    concept: { pt: 'Casamento de Padrões', en: 'Pattern Matching' },
    difficulty: 'medium',
    prompt: {
      pt: 'O match em Rust é exaustivo: o compilador obriga você a cobrir todos os casos possíveis. Use pra tratar cada variante de Status — incluindo Inactive(reason) que tem dado associado — e um wildcard _ pro restante.',
      en: 'Match in Rust is exhaustive: the compiler requires all possible cases to be covered. Use it to handle each Status variant — including the one with associated data Inactive(reason) — and a wildcard _ for the rest.',
    },
    code: `match status {
    Status::Active => println!("active"),
    Status::Inactive(reason) => println!("{reason}"),
    _ => println!("unknown"),
}`,
    slot: 'cond-switch',
  },
  {
    id: 'rs-004',
    concept: { pt: 'Opção', en: 'Option' },
    difficulty: 'medium',
    prompt: {
      pt: 'Option<T> representa um valor que pode ou não existir — é o substituto seguro do null em Rust. Implemente find_user retornando Some(String) pra id == 1 e None pra qualquer outro — nada de null, -1 ou valor sentinela.',
      en: 'Option<T> represents a value that may or may not exist, safely replacing null in Rust. Implement find_user returning Some(String) for id == 1 and None for anything else — no null, -1, or sentinel values.',
    },
    code: `fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Alice"))
    } else {
        None
    }
}`,
    slot: 'type-utility',
  },
  {
    id: 'rs-005',
    concept: { pt: 'Resultado', en: 'Result' },
    difficulty: 'medium',
    prompt: {
      pt: 'Result<T, E> representa sucesso (Ok) ou falha (Err) de uma operação. Implemente parse_number tentando converter &str em i32 com .parse(), e mapeie o erro pra uma String descritiva usando .map_err.',
      en: 'Result<T, E> represents success (Ok) or failure (Err) of an operation. Implement parse_number that tries to convert &str to i32 using .parse(), mapping the parse error to a descriptive String with .map_err.',
    },
    code: `fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>()
        .map_err(|e| format!("Parse error: {e}"))
}`,
    slot: 'err-result',
  },
  {
    id: 'rs-006',
    concept: { pt: 'Struct com Impl', en: 'Struct with Impl' },
    difficulty: 'medium',
    prompt: {
      pt: 'Struct agrupa dados relacionados; bloco impl adiciona comportamento. Defina Rectangle com width e height como f64, depois implemente area(&self) no bloco impl retornando o produto dos dois campos.',
      en: 'Structs group related data; impl blocks add behavior to them. Define Rectangle with width and height as f64, then implement the area(&self) method in the impl block that returns the product of both fields.',
    },
    code: `struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}`,
    slot: 'obj-methods',
  },
  {
    id: 'rs-007',
    concept: { pt: 'Operações com Vec', en: 'Vec Operations' },
    difficulty: 'easy',
    prompt: {
      pt: 'Vec<T> é o array dinâmico do Rust. Crie um Vec<i32> vazio com Vec::new(), adicione dois elementos com .push() e some tudo de forma idiomática usando o iterador .iter().sum().',
      en: 'Vec<T> is Rust\'s dynamic array. Create an empty Vec<i32> with Vec::new(), add two elements with .push(), and calculate the sum of all elements idiomatically using the .sum() iterator method.',
    },
    code: `let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
let sum: i32 = v.iter().sum();`,
    slot: 'var-array',
  },
  {
    id: 'rs-008',
    concept: { pt: 'Closure com Move', en: 'Closure with Move' },
    difficulty: 'hard',
    prompt: {
      pt: 'Closure com "move" captura o ambiente transferindo o ownership das variáveis. Capture a String "name" por move dentro de "greet", assim a closure pode ser usada mesmo depois que o escopo original acabar.',
      en: 'Closures with "move" capture the environment by transferring ownership of captured variables. Capture the String "name" by move into "greet", allowing the closure to be used even after the original scope ends.',
    },
    code: `let name = String::from("Alice");
let greet = move || {
    println!("Hello, {name}!");
};
greet();`,
    slot: 'fn-closure',
  },
  {
    id: 'rs-009',
    concept: { pt: 'Empréstimo', en: 'Borrowing' },
    difficulty: 'easy',
    prompt: {
      pt: 'Borrowing permite usar referências sem transferir ownership. Implemente first_word recebendo &str (referência emprestada) e retornando &str apontando pra primeira palavra do mesmo buffer, sem alocar memória nova.',
      en: 'Borrowing allows references without transferring ownership. Implement first_word taking a &str (borrowed reference) and returning a &str that points to the first word of the same buffer without allocating new memory.',
    },
    code: `fn first_word(s: &str) -> &str {
    &s[..s.find(' ').unwrap_or(s.len())]
}`,
  },
  {
    id: 'rs-010',
    concept: { pt: 'Enumeração Algébrica', en: 'Enum' },
    difficulty: 'hard',
    prompt: {
      pt: 'Enum em Rust pode carregar dados de tipos diferentes em cada variante. Defina Command com quatro variantes: Quit (sem dados), Echo(String) (tupla), Move { x, y } (struct anônima) e Color(u8, u8, u8) (tupla de três bytes).',
      en: 'Enums in Rust can carry different data types in each variant. Define Command with four variants: Quit (no data), Echo(String) (tuple), Move { x, y } (anonymous struct), and Color(u8, u8, u8) (three-byte tuple).',
    },
    code: `enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}`,
    slot: 'type-union',
  },
  // ── NEW SNIPPETS ──
  {
    id: 'rs-011',
    concept: { pt: 'If Básico', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Rust, "if" não usa parênteses na condição e é uma expressão que retorna valor. Use if pra checar se um número é positivo.',
      en: 'In Rust, "if" does not use parentheses around the condition and is an expression that returns a value. Use if to check whether a number is positive.',
    },
    code: `let n = 42;
if n > 0 {
    println!("positivo");
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'rs-012',
    concept: { pt: 'If-Else como Expressão', en: 'If-Else Expression' },
    difficulty: 'easy',
    prompt: {
      pt: 'Como "if" é expressão em Rust, dá pra atribuir o resultado direto a uma variável com let. Use if-else pra classificar um número.',
      en: 'Since "if" is an expression in Rust, you can assign its result directly to a variable with let. Use if-else to classify a number.',
    },
    code: `let n = 7;
let label = if n % 2 == 0 { "par" } else { "ímpar" };
println!("{n} é {label}");`,
    slot: 'cond-if-else',
  },
  {
    id: 'rs-013',
    concept: { pt: 'Ternário com If Inline', en: 'Ternary with Inline If' },
    difficulty: 'easy',
    prompt: {
      pt: 'Rust não tem operador ternário (?:), mas if-else inline faz o mesmo papel como expressão. Use pra escolher entre dois valores.',
      en: 'Rust has no ternary operator (?:), but inline if-else serves the same purpose as an expression. Use it to choose between two values.',
    },
    code: `let age = 20;
let status = if age >= 18 { "adulto" } else { "menor" };
println!("{status}");`,
    slot: 'cond-ternary',
  },
  {
    id: 'rs-014',
    concept: { pt: 'Guard com Retorno Antecipado', en: 'Guard with Early Return' },
    difficulty: 'medium',
    prompt: {
      pt: 'Rust usa retorno antecipado como guard clause, abortando a função cedo se a condição não for atendida. Valide parâmetros no início.',
      en: 'Rust uses early return as a guard clause, aborting the function early if the condition is not met. Validate parameters at the start.',
    },
    code: `fn withdraw(amount: f64, balance: f64) -> Result<f64, &'static str> {
    if amount <= 0.0 { return Err("valor inválido"); }
    if amount > balance { return Err("saldo insuficiente"); }
    Ok(balance - amount)
}`,
    slot: 'cond-guard',
  },
  {
    id: 'rs-015',
    concept: { pt: 'Declaração de Variável', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: '"let" cria binding imutável e "let mut" cria mutável. Declare variáveis dos dois tipos com e sem anotação de tipo.',
      en: '"let" creates an immutable binding and "let mut" a mutable one. Declare variables of both kinds with and without type annotation.',
    },
    code: `let name = "Rust";
let mut counter = 0;
let pi: f64 = 3.14;
counter += 1;`,
    slot: 'var-declare',
  },
  {
    id: 'rs-016',
    concept: { pt: 'Constante', en: 'Constant' },
    difficulty: 'easy',
    prompt: {
      pt: '"const" define constantes em tempo de compilação em Rust, exigindo tipo explícito e valor conhecido em compile time.',
      en: '"const" defines compile-time constants in Rust, requiring explicit type and a value known at compile time.',
    },
    code: `const MAX_RETRIES: u32 = 3;
const TIMEOUT_MS: u64 = 5000;
const PI: f64 = 3.14159;`,
    slot: 'var-const',
  },
  {
    id: 'rs-017',
    concept: { pt: 'Tipos Básicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Rust tem tipos numéricos explícitos (i32, u64, f64, bool, char). Declare variáveis de tipos diferentes com anotação.',
      en: 'Rust has explicit numeric types (i32, u64, f64, bool, char). Declare variables of different types with annotation.',
    },
    code: `let count: i32 = 42;
let big: u64 = 1_000_000;
let ratio: f64 = 3.14;
let active: bool = true;
let letter: char = 'R';`,
    slot: 'var-types',
  },
  {
    id: 'rs-018',
    concept: { pt: 'Interpolação com format!', en: 'Interpolation with format!' },
    difficulty: 'easy',
    prompt: {
      pt: 'Rust usa macros como format!, println! e write! pra interpolação de string com {} como placeholder.',
      en: 'Rust uses macros like format!, println! and write! for string interpolation with {} as placeholder.',
    },
    code: `let lang = "Rust";
let version = 2024;
let msg = format!("{lang} edition {version}");
println!("{msg}");`,
    slot: 'var-interpolation',
  },
  {
    id: 'rs-019',
    concept: { pt: 'Desestruturação', en: 'Destructuring' },
    difficulty: 'medium',
    prompt: {
      pt: 'Rust suporta desestruturação de tuplas e structs em let bindings. Extraia campos em variáveis separadas.',
      en: 'Rust supports destructuring of tuples and structs in let bindings. Extract fields into separate variables.',
    },
    code: `let (x, y, z) = (1, 2.0, "three");
struct Point { x: f64, y: f64 }
let p = Point { x: 3.0, y: 7.0 };
let Point { x: px, y: py } = p;
println!("{px}, {py}");`,
    slot: 'var-destructure',
  },
  {
    id: 'rs-020',
    concept: { pt: 'Closure (Função Anônima)', en: 'Closure (Anonymous Function)' },
    difficulty: 'easy',
    prompt: {
      pt: 'Closures em Rust usam pipes |params| pra parâmetros. Atribua uma closure a uma variável e a invoque.',
      en: 'Rust closures use pipes |params| for parameters. Assign a closure to a variable and invoke it.',
    },
    code: `let square = |n: i32| -> i32 { n * n };
let result = square(5);
println!("{result}");`,
    slot: 'fn-arrow',
  },
  {
    id: 'rs-021',
    concept: { pt: 'Callback com Closure', en: 'Callback with Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções podem receber closures como parâmetro usando traits Fn/FnMut/FnOnce. Crie uma função que aceita uma closure de transformação.',
      en: 'Functions can take closures as parameters using Fn/FnMut/FnOnce traits. Create a function that accepts a transformation closure.',
    },
    code: `fn apply<F: Fn(i32) -> i32>(value: i32, f: F) -> i32 {
    f(value)
}

let doubled = apply(5, |x| x * 2);
let squared = apply(5, |x| x * x);
println!("{doubled}, {squared}");`,
    slot: 'fn-callback',
  },
  {
    id: 'rs-022',
    concept: { pt: 'Parâmetros Padrão (Builder)', en: 'Default Parameters (Builder)' },
    difficulty: 'medium',
    prompt: {
      pt: 'Rust não tem parâmetros padrão, mas o padrão Default + builder simula isso. Implemente Default e um método builder.',
      en: 'Rust has no default parameters, but the Default + builder pattern simulates it. Implement Default and a builder method.',
    },
    code: `#[derive(Default)]
struct Config {
    timeout: u64,
    retries: u32,
}

impl Config {
    fn with_timeout(mut self, t: u64) -> Self {
        self.timeout = t;
        self
    }
}

let cfg = Config::default().with_timeout(5000);`,
    slot: 'fn-default-params',
  },
  {
    id: 'rs-023',
    concept: { pt: 'Loop For', en: 'For Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for em Rust itera sobre qualquer tipo que implemente IntoIterator. Use for com range e com referências a Vec.',
      en: 'Rust for iterates over any type that implements IntoIterator. Use for with a range and with references to a Vec.',
    },
    code: `for i in 1..=5 {
    print!("{i} ");
}
let names = vec!["Ana", "Bruno"];
for name in &names {
    println!("{name}");
}`,
    slot: 'loop-for',
  },
  {
    id: 'rs-024',
    concept: { pt: 'Loop While', en: 'While Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'While repete enquanto a condição for verdadeira. Conte de 1 até 5 usando while com um contador mutável.',
      en: 'While repeats as long as the condition is true. Count from 1 to 5 using while with a mutable counter.',
    },
    code: `let mut i = 1;
while i <= 5 {
    println!("{i}");
    i += 1;
}`,
    slot: 'loop-while',
  },
  {
    id: 'rs-025',
    concept: { pt: 'Iterador ForEach', en: 'Iterator ForEach' },
    difficulty: 'easy',
    prompt: {
      pt: '.iter().for_each() é a alternativa funcional ao for em Rust. Use pra imprimir cada elemento de um vetor.',
      en: '.iter().for_each() is the functional alternative to for in Rust. Use it to print each element of a vector.',
    },
    code: `let names = vec!["Ana", "Bruno", "Clara"];
names.iter().for_each(|name| {
    println!("Olá, {name}!");
});`,
    slot: 'loop-foreach',
  },
  {
    id: 'rs-026',
    concept: { pt: 'Filter e Map', en: 'Filter and Map' },
    difficulty: 'easy',
    prompt: {
      pt: 'Iteradores em Rust suportam filter, map e collect pra transformações funcionais. Filtre os pares e dobre cada um.',
      en: 'Rust iterators support filter, map and collect for functional transformations. Filter the even numbers and double each one.',
    },
    code: `let nums = vec![1, 2, 3, 4, 5, 6];
let result: Vec<i32> = nums.iter()
    .filter(|&&n| n % 2 == 0)
    .map(|&n| n * 2)
    .collect();
println!("{result:?}");`,
    slot: 'loop-filter',
  },
  {
    id: 'rs-027',
    concept: { pt: 'Range', en: 'Range' },
    difficulty: 'easy',
    prompt: {
      pt: 'Ranges em Rust podem ser exclusivos (..) ou inclusivos (..=). Converta ranges em vetores e use step_by pra controlar o passo.',
      en: 'Rust ranges can be exclusive (..) or inclusive (..=). Convert ranges to vectors and use step_by to control the step.',
    },
    code: `let ascending: Vec<i32> = (1..=5).collect();
let stepped: Vec<i32> = (0..10).step_by(2).collect();
println!("{ascending:?}");
println!("{stepped:?}");`,
    slot: 'loop-range',
  },
  {
    id: 'rs-028',
    concept: { pt: 'Criação de Struct', en: 'Struct Creation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Structs em Rust são criadas com a sintaxe NomeStruct { campo: valor }. Defina e instancie uma struct simples.',
      en: 'Rust structs are created with NomeStruct { field: value } syntax. Define and instantiate a simple struct.',
    },
    code: `struct Car {
    brand: String,
    speed: u32,
}

let car = Car {
    brand: String::from("Tesla"),
    speed: 100,
};
println!("{}: {} km/h", car.brand, car.speed);`,
    slot: 'obj-create',
  },
  {
    id: 'rs-029',
    concept: { pt: 'Trait (Interface)', en: 'Trait (Interface)' },
    difficulty: 'medium',
    prompt: {
      pt: 'Traits em Rust definem interfaces com métodos abstratos e implementações padrão. Defina um trait com os dois tipos de método.',
      en: 'Rust traits define interfaces with abstract methods and default implementations. Define a trait with both types of methods.',
    },
    code: `trait Drawable {
    fn draw(&self);
    fn description(&self) -> String {
        String::from("Drawable element")
    }
}

struct Circle { radius: f64 }
impl Drawable for Circle {
    fn draw(&self) { println!("Drawing circle r={}", self.radius); }
}`,
    slot: 'obj-interface',
  },
  {
    id: 'rs-030',
    concept: { pt: 'Struct Aninhada', en: 'Nested Struct' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structs podem conter outras structs como campos, criando estruturas aninhadas. Componha tipos pra modelar dados complexos.',
      en: 'Structs can contain other structs as fields, creating nested structures. Compose types to model complex data.',
    },
    code: `struct Address {
    city: String,
    zip: String,
}

struct User {
    name: String,
    address: Address,
}

let user = User {
    name: String::from("Ana"),
    address: Address { city: String::from("SP"), zip: String::from("01000") },
};`,
    slot: 'obj-nested',
  },
  {
    id: 'rs-031',
    concept: { pt: 'Struct com New', en: 'Struct with New' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Rust, o construtor convencional é um associated function chamado "new". Implemente new e um método pra uma struct básica.',
      en: 'In Rust, the conventional constructor is an associated function called "new". Implement new and a method for a basic struct.',
    },
    code: `struct Player {
    name: String,
    score: u32,
}

impl Player {
    fn new(name: &str) -> Self {
        Self { name: name.to_string(), score: 0 }
    }
    fn add_score(&mut self, pts: u32) { self.score += pts; }
}`,
    slot: 'class-basic',
  },
  {
    id: 'rs-032',
    concept: { pt: 'Trait como Herança', en: 'Trait as Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'Rust usa composição de traits no lugar de herança de classe. Defina um trait base e implemente em structs diferentes.',
      en: 'Rust uses trait composition instead of class inheritance. Define a base trait and implement it on different structs.',
    },
    code: `trait Animal {
    fn name(&self) -> &str;
    fn sound(&self) -> &str;
}

struct Dog { name: String }
impl Animal for Dog {
    fn name(&self) -> &str { &self.name }
    fn sound(&self) -> &str { "Woof!" }
}`,
    slot: 'class-inherit',
  },
  {
    id: 'rs-033',
    concept: { pt: 'Override via Trait', en: 'Override via Trait' },
    difficulty: 'medium',
    prompt: {
      pt: 'Traits com implementação padrão permitem "override" ao reimplementar o método. Sobrescreva o comportamento padrão num tipo específico.',
      en: 'Traits with default implementation allow "override" by reimplementing the method. Override the default behavior on a specific type.',
    },
    code: `trait Shape {
    fn area(&self) -> f64 { 0.0 }
    fn name(&self) -> &str;
}

struct Square { side: f64 }
impl Shape for Square {
    fn area(&self) -> f64 { self.side * self.side }
    fn name(&self) -> &str { "Square" }
}`,
    slot: 'class-override',
  },
  {
    id: 'rs-034',
    concept: { pt: 'Trait Abstrato', en: 'Abstract Trait' },
    difficulty: 'hard',
    prompt: {
      pt: 'Traits com métodos sem implementação padrão funcionam como classes abstratas. Defina um trait com parte abstrata e parte concreta.',
      en: 'Traits with methods without default implementation work as abstract classes. Define a trait with abstract and concrete parts.',
    },
    code: `trait Logger {
    fn write(&self, msg: &str);
    fn log(&self, msg: &str) {
        self.write(&format!("[LOG] {msg}"));
    }
}

struct Console;
impl Logger for Console {
    fn write(&self, msg: &str) { println!("{msg}"); }
}`,
    slot: 'class-abstract',
  },
  {
    id: 'rs-035',
    concept: { pt: 'Tratamento com Match', en: 'Error Handling with Match' },
    difficulty: 'medium',
    prompt: {
      pt: 'Use match pra tratar Result explicitamente, executando lógica diferente pra Ok e Err.',
      en: 'Use match to handle Result explicitly, executing different logic for Ok and Err.',
    },
    code: `fn parse(input: &str) -> Result<i32, String> {
    input.parse().map_err(|_| format!("inválido: {input}"))
}

match parse("42") {
    Ok(n) => println!("número: {n}"),
    Err(e) => println!("erro: {e}"),
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'rs-036',
    concept: { pt: 'Erro Personalizado', en: 'Custom Error' },
    difficulty: 'medium',
    prompt: {
      pt: 'Crie um enum de erro personalizado implementando Display e Error. Defina variantes com dados descritivos.',
      en: 'Create a custom error enum implementing Display and Error. Define variants with descriptive data.',
    },
    code: `use std::fmt;

#[derive(Debug)]
enum AppError {
    NotFound(String),
    Unauthorized,
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Self::NotFound(id) => write!(f, "não encontrado: {id}"),
            Self::Unauthorized => write!(f, "não autorizado"),
        }
    }
}`,
    slot: 'err-custom',
  },
  {
    id: 'rs-037',
    concept: { pt: 'Operador ? (Finally)', en: 'The ? Operator (Finally)' },
    difficulty: 'medium',
    prompt: {
      pt: 'O operador "?" propaga erros automaticamente, retornando Err cedo se a operação falhar. Use pra encadear operações falíveis.',
      en: 'The "?" operator propagates errors automatically, returning Err early if the operation fails. Use it to chain fallible operations.',
    },
    code: `use std::fs;

fn read_config(path: &str) -> Result<String, std::io::Error> {
    let content = fs::read_to_string(path)?;
    Ok(content.trim().to_string())
}`,
    slot: 'err-finally',
  },
  {
    id: 'rs-038',
    concept: { pt: 'Genéricos', en: 'Generics' },
    difficulty: 'hard',
    prompt: {
      pt: 'Genéricos permitem escrever funções e structs que funcionam com qualquer tipo. Crie uma struct Stack genérica com push e pop.',
      en: 'Generics let you write functions and structs that work with any type. Create a generic Stack struct with push and pop.',
    },
    code: `struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self { Self { items: Vec::new() } }
    fn push(&mut self, item: T) { self.items.push(item); }
    fn pop(&mut self) -> Option<T> { self.items.pop() }
}`,
    slot: 'type-generic',
  },
  {
    id: 'rs-039',
    concept: { pt: 'Constraint de Trait', en: 'Trait Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Use trait bounds pra restringir tipos genéricos, exigindo que implementem traits específicos como Display + PartialOrd.',
      en: 'Use trait bounds to constrain generic types, requiring them to implement specific traits like Display + PartialOrd.',
    },
    code: `use std::fmt::Display;

fn print_sorted<T: Display + PartialOrd>(mut items: Vec<T>) {
    items.sort_by(|a, b| a.partial_cmp(b).unwrap());
    for item in &items {
        println!("{item}");
    }
}`,
    slot: 'type-constraint',
  },
  {
    id: 'rs-040',
    concept: { pt: 'Async/Await', en: 'Async/Await' },
    difficulty: 'hard',
    prompt: {
      pt: 'Rust suporta async/await com futures. Use async fn e .await pra operações assíncronas com tokio.',
      en: 'Rust supports async/await with futures. Use async fn and .await for asynchronous operations with tokio.',
    },
    code: `async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let body = reqwest::get(url).await?.text().await?;
    Ok(body)
}`,
    slot: 'adv-async',
  },
  {
    id: 'rs-041',
    concept: { pt: 'Pattern Matching Avançado', en: 'Advanced Pattern Matching' },
    difficulty: 'hard',
    prompt: {
      pt: 'Match em Rust suporta guards, bindings, ranges e desestruturação aninhada. Use vários estilos de pattern num mesmo match.',
      en: 'Rust match supports guards, bindings, ranges and nested destructuring. Use various pattern styles in a single match.',
    },
    code: `let value = (2, "hello");
match value {
    (0, _) => println!("zero"),
    (n, s) if n > 0 && s.len() > 3 => println!("{s} x{n}"),
    (1..=5, s) => println!("small: {s}"),
    _ => println!("other"),
}`,
    slot: 'adv-pattern',
  },
  {
    id: 'rs-042',
    concept: { pt: 'Macro Declarativa', en: 'Declarative Macro' },
    difficulty: 'hard',
    prompt: {
      pt: 'Macros declarativas (macro_rules!) geram código em tempo de compilação. Crie uma macro que simplifica a criação de um HashMap.',
      en: 'Declarative macros (macro_rules!) generate code at compile time. Create a macro that simplifies HashMap creation.',
    },
    code: `macro_rules! map {
    ($($key:expr => $val:expr),* $(,)?) => {{
        let mut m = std::collections::HashMap::new();
        $(m.insert($key, $val);)*
        m
    }};
}

let scores = map!("Ana" => 10, "Bruno" => 8);`,
    slot: 'adv-macro',
  },
  {
    id: 'rs-043',
    concept: { pt: 'Concorrência com Tokio', en: 'Concurrency with Tokio' },
    difficulty: 'hard',
    prompt: {
      pt: 'tokio::spawn dispara tasks concorrentes e tokio::join! espera múltiplas ao mesmo tempo. Use pra executar duas operações em paralelo.',
      en: 'tokio::spawn launches concurrent tasks and tokio::join! awaits multiple at once. Use them to run two operations in parallel.',
    },
    code: `use tokio;

async fn load_name() -> String { "Alice".into() }
async fn load_age() -> u32 { 30 }

#[tokio::main]
async fn main() {
    let (name, age) = tokio::join!(load_name(), load_age());
    println!("{name}, {age}");
}`,
    slot: 'adv-concurrent',
  },
]
