import { Snippet } from '@/lib/types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rs-001',
    concept: 'Function with Types',
    difficulty: 'easy',
    prompt: 'Defina uma funcao Rust que recebe dois inteiros e retorna a soma, com todos os tipos anotados.',
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}`,
  },
  {
    id: 'rs-002',
    concept: 'Ownership',
    difficulty: 'medium',
    prompt: 'Use clone para copiar uma String sem transferir a propriedade, permitindo usar ambas as variaveis.',
    code: `let s1 = String::from("hello");
let s2 = s1.clone();
println!("{s1} and {s2}");`,
  },
  {
    id: 'rs-003',
    concept: 'Pattern Matching',
    difficulty: 'medium',
    prompt: 'Use match para tratar cada variante de um enum Status de forma especifica, incluindo dados associados.',
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
    prompt: 'Implemente uma funcao que retorna Option<String> para representar um resultado que pode nao existir.',
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
    prompt: 'Escreva uma funcao que retorna Result para tratar o erro de conversao de string para numero.',
    code: `fn parse_number(s: &str) -> Result<i32, String> {
    s.parse::<i32>()
        .map_err(|e| format!("Parse error: {e}"))
}`,
  },
  {
    id: 'rs-006',
    concept: 'Struct with Impl',
    difficulty: 'medium',
    prompt: 'Defina uma struct Rectangle e implemente um metodo area no bloco impl.',
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
    prompt: 'Crie um Vec vazio, adicione elementos e calcule a soma total usando iterator.',
    code: `let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
let sum: i32 = v.iter().sum();`,
  },
  {
    id: 'rs-008',
    concept: 'Closure with Move',
    difficulty: 'hard',
    prompt: 'Crie uma closure que captura uma String por move e a usa internamente ao ser chamada.',
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
    prompt: 'Escreva uma funcao que recebe uma referencia a string e retorna a primeira palavra sem alocar memoria.',
    code: `fn first_word(s: &str) -> &str {
    &s[..s.find(' ').unwrap_or(s.len())]
}`,
  },
  {
    id: 'rs-010',
    concept: 'Enum',
    difficulty: 'hard',
    prompt: 'Defina um enum Command com variantes que carregam diferentes tipos de dados associados.',
    code: `enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}`,
  },
]
