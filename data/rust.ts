import { Snippet } from '@/lib/types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rs-001',
    concept: { pt: 'Function com Tipos', en: 'Function with Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Rust, todo tipo de parâmetro e de retorno precisa ser declarado explicitamente. Escreva a função "add" recebendo dois i32 e retornando i32 -- o compilador não infere tipo de função pública.',
      en: 'In Rust, all parameter and return types must be declared explicitly. Write the "add" function that takes two i32 parameters and returns an i32 -- the compiler doesn\'t infer types for public functions.',
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
      pt: 'Em Rust, mover um valor transfere o ownership -- depois disso, a variável original fica inválida. Use .clone() pra criar uma cópia independente de s1 em s2, permitindo usar as duas sem violar o sistema de ownership.',
      en: 'In Rust, moving a value transfers its ownership -- after that, the original variable becomes invalid. Use .clone() to create an independent copy of s1 into s2, allowing both to be used without violating the ownership system.',
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
      pt: 'O match em Rust é exaustivo: o compilador obriga você a cobrir todos os casos possíveis. Use pra tratar cada variante de Status -- incluindo Inactive(reason) que tem dado associado -- e um wildcard _ pro restante.',
      en: 'Match in Rust is exhaustive: the compiler requires all possible cases to be covered. Use it to handle each Status variant -- including the one with associated data Inactive(reason) -- and a wildcard _ for the rest.',
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
      pt: 'Option<T> representa um valor que pode ou não existir -- é o substituto seguro do null em Rust. Implemente find_user retornando Some(String) pra id == 1 e None pra qualquer outro -- nada de null, -1 ou valor sentinela.',
      en: 'Option<T> represents a value that may or may not exist, safely replacing null in Rust. Implement find_user returning Some(String) for id == 1 and None for anything else -- no null, -1, or sentinel values.',
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
]
