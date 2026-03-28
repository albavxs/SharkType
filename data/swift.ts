import { Snippet } from '@/lib/types'

export const swiftSnippets: Snippet[] = [
  {
    id: 'swift-001',
    concept: { pt: 'Variáveis', en: 'Variables' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Swift, "let" é pra constantes (imutáveis) e "var" pra variáveis (mutáveis). Declare três valores mostrando inferência de tipo automática (sem anotação) e tipo explícito (com :Type), incluindo um Bool.',
      en: 'Swift uses "let" for constants (immutable) and "var" for variables (mutable). Declare three values showing automatic type inference (no annotation) and explicit type (with :Type), including a Bool.',
    },
    code: `let name = "Swift"
var version = 5.9
let isOpen: Bool = true`,
  },
  {
    id: 'swift-002',
    concept: { pt: 'String Interpolation', en: 'String Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'String interpolation em Swift usa \\(expressão) dentro de aspas duplas. Monte a mensagem juntando a variável "language" (String) e "year" (Int) numa frase — qualquer expressão Swift pode entrar ali dentro.',
      en: 'Swift string interpolation uses the \\(expression) syntax inside double quotes. Build the message by combining the "language" (String) and "year" (Int) variables into a sentence — any Swift expression can be interpolated.',
    },
    code: `let language = "Swift"
let year = 2014
let msg = "\\(language) foi lançado em \\(year)."`,
  },
  {
    id: 'swift-003',
    concept: { pt: 'Optional Binding', en: 'Optional Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'Optionals representam a ausência de valor em Swift. Use "if let" pra desembrulhar "email" com segurança: se o valor existir, fica disponível como "e" dentro do bloco — nada de force-unwrap (!) que dá crash se for nil.',
      en: 'Optionals represent the absence of a value in Swift. Use "if let" to safely unwrap "email": if the value exists, it becomes available as "e" inside the block — no force-unwrap (!) which would crash on nil.',
    },
    code: `var email: String? = "user@example.com"
if let e = email {
    print("Email: \\(e)")
}`,
  },
  {
    id: 'swift-004',
    concept: { pt: 'Array e For-In', en: 'Array and For-In' },
    difficulty: 'easy',
    prompt: {
      pt: 'Arrays em Swift são fortemente tipados e declarados com [...]. Declare um array de strings com três frutas e use o loop for-in pra percorrer cada elemento e dar print.',
      en: 'Swift arrays are strongly typed and declared with [...] literals. Declare a string array with three fruits and use the for-in loop to iterate over each element and print it.',
    },
    code: `let fruits = ["apple", "banana", "cherry"]
for fruit in fruits {
    print(fruit)
}`,
  },
  {
    id: 'swift-005',
    concept: { pt: 'Struct', en: 'Struct' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structs em Swift são value types (copiados na atribuição). Defina Point com duas coordenadas Double mutáveis e crie distance(to:) — um método que recebe outro Point e calcula a distância euclidiana entre os dois.',
      en: 'Swift structs are value types (copied on assignment). Define Point with two mutable Double coordinates and implement distance(to:) — a method that takes another Point and calculates the Euclidean distance between them.',
    },
    code: `struct Point {
    var x: Double
    var y: Double
    func distance(to other: Point) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        return (dx * dx + dy * dy).squareRoot()
    }
}`,
  },
  {
    id: 'swift-006',
    concept: { pt: 'Guard Let', en: 'Guard Let' },
    difficulty: 'medium',
    prompt: {
      pt: '"guard let" é o inverso de "if let": sai cedo se a condição falhar, deixando o happy path sem indentação maluca. Valide que "name" existe e não tá vazio — retorne a saudação padrão se qualquer condição falhar.',
      en: '"guard let" is the opposite of "if let": it returns early if the condition fails, keeping the happy path without excessive indentation. Validate that "name" exists and is not empty — return the default greeting if either condition fails.',
    },
    code: `func greet(_ name: String?) -> String {
    guard let name = name, !name.isEmpty else {
        return "Hello, stranger!"
    }
    return "Hello, \\(name)!"
}`,
  },
  {
    id: 'swift-007',
    concept: { pt: 'Enum com Associated Values', en: 'Enum with Associated Values' },
    difficulty: 'medium',
    prompt: {
      pt: 'Enums com associated values guardam dados diferentes em cada variante. Defina Result<T> com .success(T) (trazendo o valor de sucesso) e .failure(Error) (trazendo o erro), e depois crie uma instância de sucesso.',
      en: 'Enums with associated values carry different data in each variant. Define Result<T> with .success(T) (carrying the successful value) and .failure(Error) (carrying the error), then create a success instance.',
    },
    code: `enum Result<T> {
    case success(T)
    case failure(Error)
}

let result: Result<Int> = .success(42)`,
  },
  {
    id: 'swift-008',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures em Swift ficam bem enxutas usando $0, $1 pros parâmetros. Use sorted com { $0 < $1 } pra ordenar um array de inteiros e map com { $0 * 2 } pra dobrar cada elemento — tudo bem direto.',
      en: 'Swift closures can be simplified with $0, $1 for parameters. Use sorted with { $0 < $1 } to sort an integer array and map with { $0 * 2 } to double each element — all in a concise way.',
    },
    code: `let numbers = [3, 1, 4, 1, 5, 9]
let sorted = numbers.sorted { $0 < $1 }
let doubled = numbers.map { $0 * 2 }`,
  },
  {
    id: 'swift-009',
    concept: { pt: 'Protocol e Extension', en: 'Protocol and Extension' },
    difficulty: 'hard',
    prompt: {
      pt: 'Protocols definem interfaces; extensions adicionam funcionalidade sem mexer no tipo original. Implemente Describable em Circle com a computed property "description", e depois adicione "area" via extension separada.',
      en: 'Protocols define interfaces; extensions add functionality without modifying the original type. Implement Describable on Circle with the "description" computed property, then add the "area" property via a separate extension.',
    },
    code: `protocol Describable {
    var description: String { get }
}

struct Circle: Describable {
    var radius: Double
    var description: String {
        return "Circle with radius \\(radius)"
    }
}

extension Circle {
    var area: Double { .pi * radius * radius }
}`,
  },
  {
    id: 'swift-010',
    concept: { pt: 'Async/Await', en: 'Async/Await' },
    difficulty: 'hard',
    prompt: {
      pt: '"async throws" junta assincronia e tratamento de erro em Swift. Monte fetchUser usando try await pra aguardar URLSession.shared.data(from:) e JSONDecoder().decode pra desserializar o JSON em User.',
      en: '"async throws" combines asynchrony and error handling in Swift. Implement fetchUser using try await to wait for URLSession.shared.data(from:) and JSONDecoder().decode to deserialize the JSON into User.',
    },
    code: `func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}`,
  },
]
