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
      pt: 'String interpolation em Swift usa \\(expressão) dentro de aspas duplas. Monte a mensagem juntando a variável "language" (String) e "year" (Int) numa frase -- qualquer expressão Swift pode entrar ali dentro.',
      en: 'Swift string interpolation uses the \\(expression) syntax inside double quotes. Build the message by combining the "language" (String) and "year" (Int) variables into a sentence -- any Swift expression can be interpolated.',
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
      pt: 'Optionals representam a ausência de valor em Swift. Use "if let" pra desembrulhar "email" com segurança: se o valor existir, fica disponível como "e" dentro do bloco -- nada de force-unwrap (!) que dá crash se for nil.',
      en: 'Optionals represent the absence of a value in Swift. Use "if let" to safely unwrap "email": if the value exists, it becomes available as "e" inside the block -- no force-unwrap (!) which would crash on nil.',
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
      pt: 'Structs em Swift são value types (copiados na atribuição). Defina Point com duas coordenadas Double mutáveis e crie distance(to:) -- um método que recebe outro Point e calcula a distância euclidiana entre os dois.',
      en: 'Swift structs are value types (copied on assignment). Define Point with two mutable Double coordinates and implement distance(to:) -- a method that takes another Point and calculates the Euclidean distance between them.',
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
      pt: '"guard let" é o inverso de "if let": sai cedo se a condição falhar, deixando o happy path sem indentação maluca. Valide que "name" existe e não tá vazio -- retorne a saudação padrão se qualquer condição falhar.',
      en: '"guard let" is the opposite of "if let": it returns early if the condition fails, keeping the happy path without excessive indentation. Validate that "name" exists and is not empty -- return the default greeting if either condition fails.',
    },
    code: `func greet(_ name: String?) -> String {
    guard let name = name, !name.isEmpty else {
        return "Hello, stranger!"
    }
    return "Hello, \\(name)!"
}`,
    slot: 'cond-guard',
  },
]
