import { Snippet } from '@/lib/types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rs-001',
    concept: 'Function with Types',
    difficulty: 'easy',
    prompt: 'Em Rust, todos os tipos de parametros e de retorno devem ser declarados explicitamente. Escreva a funcao "add" que recebe dois parametros i32 e retorna um i32 — o compilador nao infere tipos de funcoes publicas.',
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
  },
  {
    id: 'rs-002',
    concept: 'Ownership',
    difficulty: 'medium',
    prompt: 'Em Rust, mover um valor transfere sua propriedade — apos isso, a variavel original se torna invalida. Use .clone() para criar uma copia independente de s1 em s2, permitindo usar ambas sem violar o sistema de ownership.',
    code: `let s1 = String::from("hello");
let s2 = s1.clone();
println!("{s1} and {s2}");`,
  },
  {
    id: 'rs-003',
    concept: 'Pattern Matching',
    difficulty: 'medium',
    prompt: 'Match em Rust e exaustivo: o compilador exige que todos os casos possiveis sejam cobertos. Use-o para tratar cada variante de Status — incluindo a variante com dado associado Inactive(reason) — e um wildcard _ para o restante.',
    code: `match status {
    Status::Active => println!("active"),
    Status::Inactive(reason) => println!("{reason}"),
    _ => println!("unknown"),
}`,
  },
  {
    id: 'rs-004',
    concept: 'Option',
    difficulty: 'medium',
    prompt: 'Option<T> representa um valor que pode ou nao existir, substituindo null de forma segura em Rust. Implemente find_user retornando Some(String) para id == 1 e None para qualquer outro — sem usar null, -1 ou valores sentinela.',
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
    concept: 'Result',
    difficulty: 'medium',
    prompt: 'Result<T, E> representa sucesso (Ok) ou falha (Err) de uma operacao. Implemente parse_number que tenta converter &str em i32 usando .parse(), mapeando o erro de parse para uma String descritiva com .map_err.',
    code: `fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>()
        .map_err(|e| format!("Parse error: {e}"))
}`,
  },
  {
    id: 'rs-006',
    concept: 'Struct with Impl',
    difficulty: 'medium',
    prompt: 'Structs agrupam dados relacionados; blocos impl adicionam comportamento a elas. Defina Rectangle com largura e altura como f64, depois implemente o metodo area(&self) no bloco impl que retorna o produto dos dois campos.',
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
    concept: 'Vec Operations',
    difficulty: 'easy',
    prompt: 'Vec<T> e o array dinamico do Rust. Crie um Vec<i32> vazio com Vec::new(), adicione dois elementos com .push() e calcule a soma de todos os elementos de forma idiomatica com o metodo iterador .sum().',
    code: `let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
let sum: i32 = v.iter().sum();`,
  },
  {
    id: 'rs-008',
    concept: 'Closure with Move',
    difficulty: 'hard',
    prompt: 'Closures com "move" capturam o ambiente transferindo o ownership das variaveis capturadas. Capture a String "name" por move dentro de "greet", permitindo que a closure seja usada mesmo apos o escopo original encerrar.',
    code: `let name = String::from("Alice");
let greet = move || {
    println!("Hello, {name}!");
};
greet();`,
  },
  {
    id: 'rs-009',
    concept: 'Borrowing',
    difficulty: 'easy',
    prompt: 'Borrowing permite referencias sem transferir ownership. Implemente first_word recebendo uma &str (referencia emprestada) e retornando uma &str que aponta para a primeira palavra do mesmo buffer sem alocar nova memoria.',
    code: `fn first_word(s: &str) -> &str {
    &s[..s.find(' ').unwrap_or(s.len())]
}`,
  },
  {
    id: 'rs-010',
    concept: 'Enum',
    difficulty: 'hard',
    prompt: 'Enums em Rust podem carregar dados de tipos diferentes em cada variante. Defina Command com quatro variantes: Quit (sem dados), Echo(String) (tupla), Move { x, y } (struct anonima) e Color(u8, u8, u8) (tupla de tres bytes).',
    code: `enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}`,
  },
]
