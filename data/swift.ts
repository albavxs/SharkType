import { Snippet } from '@/lib/types'

export const swiftSnippets: Snippet[] = [
  {
    id: 'swift-001',
    concept: { pt: 'Variáveis', en: 'Variables' },
    difficulty: 'easy',
    prompt: {
      pt: 'Swift usa "let" para constantes (imutáveis) e "var" para variáveis (mutáveis). Declare três valores mostrando inferência de tipo automática (sem anotação) e tipo explícito (com :Type), incluindo um Bool.',
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
      pt: 'String interpolation em Swift usa a sintaxe \\(expressão) dentro de aspas duplas. Construa a mensagem combinando a variável "language" (String) e "year" (Int) em uma frase — qualquer expressão Swift pode ser interpolada.',
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
      pt: 'Optionals representam ausência de valor em Swift. Use "if let" para tentar desembrulhar "email" com segurança: se o valor existir, ele fica disponível em "e" dentro do bloco — sem force-unwrap (!) que causaria crash se nil.',
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
      pt: 'Arrays em Swift são fortemente tipados e declarados com literals [...]. Declare um array de strings com três frutas e use o loop for-in para iterar sobre cada elemento e imprimi-lo.',
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
      pt: 'Structs em Swift são value types (copiados na atribuição). Defina Point com duas coordenadas Double mutáveis e implemente distance(to:) — um método que recebe outro Point e calcula a distância euclidiana entre os dois.',
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
      pt: '"guard let" é o oposto de "if let": retorna cedo se a condição falhar, mantendo o caminho feliz sem indentação excessiva. Valide que "name" existe e não é vazio — retorne a saudação padrão se qualquer condição falhar.',
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
      pt: 'Enums com associated values carregam dados diferentes em cada variante. Defina Result<T> com .success(T) (carregando o valor bem-sucedido) e .failure(Error) (carregando o erro), depois crie uma instância de sucesso.',
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
      pt: 'Closures em Swift podem ser simplificadas com $0, $1 para os parâmetros. Use sorted com { $0 < $1 } para ordenar um array de inteiros e map com { $0 * 2 } para dobrar cada elemento — tudo de forma concisa.',
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
      pt: 'Protocols definem interfaces; extensions adicionam funcionalidade sem modificar o tipo original. Implemente Describable em Circle com a computed property "description", depois adicione a propriedade "area" via extension separada.',
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
      pt: '"async throws" combina assincronia e tratamento de erros em Swift. Implemente fetchUser usando try await para aguardar URLSession.shared.data(from:) e JSONDecoder().decode para desserializar o JSON em User.',
      en: '"async throws" combines asynchrony and error handling in Swift. Implement fetchUser using try await to wait for URLSession.shared.data(from:) and JSONDecoder().decode to deserialize the JSON into User.',
    },
    code: `func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}`,
  },
]
