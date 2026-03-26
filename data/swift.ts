import { Snippet } from '@/lib/types'

export const swiftSnippets: Snippet[] = [
  {
    id: 'swift-001',
    concept: 'Variaveis',
    difficulty: 'easy',
    prompt: 'Swift usa "let" para constantes (imutaveis) e "var" para variaveis (mutaveis). Declare tres valores mostrando inferencia de tipo automatica (sem anotacao) e tipo explicito (com :Type), incluindo um Bool.',
    code: `let name = "Swift"
var version = 5.9
let isOpen: Bool = true`,
  },
  {
    id: 'swift-002',
    concept: 'String Interpolation',
    difficulty: 'easy',
    prompt: 'String interpolation em Swift usa a sintaxe \\(expressao) dentro de aspas duplas. Construa a mensagem combinando a variavel "language" (String) e "year" (Int) em uma frase — qualquer expressao Swift pode ser interpolada.',
    code: `let language = "Swift"
let year = 2014
let msg = "\\(language) foi lançado em \\(year)."`,
  },
  {
    id: 'swift-003',
    concept: 'Optional Binding',
    difficulty: 'easy',
    prompt: 'Optionals representam ausencia de valor em Swift. Use "if let" para tentar desembrulhar "email" com seguranca: se o valor existir, ele fica disponivel em "e" dentro do bloco — sem force-unwrap (!) que causaria crash se nil.',
    code: `var email: String? = "user@example.com"
if let e = email {
    print("Email: \\(e)")
}`,
  },
  {
    id: 'swift-004',
    concept: 'Array e For-In',
    difficulty: 'easy',
    prompt: 'Arrays em Swift sao fortemente tipados e declarados com literals [...]. Declare um array de strings com tres frutas e use o loop for-in para iterar sobre cada elemento e imprimi-lo.',
    code: `let fruits = ["apple", "banana", "cherry"]
for fruit in fruits {
    print(fruit)
}`,
  },
  {
    id: 'swift-005',
    concept: 'Struct',
    difficulty: 'medium',
    prompt: 'Structs em Swift sao value types (copiados na atribuicao). Defina Point com duas coordenadas Double mutaveis e implemente distance(to:) — um metodo que recebe outro Point e calcula a distancia euclidiana entre os dois.',
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
    prompt: '"guard let" e o oposto de "if let": retorna cedo se a condicao falhar, mantendo o caminho feliz sem indentacao excessiva. Valide que "name" existe e nao e vazio — retorne a saudacao padrao se qualquer condicao falhar.',
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
    prompt: 'Enums com associated values carregam dados diferentes em cada variante. Defina Result<T> com .success(T) (carregando o valor bem-sucedido) e .failure(Error) (carregando o erro), depois crie uma instancia de sucesso.',
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
    prompt: 'Closures em Swift podem ser simplificadas com $0, $1 para os parametros. Use sorted com { $0 < $1 } para ordenar um array de inteiros e map com { $0 * 2 } para dobrar cada elemento — tudo de forma concisa.',
    code: `let numbers = [3, 1, 4, 1, 5, 9]
let sorted = numbers.sorted { $0 < $1 }
let doubled = numbers.map { $0 * 2 }`,
  },
  {
    id: 'swift-009',
    concept: 'Protocol e Extension',
    difficulty: 'hard',
    prompt: 'Protocols definem interfaces; extensions adicionam funcionalidade sem modificar o tipo original. Implemente Describable em Circle com a computed property "description", depois adicione a propriedade "area" via extension separada.',
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
    prompt: '"async throws" combina assincronia e tratamento de erros em Swift. Implemente fetchUser usando try await para aguardar URLSession.shared.data(from:) e JSONDecoder().decode para desserializar o JSON em User.',
    code: `func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}`,
  },
]
