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
    slot: 'var-declare',
  },
  {
    id: 'swift-002',
    concept: { pt: 'Interpolação de String', en: 'String Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'String interpolation em Swift usa \\(expressão) dentro de aspas duplas. Monte a mensagem juntando a variável "language" (String) e "year" (Int) numa frase — qualquer expressão Swift pode entrar ali dentro.',
      en: 'Swift string interpolation uses the \\(expression) syntax inside double quotes. Build the message by combining the "language" (String) and "year" (Int) variables into a sentence — any Swift expression can be interpolated.',
    },
    code: `let language = "Swift"
let year = 2014
let msg = "\\(language) foi lançado em \\(year)."`,
    slot: 'var-interpolation',
  },
  {
    id: 'swift-003',
    concept: { pt: 'Vinculação Opcional', en: 'Optional Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'Optionals representam a ausência de valor em Swift. Use "if let" pra desembrulhar "email" com segurança: se o valor existir, fica disponível como "e" dentro do bloco — nada de force-unwrap (!) que dá crash se for nil.',
      en: 'Optionals represent the absence of a value in Swift. Use "if let" to safely unwrap "email": if the value exists, it becomes available as "e" inside the block — no force-unwrap (!) which would crash on nil.',
    },
    code: `var email: String? = "user@example.com"
if let e = email {
    print("Email: \\(e)")
}`,
    slot: 'cond-basic-if',
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
    slot: 'loop-foreach',
  },
  {
    id: 'swift-005',
    concept: { pt: 'Estrutura', en: 'Struct' },
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
    slot: 'obj-create',
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
    slot: 'cond-guard',
  },
  {
    id: 'swift-007',
    concept: { pt: 'Enumeração com Valores Associados', en: 'Enum with Associated Values' },
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
    slot: 'err-result',
  },
  {
    id: 'swift-008',
    concept: { pt: 'Clausura', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures em Swift ficam bem enxutas usando $0, $1 pros parâmetros. Use sorted com { $0 < $1 } pra ordenar um array de inteiros e map com { $0 * 2 } pra dobrar cada elemento — tudo bem direto.',
      en: 'Swift closures can be simplified with $0, $1 for parameters. Use sorted with { $0 < $1 } to sort an integer array and map with { $0 * 2 } to double each element — all in a concise way.',
    },
    code: `let numbers = [3, 1, 4, 1, 5, 9]
let sorted = numbers.sorted { $0 < $1 }
let doubled = numbers.map { $0 * 2 }`,
    slot: 'fn-closure',
  },
  {
    id: 'swift-009',
    concept: { pt: 'Protocolo e Extensão', en: 'Protocol and Extension' },
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
    slot: 'obj-interface',
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
    slot: 'adv-async',
  },
  // ── NEW SNIPPETS ──
  {
    id: 'swift-011',
    concept: { pt: 'If-Else', en: 'If-Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'Use if-else pra checar se um número é positivo, negativo ou zero e atribuir o resultado a uma constante.',
      en: 'Use if-else to check whether a number is positive, negative or zero and assign the result to a constant.',
    },
    code: `let n = -3
let label: String
if n > 0 {
    label = "positivo"
} else if n < 0 {
    label = "negativo"
} else {
    label = "zero"
}`,
    slot: 'cond-if-else',
  },
  {
    id: 'swift-012',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'Swift tem o operador ternário clássico "condição ? verdadeiro : falso". Use pra escolher um texto com base numa condição.',
      en: 'Swift has the classic ternary operator "condition ? true : false". Use it to choose a text based on a condition.',
    },
    code: `let age = 20
let status = age >= 18 ? "adulto" : "menor"
print(status)`,
    slot: 'cond-ternary',
  },
  {
    id: 'swift-013',
    concept: { pt: 'Switch', en: 'Switch' },
    difficulty: 'easy',
    prompt: {
      pt: 'O switch em Swift é exaustivo e não precisa de break. Use com ranges e default pra classificar uma nota.',
      en: 'Switch in Swift is exhaustive and does not need break. Use it with ranges and default to classify a grade.',
    },
    code: `let grade = 85
switch grade {
case 90...100: print("A")
case 80..<90:  print("B")
case 70..<80:  print("C")
default:       print("F")
}`,
    slot: 'cond-switch',
  },
  {
    id: 'swift-014',
    concept: { pt: 'Constante com Let', en: 'Constant with Let' },
    difficulty: 'easy',
    prompt: {
      pt: '"let" cria uma constante que não pode ser reatribuída. Declare constantes de tipos diferentes pra mostrar a imutabilidade.',
      en: '"let" creates a constant that cannot be reassigned. Declare constants of different types to show immutability.',
    },
    code: `let maxRetries = 3
let apiUrl = "https://api.example.com"
let pi = 3.14159`,
    slot: 'var-const',
  },
  {
    id: 'swift-015',
    concept: { pt: 'Tipos Básicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Swift tem tipos explícitos como Int, Double, String e Bool. Declare variáveis com tipo explícito e use conversão entre eles.',
      en: 'Swift has explicit types like Int, Double, String and Bool. Declare variables with explicit types and use conversion between them.',
    },
    code: `let count: Int = 42
let ratio: Double = Double(count) / 7.0
let active: Bool = true
let label: String = "Total: \\(count)"`,
    slot: 'var-types',
  },
  {
    id: 'swift-016',
    concept: { pt: 'Array', en: 'Array' },
    difficulty: 'easy',
    prompt: {
      pt: 'Arrays em Swift são tipados e mutáveis com "var". Crie um array, adicione elementos e acesse por índice.',
      en: 'Swift arrays are typed and mutable with "var". Create an array, add elements and access by index.',
    },
    code: `var nums = [1, 2, 3]
nums.append(4)
nums.insert(0, at: 0)
print(nums[2])`,
    slot: 'var-array',
  },
  {
    id: 'swift-017',
    concept: { pt: 'Desestruturação com Tupla', en: 'Tuple Destructuring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Tuplas permitem agrupar e desestruturar múltiplos valores de uma vez. Extraia os componentes de uma tupla em variáveis separadas.',
      en: 'Tuples allow grouping and destructuring multiple values at once. Extract the components of a tuple into separate variables.',
    },
    code: `let point = (x: 3.0, y: 7.0)
let (x, y) = point
print("(\\(x), \\(y))")

let (name, age) = ("Alice", 30)`,
    slot: 'var-destructure',
  },
  {
    id: 'swift-018',
    concept: { pt: 'Função Básica', en: 'Basic Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Funções em Swift usam "func" com argument labels e return type explícito. Crie uma função com dois parâmetros e retorno.',
      en: 'Swift functions use "func" with argument labels and explicit return type. Create a function with two parameters and a return value.',
    },
    code: `func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

let result = add(3, 5)`,
    slot: 'fn-basic',
  },
  {
    id: 'swift-019',
    concept: { pt: 'Closure como Variável', en: 'Closure as Variable' },
    difficulty: 'easy',
    prompt: {
      pt: 'Closures podem ser atribuídas a variáveis com sintaxe parecida com arrow functions. Defina uma closure tipada e a invoque.',
      en: 'Closures can be assigned to variables with syntax similar to arrow functions. Define a typed closure and invoke it.',
    },
    code: `let square: (Int) -> Int = { n in
    return n * n
}

let result = square(5)
print(result)`,
    slot: 'fn-arrow',
  },
  {
    id: 'swift-020',
    concept: { pt: 'Callback com Closure', en: 'Callback with Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures são muito usadas como callbacks em Swift. Crie uma função que aceita uma closure como parâmetro pra processar um resultado.',
      en: 'Closures are commonly used as callbacks in Swift. Create a function that accepts a closure parameter to process a result.',
    },
    code: `func fetchData(completion: (String) -> Void) {
    let data = "resposta do servidor"
    completion(data)
}

fetchData { result in
    print("Recebido: \\(result)")
}`,
    slot: 'fn-callback',
  },
  {
    id: 'swift-021',
    concept: { pt: 'Parâmetros Padrão', en: 'Default Parameters' },
    difficulty: 'easy',
    prompt: {
      pt: 'Parâmetros com valor padrão tornam argumentos opcionais. Defina uma função com parâmetro padrão e chame de duas formas.',
      en: 'Default parameter values make arguments optional. Define a function with a default parameter and call it both ways.',
    },
    code: `func greet(_ name: String, greeting: String = "Olá") -> String {
    return "\\(greeting), \\(name)!"
}

print(greet("Ana"))
print(greet("Ana", greeting: "Bom dia"))`,
    slot: 'fn-default-params',
  },
  {
    id: 'swift-022',
    concept: { pt: 'Loop For com Range', en: 'For Loop with Range' },
    difficulty: 'easy',
    prompt: {
      pt: 'Use for-in com range fechado (...) e semi-aberto (..<) pra iterar sobre sequências numéricas em Swift.',
      en: 'Use for-in with closed range (...) and half-open range (..<) to iterate over numeric sequences in Swift.',
    },
    code: `for i in 1...5 {
    print(i, terminator: " ")
}
for i in stride(from: 0, to: 10, by: 2) {
    print(i, terminator: " ")
}`,
    slot: 'loop-for',
  },
  {
    id: 'swift-023',
    concept: { pt: 'Loop While', en: 'While Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'While repete enquanto a condição for verdadeira. Conte de 1 até 5 usando while com um contador.',
      en: 'While repeats as long as the condition is true. Count from 1 to 5 using while with a counter.',
    },
    code: `var i = 1
while i <= 5 {
    print(i)
    i += 1
}`,
    slot: 'loop-while',
  },
  {
    id: 'swift-024',
    concept: { pt: 'Filter', en: 'Filter' },
    difficulty: 'easy',
    prompt: {
      pt: 'filter e map são métodos funcionais de Array em Swift. Filtre os pares e dobre cada um.',
      en: 'filter and map are functional Array methods in Swift. Filter the even numbers and double each one.',
    },
    code: `let nums = [1, 2, 3, 4, 5, 6]
let result = nums.filter { $0 % 2 == 0 }.map { $0 * 2 }
print(result)`,
    slot: 'loop-filter',
  },
  {
    id: 'swift-025',
    concept: { pt: 'Range', en: 'Range' },
    difficulty: 'easy',
    prompt: {
      pt: 'Ranges em Swift podem ser fechados (...) ou semi-abertos (..<). Converta ranges em arrays e use contains pra checar pertinência.',
      en: 'Swift ranges can be closed (...) or half-open (..<). Convert ranges to arrays and use contains to check membership.',
    },
    code: `let closed = Array(1...5)
let half = Array(0..<5)
let inRange = (1...100).contains(42)
print(closed, half, inRange)`,
    slot: 'loop-range',
  },
  {
    id: 'swift-026',
    concept: { pt: 'Métodos de Struct', en: 'Struct Methods' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structs podem ter métodos. Use "mutating" pra métodos que alteram propriedades do value type.',
      en: 'Structs can have methods. Use "mutating" for methods that change properties of the value type.',
    },
    code: `struct Counter {
    var count = 0
    mutating func increment() { count += 1 }
    func display() -> String { "Count: \\(count)" }
}

var c = Counter()
c.increment()
print(c.display())`,
    slot: 'obj-methods',
  },
  {
    id: 'swift-027',
    concept: { pt: 'Struct Aninhada', en: 'Nested Struct' },
    difficulty: 'medium',
    prompt: {
      pt: 'Structs podem ser aninhadas dentro de outras structs ou classes. Use tipos aninhados pra organizar modelos relacionados.',
      en: 'Structs can be nested inside other structs or classes. Use nested types to organize related models.',
    },
    code: `struct Company {
    let name: String
    var ceo: Person

    struct Person {
        let name: String
        let role: String
    }
}

let co = Company(name: "Acme", ceo: .init(name: "Ana", role: "CEO"))`,
    slot: 'obj-nested',
  },
  {
    id: 'swift-028',
    concept: { pt: 'Herança de Classe', en: 'Class Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classes em Swift suportam herança. Use "override" pra sobrescrever métodos da classe base.',
      en: 'Swift classes support inheritance. Use "override" to override methods from the base class.',
    },
    code: `class Animal {
    let name: String
    init(name: String) { self.name = name }
    func sound() -> String { "..." }
}

class Dog: Animal {
    override func sound() -> String { "Woof!" }
}`,
    slot: 'class-basic',
  },
  {
    id: 'swift-029',
    concept: { pt: 'Herança com Super', en: 'Inheritance with Super' },
    difficulty: 'medium',
    prompt: {
      pt: 'Use "super" pra chamar a implementação da classe base e estender comportamento na subclasse.',
      en: 'Use "super" to call the base class implementation and extend behavior in the subclass.',
    },
    code: `class Vehicle {
    var speed = 0
    func describe() -> String { "\\(speed) km/h" }
}

class Car: Vehicle {
    var gear = 1
    override func describe() -> String {
        "\\(super.describe()) in gear \\(gear)"
    }
}`,
    slot: 'class-inherit',
  },
  {
    id: 'swift-030',
    concept: { pt: 'Override de Método', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Override permite especializar computed properties e métodos herdados. Sobrescreva uma computed property da classe base.',
      en: 'Override lets you specialize inherited computed properties and methods. Override a computed property from the base class.',
    },
    code: `class Shape {
    func area() -> Double { 0 }
    var description: String { "Shape" }
}

class Circle: Shape {
    let radius: Double
    init(radius: Double) { self.radius = radius }
    override func area() -> Double { .pi * radius * radius }
    override var description: String { "Circle r=\\(radius)" }
}`,
    slot: 'class-override',
  },
  {
    id: 'swift-031',
    concept: { pt: 'Protocolo como Classe Abstrata', en: 'Protocol as Abstract Class' },
    difficulty: 'hard',
    prompt: {
      pt: 'Swift não tem classes abstratas, mas protocolos com extensões padrão servem pro mesmo propósito. Defina um protocolo com implementação padrão parcial.',
      en: 'Swift has no abstract classes, but protocols with default extensions serve the same purpose. Define a protocol with partial default implementation.',
    },
    code: `protocol Logger {
    func write(_ msg: String)
}

extension Logger {
    func log(_ msg: String) {
        write("[LOG] \\(msg)")
    }
}

struct ConsoleLogger: Logger {
    func write(_ msg: String) { print(msg) }
}`,
    slot: 'class-abstract',
  },
  {
    id: 'swift-032',
    concept: { pt: 'Do-Catch', en: 'Do-Catch' },
    difficulty: 'medium',
    prompt: {
      pt: 'Do-catch é o try-catch do Swift. Use "try" dentro de "do" e capture o erro no bloco "catch".',
      en: 'Do-catch is Swift\'s try-catch. Use "try" inside "do" and capture the error in the "catch" block.',
    },
    code: `enum FileError: Error {
    case notFound
}

func readFile(_ name: String) throws -> String {
    throw FileError.notFound
}

do {
    let content = try readFile("data.txt")
    print(content)
} catch {
    print("Erro: \\(error)")
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'swift-033',
    concept: { pt: 'Erro Personalizado', en: 'Custom Error' },
    difficulty: 'medium',
    prompt: {
      pt: 'Crie um enum que implementa Error com diferentes casos e dados associados pra erros descritivos.',
      en: 'Create an enum that implements Error with different cases and associated data for descriptive errors.',
    },
    code: `enum ApiError: Error, CustomStringConvertible {
    case unauthorized
    case serverError(code: Int)

    var description: String {
        switch self {
        case .unauthorized: return "Não autorizado"
        case .serverError(let c): return "Erro \\(c)"
        }
    }
}`,
    slot: 'err-custom',
  },
  {
    id: 'swift-034',
    concept: { pt: 'Defer (Finally)', en: 'Defer (Finally)' },
    difficulty: 'medium',
    prompt: {
      pt: '"defer" garante que um bloco de código execute ao sair do escopo, como finally. Use pra garantir limpeza de recurso.',
      en: '"defer" ensures a code block executes when leaving the scope, like finally. Use it to guarantee resource cleanup.',
    },
    code: `func processFile(_ name: String) {
    print("abrindo \\(name)")
    defer { print("fechando \\(name)") }
    print("processando...")
}

processFile("data.txt")`,
    slot: 'err-finally',
  },
  {
    id: 'swift-035',
    concept: { pt: 'Genéricos', en: 'Generics' },
    difficulty: 'hard',
    prompt: {
      pt: 'Genéricos permitem escrever funções e tipos que funcionam com qualquer tipo. Crie uma struct Stack genérica com push e pop.',
      en: 'Generics let you write functions and types that work with any type. Create a generic Stack struct with push and pop.',
    },
    code: `struct Stack<Element> {
    private var items: [Element] = []
    mutating func push(_ item: Element) { items.append(item) }
    mutating func pop() -> Element? { items.popLast() }
    var isEmpty: Bool { items.isEmpty }
}`,
    slot: 'type-generic',
  },
  {
    id: 'swift-036',
    concept: { pt: 'Tipo Union com Enum', en: 'Union Type with Enum' },
    difficulty: 'medium',
    prompt: {
      pt: 'Enums com valores associados funcionam como union types em Swift. Modele um valor JSON com diferentes tipos possíveis.',
      en: 'Enums with associated values work as union types in Swift. Model a JSON value with different possible types.',
    },
    code: `enum JsonValue {
    case string(String)
    case number(Double)
    case bool(Bool)
    case null
}

let val1: JsonValue = .string("hello")
let val2: JsonValue = .number(42)`,
    slot: 'type-union',
  },
  {
    id: 'swift-037',
    concept: { pt: 'Constraint de Tipo', en: 'Type Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Use "where" ou ": Protocol" pra restringir tipos genéricos. Crie uma função que só aceita tipos Comparable.',
      en: 'Use "where" or ": Protocol" to constrain generic types. Create a function that only accepts Comparable types.',
    },
    code: `func findMin<T: Comparable>(_ array: [T]) -> T? {
    guard var best = array.first else { return nil }
    for item in array where item < best {
        best = item
    }
    return best
}`,
    slot: 'type-constraint',
  },
  {
    id: 'swift-038',
    concept: { pt: 'Tipo Utilitário (Typealias)', en: 'Utility Type (Typealias)' },
    difficulty: 'easy',
    prompt: {
      pt: 'typealias cria nomes alternativos pra tipos existentes, facilitando a leitura. Crie aliases pra tipos complexos.',
      en: 'typealias creates alternative names for existing types, improving readability. Create aliases for complex types.',
    },
    code: `typealias Handler = (String, Int) -> Bool
typealias UserDict = [String: Any]

let validate: Handler = { name, age in
    !name.isEmpty && age > 0
}`,
    slot: 'type-utility',
  },
  {
    id: 'swift-039',
    concept: { pt: 'Pattern Matching', en: 'Pattern Matching' },
    difficulty: 'hard',
    prompt: {
      pt: 'Switch em Swift suporta pattern matching avançado com tuplas, binding e where. Use vários padrões num mesmo switch.',
      en: 'Swift switch supports advanced pattern matching with tuples, binding and where. Use various patterns in a single switch.',
    },
    code: `let point = (2, 0)
switch point {
case (0, 0):         print("origem")
case (let x, 0):     print("eixo x: \\(x)")
case (0, let y):     print("eixo y: \\(y)")
case let (x, y) where x == y: print("diagonal")
default:             print("(\\(point.0), \\(point.1))")
}`,
    slot: 'adv-pattern',
  },
  {
    id: 'swift-040',
    concept: { pt: 'Property Wrapper', en: 'Property Wrapper' },
    difficulty: 'hard',
    prompt: {
      pt: 'Property wrappers encapsulam lógica de acesso a propriedades, funcionando como macros de atributo. Crie um wrapper que limita valores a um range.',
      en: 'Property wrappers encapsulate property access logic, working like attribute macros. Create a wrapper that clamps values to a range.',
    },
    code: `@propertyWrapper
struct Clamped {
    var wrappedValue: Int {
        didSet { wrappedValue = min(max(wrappedValue, 0), 100) }
    }
    init(wrappedValue: Int) {
        self.wrappedValue = min(max(wrappedValue, 0), 100)
    }
}`,
    slot: 'adv-macro',
  },
  {
    id: 'swift-041',
    concept: { pt: 'Concorrência com Task', en: 'Concurrency with Task' },
    difficulty: 'hard',
    prompt: {
      pt: 'Task e async let permitem concorrência estruturada em Swift. Use async let pra disparar duas operações em paralelo.',
      en: 'Task and async let enable structured concurrency in Swift. Use async let to launch two operations in parallel.',
    },
    code: `func fetchName() async -> String { "Alice" }
func fetchAge() async -> Int { 30 }

func loadProfile() async {
    async let name = fetchName()
    async let age = fetchAge()
    print("\\(await name), \\(await age)")
}`,
    slot: 'adv-concurrent',
  },
]
