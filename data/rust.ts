import { Snippet } from '@/lib/types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rs-001',
    concept: { pt: 'Function com Tipos', en: 'Function with Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Rust, todos os tipos de parâmetros e de retorno devem ser declarados explicitamente. Escreva a função "add" que recebe dois parâmetros i32 e retorna um i32 — o compilador não infere tipos de funções públicas.',
      en: 'In Rust, all parameter and return types must be declared explicitly. Write the "add" function that takes two i32 parameters and returns an i32 — the compiler doesn\'t infer types for public functions.',
    },
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
  },
  {
    id: 'rs-002',
    concept: { pt: 'Ownership', en: 'Ownership' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Rust, mover um valor transfere sua propriedade — após isso, a variável original se torna inválida. Use .clone() para criar uma cópia independente de s1 em s2, permitindo usar ambas sem violar o sistema de ownership.',
      en: 'In Rust, moving a value transfers its ownership — after that, the original variable becomes invalid. Use .clone() to create an independent copy of s1 into s2, allowing both to be used without violating the ownership system.',
    },
    code: `let s1 = String::from("hello");
let s2 = s1.clone();
println!("{s1} and {s2}");`,
  },
  {
    id: 'rs-003',
    concept: { pt: 'Pattern Matching', en: 'Pattern Matching' },
    difficulty: 'medium',
    prompt: {
      pt: 'Match em Rust é exaustivo: o compilador exige que todos os casos possíveis sejam cobertos. Use-o para tratar cada variante de Status — incluindo a variante com dado associado Inactive(reason) — e um wildcard _ para o restante.',
      en: 'Match in Rust is exhaustive: the compiler requires all possible cases to be covered. Use it to handle each Status variant — including the one with associated data Inactive(reason) — and a wildcard _ for the rest.',
    },
    code: `match status {
    Status::Active => println!("active"),
    Status::Inactive(reason) => println!("{reason}"),
    _ => println!("unknown"),
}`,
  },
  {
    id: 'rs-004',
    concept: { pt: 'Option', en: 'Option' },
    difficulty: 'medium',
    prompt: {
      pt: 'Option<T> representa um valor que pode ou não existir, substituindo null de forma segura em Rust. Implemente find_user retornando Some(String) para id == 1 e None para qualquer outro — sem usar null, -1 ou valores sentinela.',
      en: 'Option<T> represents a value that may or may not exist, safely replacing null in Rust. Implement find_user returning Some(String) for id == 1 and None for anything else — no null, -1, or sentinel values.',
    },
    code: `fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("Alice"))
    } else {
        None
    }
}`,
  },
  {
    id: 'rs-005',
    concept: { pt: 'Result', en: 'Result' },
    difficulty: 'medium',
    prompt: {
      pt: 'Result<T, E> representa sucesso (Ok) ou falha (Err) de uma operação. Implemente parse_number que tenta converter &str em i32 usando .parse(), mapeando o erro de parse para uma String descritiva com .map_err.',
      en: 'Result<T, E> represents success (Ok) or failure (Err) of an operation. Implement parse_number that tries to convert &str to i32 using .parse(), mapping the parse error to a descriptive String with .map_err.',
    },
    code: `fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>()
        .map_err(|e| format!("Parse error: {e}"))
}`,
  },
  {
    id: 'rs-006',
    concept: { pt: 'Struct com Impl', en: 'Struct with Impl' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structs agrupam dados relacionados; blocos impl adicionam comportamento a elas. Defina Rectangle com largura e altura como f64, depois implemente o método area(&self) no bloco impl que retorna o produto dos dois campos.',
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
  },
  {
    id: 'rs-007',
    concept: { pt: 'Operações com Vec', en: 'Vec Operations' },
    difficulty: 'easy',
    prompt: {
      pt: 'Vec<T> é o array dinâmico do Rust. Crie um Vec<i32> vazio com Vec::new(), adicione dois elementos com .push() e calcule a soma de todos os elementos de forma idiomática com o método iterador .sum().',
      en: 'Vec<T> is Rust\'s dynamic array. Create an empty Vec<i32> with Vec::new(), add two elements with .push(), and calculate the sum of all elements idiomatically using the .sum() iterator method.',
    },
    code: `let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
let sum: i32 = v.iter().sum();`,
  },
  {
    id: 'rs-008',
    concept: { pt: 'Closure com Move', en: 'Closure with Move' },
    difficulty: 'hard',
    prompt: {
      pt: 'Closures com "move" capturam o ambiente transferindo o ownership das variáveis capturadas. Capture a String "name" por move dentro de "greet", permitindo que a closure seja usada mesmo após o escopo original encerrar.',
      en: 'Closures with "move" capture the environment by transferring ownership of captured variables. Capture the String "name" by move into "greet", allowing the closure to be used even after the original scope ends.',
    },
    code: `let name = String::from("Alice");
let greet = move || {
    println!("Hello, {name}!");
};
greet();`,
  },
  {
    id: 'rs-009',
    concept: { pt: 'Borrowing', en: 'Borrowing' },
    difficulty: 'easy',
    prompt: {
      pt: 'Borrowing permite referências sem transferir ownership. Implemente first_word recebendo uma &str (referência emprestada) e retornando uma &str que aponta para a primeira palavra do mesmo buffer sem alocar nova memória.',
      en: 'Borrowing allows references without transferring ownership. Implement first_word taking a &str (borrowed reference) and returning a &str that points to the first word of the same buffer without allocating new memory.',
    },
    code: `fn first_word(s: &str) -> &str {
    &s[..s.find(' ').unwrap_or(s.len())]
}`,
  },
  {
    id: 'rs-010',
    concept: { pt: 'Enum', en: 'Enum' },
    difficulty: 'hard',
    prompt: {
      pt: 'Enums em Rust podem carregar dados de tipos diferentes em cada variante. Defina Command com quatro variantes: Quit (sem dados), Echo(String) (tupla), Move { x, y } (struct anônima) e Color(u8, u8, u8) (tupla de três bytes).',
      en: 'Enums in Rust can carry different data types in each variant. Define Command with four variants: Quit (no data), Echo(String) (tuple), Move { x, y } (anonymous struct), and Color(u8, u8, u8) (three-byte tuple).',
    },
    code: `enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}`,
  },
]
