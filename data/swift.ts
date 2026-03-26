import { Snippet } from '@/lib/types'

export const swiftSnippets: Snippet[] = [
  {
    id: 'swift-001',
    concept: 'Variaveis',
    difficulty: 'easy',
    prompt: 'Declare constantes com let e variaveis com var em Swift, com tipos inferidos e explicitamente anotados.',
    code: `let name = "Swift"
var version = 5.9
let isOpen: Bool = true`,
  },
  {
    id: 'swift-002',
    concept: 'String Interpolation',
    difficulty: 'easy',
    prompt: 'Construa uma mensagem usando string interpolation com \\(expressao) em Swift.',
    code: `let language = "Swift"
let year = 2014
let msg = "\\(language) foi lançado em \\(year)."`,
  },
  {
    id: 'swift-003',
    concept: 'Optional Binding',
    difficulty: 'easy',
    prompt: 'Use if let para extrair e usar com segurança o valor de uma variavel opcional.',
    code: `var email: String? = "user@example.com"
if let e = email {
    print("Email: \\(e)")
}`,
  },
  {
    id: 'swift-004',
    concept: 'Array e For-In',
    difficulty: 'easy',
    prompt: 'Crie um array de strings e itere sobre ele com for-in para imprimir cada elemento.',
    code: `let fruits = ["apple", "banana", "cherry"]
for fruit in fruits {
    print(fruit)
}`,
  },
  {
    id: 'swift-005',
    concept: 'Struct',
    difficulty: 'medium',
    prompt: 'Defina uma struct Point com coordenadas e um metodo para calcular a distancia entre dois pontos.',
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
    concept: 'Guard Let',
    difficulty: 'medium',
    prompt: 'Use guard let para validar e desembrulhar um opcional no inicio de uma funcao, retornando cedo se invalido.',
    code: `func greet(_ name: String?) -> String {
    guard let name = name, !name.isEmpty else {
        return "Hello, stranger!"
    }
    return "Hello, \\(name)!"
}`,
  },
  {
    id: 'swift-007',
    concept: 'Enum com Associated Values',
    difficulty: 'medium',
    prompt: 'Defina um enum Result generico com variantes de sucesso e falha que carregam valores associados.',
    code: `enum Result<T> {
    case success(T)
    case failure(Error)
}

let result: Result<Int> = .success(42)`,
  },
  {
    id: 'swift-008',
    concept: 'Closure',
    difficulty: 'medium',
    prompt: 'Use closures com sintaxe de argumento $0/$1 para ordenar e transformar um array de inteiros.',
    code: `let numbers = [3, 1, 4, 1, 5, 9]
let sorted = numbers.sorted { $0 < $1 }
let doubled = numbers.map { $0 * 2 }`,
  },
  {
    id: 'swift-009',
    concept: 'Protocol e Extension',
    difficulty: 'hard',
    prompt: 'Defina um protocol Describable, implemente-o em um struct e adicione propriedades via extension.',
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
    concept: 'Async/Await',
    difficulty: 'hard',
    prompt: 'Escreva uma funcao async throws para buscar e decodificar dados de uma URL usando URLSession.',
    code: `func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}`,
  },
]
