import { Snippet } from '@/lib/types'

export const goSnippets: Snippet[] = [
  {
    id: 'go-001',
    concept: { pt: 'Função', en: 'Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, função declara o tipo de cada parâmetro e do retorno. Defina "add" com dois parâmetros int (dá pra abreviar "a, b int" quando o tipo é o mesmo) e retorne a soma direto.',
      en: 'In Go, functions declare the types of all parameters and the return value. Define "add" with two int parameters (you can shorten to "a, b int" when the types match) and return the sum directly.',
    },
    code: `func add(a, b int) int {
    return a + b
}`,
    slot: 'fn-basic',
  },
  {
    id: 'go-002',
    concept: { pt: 'Estrutura', en: 'Struct' },
    difficulty: 'easy',
    prompt: {
      pt: 'Struct em Go agrupa campos tipados. Declare User com três campos exportados (maiúscula pra ficar visível fora do pacote): Name e Email como string, e Age como int.',
      en: 'Structs in Go group typed fields together. Declare User with three exported fields (capitalized to be visible outside the package): Name and Email as string, and Age as int.',
    },
    code: `type User struct {
    Name  string
    Email string
    Age   int
}`,
    slot: 'obj-create',
  },
  {
    id: 'go-003',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'medium',
    prompt: {
      pt: 'Interface em Go é satisfeita implicitamente -- qualquer tipo que implementa todos os métodos já se qualifica sem precisar declarar. Defina Reader com o método Read(p []byte) (n int, err error), seguindo a convenção da stdlib.',
      en: 'Interfaces in Go are satisfied implicitly -- any type that implements all methods qualifies without declaring it. Define Reader with the method Read(p []byte) (n int, err error), following the stdlib convention.',
    },
    code: `type Reader interface {
    Read(p []byte) (n int, err error)
}`,
    slot: 'obj-interface',
  },
  {
    id: 'go-004',
    concept: { pt: 'Goroutine', en: 'Goroutine' },
    difficulty: 'medium',
    prompt: {
      pt: 'Goroutine é uma thread leve que você inicia com "go". Lance uma função anônima em background que roda heavyComputation() e manda o resultado pro channel ch com o operador de envio (<-).',
      en: 'Goroutines are lightweight threads started with "go". Launch an anonymous function in the background that runs heavyComputation() and sends the result to the ch channel using the send operator (<-).',
    },
    code: `go func() {
    result := heavyComputation()
    ch <- result
}()`,
    slot: 'adv-concurrent',
  },
  {
    id: 'go-005',
    concept: { pt: 'Canal', en: 'Channel' },
    difficulty: 'medium',
    prompt: {
      pt: 'Channel é o mecanismo de comunicação segura entre goroutines em Go. Crie um channel de string com buffer de 1 usando make, envie "hello" pra ele e receba a mensagem com o operador <-.',
      en: 'Channels are the safe communication mechanism between goroutines in Go. Create a buffered string channel with capacity 1 using make, send "hello" into it, and receive the message with the <- operator.',
    },
    code: `ch := make(chan string, 1)
ch <- "hello"
msg := <-ch
fmt.Println(msg)`,
    slot: 'adv-pattern',
  },
  {
    id: 'go-006',
    concept: { pt: 'Defer', en: 'Defer' },
    difficulty: 'easy',
    prompt: {
      pt: 'Defer agenda uma chamada pra rodar quando a função retornar, garantindo cleanup mesmo com erro. Abra o arquivo, verifique o erro na hora e use defer f.Close() pra garantir que ele fecha em qualquer caminho de saída.',
      en: 'Defer schedules a call to run when the current function returns, ensuring cleanup even on errors. Open the file, check the error immediately, and use defer f.Close() to guarantee the file is closed on any exit path.',
    },
    code: `func readFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, err
    }
    defer f.Close()
    return io.ReadAll(f)
}`,
    slot: 'err-finally',
  },
  {
    id: 'go-007',
    concept: { pt: 'Tratamento de Erros', en: 'Error Handling' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Go, erro é um valor retornado -- a convenção é checar if err != nil na hora. Capture o erro de doSomething() e use fmt.Errorf com %w pra wrappear o erro original, preservando o contexto da falha.',
      en: 'In Go, errors are returned values -- the convention is to check if err != nil immediately. Capture the error from doSomething() and use fmt.Errorf with %w to wrap the original error, preserving failure context.',
    },
    code: `result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed: %w", err)
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'go-008',
    concept: { pt: 'Laço Range', en: 'Range Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'Range itera sobre slices, arrays, maps e channels retornando índice e valor. Use "for i, v := range items" pra acessar cada par e imprima formatado com Printf.',
      en: 'Range iterates over slices, arrays, maps, and channels returning index and value. Use "for i, v := range items" to access each pair and print them formatted with Printf.',
    },
    code: `for i, v := range items {
    fmt.Printf("%d: %s\\n", i, v)
}`,
    slot: 'loop-foreach',
  },
  {
    id: 'go-009',
    concept: { pt: 'Mapa', en: 'Map' },
    difficulty: 'easy',
    prompt: {
      pt: 'Map em Go associa chaves a valores e pode ser declarado com make ou literal. Inicialize um map[string]int com literal, coloque dois pares e acesse um valor checando se existe: age, ok := m["alice"].',
      en: 'Maps in Go associate keys with values and are declared with make or a literal. Initialize a map[string]int with a literal, insert two pairs, and access a value with existence check: age, ok := m["alice"].',
    },
    code: `m := map[string]int{
    "alice": 25,
    "bob":   30,
}
age, ok := m["alice"]`,
    slot: 'var-types',
  },
  {
    id: 'go-010',
    concept: { pt: 'Ponteiro', en: 'Pointer' },
    difficulty: 'medium',
    prompt: {
      pt: 'Ponteiro guarda o endereço de uma variável, permitindo modificar ela de dentro de uma função. Implemente increment recebendo *int e usando *n++ pra incrementar o inteiro no endereço apontado, depois chame com &x.',
      en: 'Pointers store a variable\'s address, allowing you to modify it from within a function. Implement increment taking *int and using *n++ to increment the integer at the pointed address, then call it with &x.',
    },
    code: `func increment(n *int) {
    *n++
}

x := 5
increment(&x)`,
    slot: 'fn-callback',
  },
  // ── If e Else ──────────────────────────────────────────────
  {
    id: 'go-011',
    concept: { pt: 'If Simples', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, o if nao precisa de parenteses na condicao. Verifique se age e maior ou igual a 18 e imprima com fmt.Println.',
      en: 'In Go, if statements don\'t need parentheses. Check if age is 18 or older and print with fmt.Println.',
    },
    code: `if age >= 18 {
    fmt.Println("You are an adult")
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'go-012',
    concept: { pt: 'If-Else', en: 'If-Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'If-else em Go segue a mesma regra: sem parenteses e a chave abre na mesma linha. Classifique score como "Pass" ou "Fail" e guarde numa variavel.',
      en: 'If-else in Go follows the same rule: no parentheses and the brace opens on the same line. Classify score as "Pass" or "Fail" and store in a variable.',
    },
    code: `var result string
if score >= 70 {
    result = "Pass"
} else {
    result = "Fail"
}`,
    slot: 'cond-if-else',
  },
  {
    id: 'go-013',
    concept: { pt: 'Expressao Condicional Curta', en: 'Short Conditional' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go nao tem operador ternario, mas uma func helper inline resolve. Crie uma funcao ternary generica com Go 1.18+ que recebe uma condicao bool e dois valores.',
      en: 'Go has no ternary operator, but an inline helper function works. Create a generic ternary function with Go 1.18+ that takes a bool condition and two values.',
    },
    code: `func ternary[T any](cond bool, a, b T) T {
    if cond {
        return a
    }
    return b
}`,
    slot: 'cond-ternary',
  },
  {
    id: 'go-014',
    concept: { pt: 'Switch', en: 'Switch' },
    difficulty: 'easy',
    prompt: {
      pt: 'Switch em Go nao precisa de break -- cada case para automaticamente. Use switch pra mapear um dia da semana a uma categoria, com default pra "Midweek".',
      en: 'Switch in Go doesn\'t need break -- each case stops automatically. Use switch to map a day of the week to a category, with default for "Midweek".',
    },
    code: `switch day {
case "Monday", "Friday":
    label = "Work"
case "Saturday", "Sunday":
    label = "Rest"
default:
    label = "Midweek"
}`,
    slot: 'cond-switch',
  },
  {
    id: 'go-015',
    concept: { pt: 'If com Inicializador', en: 'If with Initializer' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Go, o if pode ter uma declaracao curta antes da condicao, separada por ";". Use isso pra abrir um arquivo e checar o erro na mesma linha -- o escopo da variavel fica limitado ao bloco.',
      en: 'In Go, if can have a short statement before the condition, separated by ";". Use this to open a file and check the error on the same line -- the variable\'s scope is limited to the block.',
    },
    code: `if f, err := os.Open("config.json"); err != nil {
    log.Fatal(err)
} else {
    defer f.Close()
}`,
    slot: 'cond-guard',
  },
  // ── Variaveis ──────────────────────────────────────────────
  {
    id: 'go-016',
    concept: { pt: 'Declaracao de Variavel', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go tem dois jeitos de declarar variavel: "var" com tipo explicito e ":=" com inferencia. Declare uma string com var e um inteiro com :=.',
      en: 'Go has two ways to declare variables: "var" with explicit type and ":=" with inference. Declare a string with var and an int with :=.',
    },
    code: `var name string = "Alice"
age := 25`,
    slot: 'var-declare',
  },
  {
    id: 'go-017',
    concept: { pt: 'Constante', en: 'Constant' },
    difficulty: 'easy',
    prompt: {
      pt: 'Constantes em Go sao declaradas com "const" e podem ser agrupadas num bloco. Declare PI e MaxRetries num bloco const.',
      en: 'Constants in Go are declared with "const" and can be grouped in a block. Declare PI and MaxRetries in a const block.',
    },
    code: `const (
    PI         = 3.14159
    MaxRetries = 3
)`,
    slot: 'var-const',
  },
  {
    id: 'go-018',
    concept: { pt: 'Interpolacao com Sprintf', en: 'String Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go nao tem interpolacao nativa, mas fmt.Sprintf formata strings com verbos como %s e %d. Construa uma saudacao usando Sprintf.',
      en: 'Go doesn\'t have native interpolation, but fmt.Sprintf formats strings with verbs like %s and %d. Build a greeting using Sprintf.',
    },
    code: `name := "Alice"
age := 30
msg := fmt.Sprintf("Hello, %s! You are %d.", name, age)`,
    slot: 'var-interpolation',
  },
  {
    id: 'go-019',
    concept: { pt: 'Slice', en: 'Slice' },
    difficulty: 'easy',
    prompt: {
      pt: 'Slice e o array dinamico de Go. Crie um slice literal de strings, adicione um elemento com append e imprima o tamanho com len.',
      en: 'Slices are Go\'s dynamic arrays. Create a string slice literal, add an element with append, and print the length with len.',
    },
    code: `fruits := []string{"apple", "banana"}
fruits = append(fruits, "cherry")
fmt.Println(len(fruits))`,
    slot: 'var-array',
  },
  {
    id: 'go-020',
    concept: { pt: 'Retorno Multiplo', en: 'Multiple Return' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go permite retornar multiplos valores, o que e usado pra retornar resultado + erro. Crie divide que retorna float64 e error, checando divisao por zero.',
      en: 'Go allows multiple return values, commonly used for result + error. Create divide that returns float64 and error, checking for division by zero.',
    },
    code: `func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}`,
    slot: 'var-destructure',
  },
  // ── Funcoes ────────────────────────────────────────────────
  {
    id: 'go-021',
    concept: { pt: 'Funcao Anonima', en: 'Anonymous Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go suporta funcoes anonimas que podem ser atribuidas a variaveis. Crie uma funcao anonima que soma dois inteiros e atribua a variavel "add".',
      en: 'Go supports anonymous functions that can be assigned to variables. Create an anonymous function that adds two ints and assign it to the variable "add".',
    },
    code: `add := func(a, b int) int {
    return a + b
}
fmt.Println(add(3, 4))`,
    slot: 'fn-arrow',
  },
  {
    id: 'go-022',
    concept: { pt: 'Closure', en: 'Closure' },
    difficulty: 'medium',
    prompt: {
      pt: 'Closures em Go capturam variaveis do escopo externo. Crie um contador que retorna uma funcao -- cada chamada incrementa e retorna o valor capturado.',
      en: 'Closures in Go capture variables from the outer scope. Create a counter that returns a function -- each call increments and returns the captured value.',
    },
    code: `func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}`,
    slot: 'fn-closure',
  },
  {
    id: 'go-023',
    concept: { pt: 'Parametros Variadicos', en: 'Variadic Parameters' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go usa "..." pra parametros variadicos, permitindo passar qualquer quantidade de argumentos. Crie sum que aceita multiplos inteiros e retorna a soma.',
      en: 'Go uses "..." for variadic parameters, allowing any number of arguments. Create sum that accepts multiple ints and returns the total.',
    },
    code: `func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}`,
    slot: 'fn-default-params',
  },
  // ── Loops ──────────────────────────────────────────────────
  {
    id: 'go-024',
    concept: { pt: 'For Classico', en: 'Classic For' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go so tem "for" como laco -- nao existe while nem do-while. Use o for classico com inicializador, condicao e pos para imprimir de 0 a 4.',
      en: 'Go only has "for" as a loop -- there is no while or do-while. Use the classic for with init, condition, and post to print 0 through 4.',
    },
    code: `for i := 0; i < 5; i++ {
    fmt.Println(i)
}`,
    slot: 'loop-for',
  },
  {
    id: 'go-025',
    concept: { pt: 'For como While', en: 'For as While' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, "for" sem inicializador e pos funciona como while. Use pra ler de um scanner enquanto houver input.',
      en: 'In Go, "for" without init and post works as while. Use it to read from a scanner while there is input.',
    },
    code: `scanner := bufio.NewScanner(os.Stdin)
for scanner.Scan() {
    fmt.Println(scanner.Text())
}`,
    slot: 'loop-while',
  },
  {
    id: 'go-026',
    concept: { pt: 'Filtrar Slice', en: 'Filter Slice' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go nao tem filter embutido, mas e facil construir um com range e append. Filtre um slice de inteiros mantendo apenas os pares.',
      en: 'Go has no built-in filter, but it\'s easy to build one with range and append. Filter a slice of ints keeping only even numbers.',
    },
    code: `var evens []int
for _, n := range nums {
    if n%2 == 0 {
        evens = append(evens, n)
    }
}`,
    slot: 'loop-filter',
  },
  {
    id: 'go-027',
    concept: { pt: 'Gerar Sequencia', en: 'Generate Sequence' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, crie uma sequencia numerica com um for classico adicionando ao slice. Gere um slice de 1 a n usando append.',
      en: 'In Go, create a numeric sequence with a classic for appending to a slice. Generate a slice from 1 to n using append.',
    },
    code: `func makeRange(n int) []int {
    s := make([]int, 0, n)
    for i := 1; i <= n; i++ {
        s = append(s, i)
    }
    return s
}`,
    slot: 'loop-range',
  },
  // ── Objetos (struct patterns) ──────────────────────────────
  {
    id: 'go-028',
    concept: { pt: 'Metodo em Struct', en: 'Struct Method' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, metodos sao funcoes com um receiver. Adicione um metodo FullName ao struct Person que concatena FirstName e LastName.',
      en: 'In Go, methods are functions with a receiver. Add a FullName method to the Person struct that concatenates FirstName and LastName.',
    },
    code: `type Person struct {
    FirstName, LastName string
}

func (p Person) FullName() string {
    return p.FirstName + " " + p.LastName
}`,
    slot: 'obj-methods',
  },
  {
    id: 'go-029',
    concept: { pt: 'Struct Aninhado', en: 'Nested Struct' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go suporta composicao com embedding -- o struct interno "promove" seus campos pro externo. Crie Address e Company com Address embutido.',
      en: 'Go supports composition via embedding -- the inner struct promotes its fields to the outer. Create Address and Company with embedded Address.',
    },
    code: `type Address struct {
    City, State string
}

type Company struct {
    Name string
    Address
}`,
    slot: 'obj-nested',
  },
  // ── Classes (struct + interface patterns) ──────────────────
  {
    id: 'go-030',
    concept: { pt: 'Struct com Constructor', en: 'Struct Constructor' },
    difficulty: 'easy',
    prompt: {
      pt: 'Go nao tem classes, mas a convencao e criar funcoes New* que funcionam como construtores. Crie NewUser que valida os campos e retorna *User.',
      en: 'Go has no classes, but the convention is New* functions as constructors. Create NewUser that validates fields and returns *User.',
    },
    code: `func NewUser(name string, age int) *User {
    return &User{
        Name: name,
        Age:  age,
    }
}`,
    slot: 'class-basic',
  },
  {
    id: 'go-031',
    concept: { pt: 'Composicao (Heranca)', en: 'Composition (Inheritance)' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go usa composicao em vez de heranca. Embuta Animal dentro de Dog pra "herdar" seus campos e metodos de forma implicita.',
      en: 'Go uses composition instead of inheritance. Embed Animal inside Dog to "inherit" its fields and methods implicitly.',
    },
    code: `type Animal struct {
    Name string
}

func (a Animal) Speak() string {
    return a.Name + " speaks"
}

type Dog struct {
    Animal
    Breed string
}`,
    slot: 'class-inherit',
  },
  {
    id: 'go-032',
    concept: { pt: 'Sobrescrita de Metodo', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Go, o struct externo pode redefinir um metodo do struct embutido, "sobrescrevendo" o comportamento. Faca Dog redefinir Speak de Animal.',
      en: 'In Go, the outer struct can redefine a method from the embedded struct, "overriding" the behavior. Make Dog override Animal\'s Speak.',
    },
    code: `func (d Dog) Speak() string {
    return d.Name + " barks"
}

dog := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
fmt.Println(dog.Speak())`,
    slot: 'class-override',
  },
  {
    id: 'go-033',
    concept: { pt: 'Interface como Abstrato', en: 'Interface as Abstract' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go nao tem classes abstratas, mas interfaces servem o mesmo proposito. Defina Shape com Area() e implemente com Circle.',
      en: 'Go has no abstract classes, but interfaces serve the same purpose. Define Shape with Area() and implement it with Circle.',
    },
    code: `type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return 3.14159 * c.Radius * c.Radius
}`,
    slot: 'class-abstract',
  },
  // ── Erros ──────────────────────────────────────────────────
  {
    id: 'go-034',
    concept: { pt: 'Erro Customizado', en: 'Custom Error' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Go, qualquer tipo que implemente Error() string satisfaz a interface error. Crie um tipo ValidationError com campo Field e Message.',
      en: 'In Go, any type implementing Error() string satisfies the error interface. Create a ValidationError type with Field and Message fields.',
    },
    code: `type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return e.Field + ": " + e.Message
}`,
    slot: 'err-custom',
  },
  {
    id: 'go-035',
    concept: { pt: 'Resultado com ok', en: 'Result with ok' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go usa o padrao "valor, ok" pra indicar sucesso ou falha sem erro explicito. Use esse padrao pra buscar num map e tratar a ausencia.',
      en: 'Go uses the "value, ok" pattern to indicate success or failure without an explicit error. Use this pattern to look up a map and handle absence.',
    },
    code: `func lookup(users map[string]User, key string) (User, bool) {
    u, ok := users[key]
    return u, ok
}`,
    slot: 'err-result',
  },
  // ── Tipos ──────────────────────────────────────────────────
  {
    id: 'go-036',
    concept: { pt: 'Generico', en: 'Generic' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go 1.18+ suporta generics com type parameters. Crie uma funcao Filter generica que aceita um slice de qualquer tipo e um predicado.',
      en: 'Go 1.18+ supports generics with type parameters. Create a generic Filter function that accepts a slice of any type and a predicate.',
    },
    code: `func Filter[T any](s []T, fn func(T) bool) []T {
    var result []T
    for _, v := range s {
        if fn(v) {
            result = append(result, v)
        }
    }
    return result
}`,
    slot: 'type-generic',
  },
  {
    id: 'go-037',
    concept: { pt: 'Union com Interface', en: 'Union with Interface' },
    difficulty: 'medium',
    prompt: {
      pt: 'Go 1.18+ permite union types em constraints de interface. Defina Number como constraint que aceita int ou float64 e crie Sum generico.',
      en: 'Go 1.18+ allows union types in interface constraints. Define Number as a constraint accepting int or float64 and create a generic Sum.',
    },
    code: `type Number interface {
    int | float64
}

func Sum[T Number](nums []T) T {
    var total T
    for _, n := range nums {
        total += n
    }
    return total
}`,
    slot: 'type-union',
  },
  {
    id: 'go-038',
    concept: { pt: 'Constraint de Tipo', en: 'Type Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Constraints em Go restringem quais tipos um generico aceita. Use comparable pra garantir que o tipo suporta == e crie Contains generico.',
      en: 'Constraints in Go restrict which types a generic accepts. Use comparable to ensure the type supports == and create a generic Contains.',
    },
    code: `func Contains[T comparable](s []T, target T) bool {
    for _, v := range s {
        if v == target {
            return true
        }
    }
    return false
}`,
    slot: 'type-constraint',
  },
  {
    id: 'go-039',
    concept: { pt: 'Tipo Utilitario', en: 'Utility Type' },
    difficulty: 'hard',
    prompt: {
      pt: 'Em Go, tipos utilitarios sao criados com generics e interfaces. Crie um tipo Pair generico que agrupa dois valores de tipos diferentes.',
      en: 'In Go, utility types are built with generics and interfaces. Create a generic Pair type that groups two values of different types.',
    },
    code: `type Pair[A, B any] struct {
    First  A
    Second B
}

func NewPair[A, B any](a A, b B) Pair[A, B] {
    return Pair[A, B]{First: a, Second: b}
}`,
    slot: 'type-utility',
  },
  // ── Avancado ───────────────────────────────────────────────
  {
    id: 'go-040',
    concept: { pt: 'Async com Goroutine', en: 'Async with Goroutine' },
    difficulty: 'hard',
    prompt: {
      pt: 'Go usa goroutines e channels pra concorrencia assincrona. Lance multiplas goroutines com WaitGroup pra esperar todas terminarem.',
      en: 'Go uses goroutines and channels for async concurrency. Launch multiple goroutines with WaitGroup to wait for all to finish.',
    },
    code: `var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(url)
}
wg.Wait()`,
    slot: 'adv-async',
  },
  {
    id: 'go-041',
    concept: { pt: 'Select com Channels', en: 'Select with Channels' },
    difficulty: 'hard',
    prompt: {
      pt: 'Select em Go e como um switch pra operacoes de channel -- espera o primeiro channel que estiver pronto. Use com time.After pra timeout.',
      en: 'Select in Go is like a switch for channel operations -- waits for the first ready channel. Use it with time.After for a timeout.',
    },
    code: `select {
case msg := <-ch:
    fmt.Println("received:", msg)
case <-time.After(5 * time.Second):
    fmt.Println("timeout")
}`,
    slot: 'adv-macro',
  },
  // ── Algoritmos & Estruturas de Dados ──────────────────────
  {
    id: 'go-042',
    concept: { pt: 'Notação Big O', en: 'Big O Notation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Big O descreve a complexidade de tempo. Demonstre O(1), O(n) e O(n²) em Go.',
      en: 'Big O describes time complexity. Demonstrate O(1), O(n), and O(n²) in Go.',
    },
    code: `// O(1) -- acesso direto
first := arr[0]

// O(n) -- percorrer tudo
func contains(arr []int, target int) bool {
    for _, v := range arr {
        if v == target { return true }
    }
    return false
}

// O(n²) -- loop aninhado
func hasDuplicate(arr []int) bool {
    for i := 0; i < len(arr); i++ {
        for j := i + 1; j < len(arr); j++ {
            if arr[i] == arr[j] { return true }
        }
    }
    return false
}`,
  },
  {
    id: 'go-043',
    concept: { pt: 'Busca Binária', en: 'Binary Search' },
    difficulty: 'medium',
    prompt: {
      pt: 'Busca binária divide o slice ordenado ao meio -- O(log n). Implemente de forma iterativa.',
      en: 'Binary search halves a sorted slice -- O(log n). Implement it iteratively.',
    },
    code: `func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`,
  },
  {
    id: 'go-044',
    concept: { pt: 'Bubble Sort', en: 'Bubble Sort' },
    difficulty: 'easy',
    prompt: {
      pt: 'Bubble Sort compara pares adjacentes e troca -- O(n²). Implemente com parada antecipada.',
      en: 'Bubble Sort compares adjacent pairs and swaps -- O(n²). Implement with early stop.',
    },
    code: `func bubbleSort(arr []int) []int {
    a := make([]int, len(arr))
    copy(a, arr)
    for i := 0; i < len(a)-1; i++ {
        swapped := false
        for j := 0; j < len(a)-1-i; j++ {
            if a[j] > a[j+1] {
                a[j], a[j+1] = a[j+1], a[j]
                swapped = true
            }
        }
        if !swapped { break }
    }
    return a
}`,
  },
  {
    id: 'go-045',
    concept: { pt: 'Merge Sort', en: 'Merge Sort' },
    difficulty: 'hard',
    prompt: {
      pt: 'Merge Sort divide recursivamente e intercala -- O(n log n). Implemente com slices.',
      en: 'Merge Sort recursively splits and merges -- O(n log n). Implement with slices.',
    },
    code: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 { return arr }
    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    return merge(left, right)
}

func merge(a, b []int) []int {
    result := make([]int, 0, len(a)+len(b))
    i, j := 0, 0
    for i < len(a) && j < len(b) {
        if a[i] <= b[j] { result = append(result, a[i]); i++ } else { result = append(result, b[j]); j++ }
    }
    result = append(result, a[i:]...)
    result = append(result, b[j:]...)
    return result
}`,
  },
  {
    id: 'go-046',
    concept: { pt: 'Quick Sort', en: 'Quick Sort' },
    difficulty: 'hard',
    prompt: {
      pt: 'Quick Sort particiona em torno de um pivô -- O(n log n) médio. Implemente in-place.',
      en: 'Quick Sort partitions around a pivot -- O(n log n) average. Implement in-place.',
    },
    code: `func quickSort(arr []int, lo, hi int) {
    if lo >= hi { return }
    pivot := arr[hi]
    i := lo
    for j := lo; j < hi; j++ {
        if arr[j] < pivot {
            arr[i], arr[j] = arr[j], arr[i]
            i++
        }
    }
    arr[i], arr[hi] = arr[hi], arr[i]
    quickSort(arr, lo, i-1)
    quickSort(arr, i+1, hi)
}`,
  },
  {
    id: 'go-047',
    concept: { pt: 'Pilha (Stack)', en: 'Stack' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, um slice funciona como pilha com append e reslicing. Implemente uma struct Stack.',
      en: 'In Go, a slice works as a stack with append and reslicing. Implement a Stack struct.',
    },
    code: `type Stack struct {
    items []int
}

func (s *Stack) Push(v int)    { s.items = append(s.items, v) }
func (s *Stack) Pop() int      { v := s.items[len(s.items)-1]; s.items = s.items[:len(s.items)-1]; return v }
func (s *Stack) Peek() int     { return s.items[len(s.items)-1] }
func (s *Stack) IsEmpty() bool { return len(s.items) == 0 }`,
  },
  {
    id: 'go-048',
    concept: { pt: 'Fila (Queue)', en: 'Queue' },
    difficulty: 'easy',
    prompt: {
      pt: 'Uma fila em Go usa slice com append e reslicing do início. Implemente uma struct Queue.',
      en: 'A queue in Go uses a slice with append and front reslicing. Implement a Queue struct.',
    },
    code: `type Queue struct {
    items []string
}

func (q *Queue) Enqueue(v string) { q.items = append(q.items, v) }
func (q *Queue) Dequeue() string  { v := q.items[0]; q.items = q.items[1:]; return v }
func (q *Queue) Front() string    { return q.items[0] }
func (q *Queue) IsEmpty() bool    { return len(q.items) == 0 }
func (q *Queue) Size() int        { return len(q.items) }`,
  },
  {
    id: 'go-049',
    concept: { pt: 'Lista Ligada', en: 'Linked List' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma lista ligada em Go usa structs com ponteiros. Implemente inserção e travessia.',
      en: 'A linked list in Go uses structs with pointers. Implement insertion and traversal.',
    },
    code: `type Node struct {
    Value int
    Next  *Node
}

type LinkedList struct {
    Head *Node
}

func (l *LinkedList) Prepend(v int) {
    l.Head = &Node{Value: v, Next: l.Head}
}

func (l *LinkedList) ToSlice() []int {
    var result []int
    for n := l.Head; n != nil; n = n.Next {
        result = append(result, n.Value)
    }
    return result
}`,
  },
  {
    id: 'go-050',
    concept: { pt: 'Árvore Binária de Busca', en: 'Binary Search Tree' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma BST em Go usa struct com ponteiros pra filhos. Implemente Insert e Search.',
      en: 'A BST in Go uses struct with child pointers. Implement Insert and Search.',
    },
    code: `type TreeNode struct {
    Val         int
    Left, Right *TreeNode
}

func Insert(node *TreeNode, val int) *TreeNode {
    if node == nil { return &TreeNode{Val: val} }
    if val < node.Val { node.Left = Insert(node.Left, val) } else { node.Right = Insert(node.Right, val) }
    return node
}

func Search(node *TreeNode, val int) bool {
    if node == nil { return false }
    if val == node.Val { return true }
    if val < node.Val { return Search(node.Left, val) }
    return Search(node.Right, val)
}`,
  },
  {
    id: 'go-051',
    concept: { pt: 'BFS (Busca em Largura)', en: 'BFS (Breadth-First Search)' },
    difficulty: 'hard',
    prompt: {
      pt: 'BFS explora nível por nível com slice como fila. Implemente com map de adjacência.',
      en: 'BFS explores level by level with slice as queue. Implement with adjacency map.',
    },
    code: `func bfs(graph map[string][]string, start string) []string {
    visited := map[string]bool{start: true}
    queue := []string{start}
    var result []string
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        result = append(result, node)
        for _, nb := range graph[node] {
            if !visited[nb] {
                visited[nb] = true
                queue = append(queue, nb)
            }
        }
    }
    return result
}`,
  },
  {
    id: 'go-052',
    concept: { pt: 'DFS (Busca em Profundidade)', en: 'DFS (Depth-First Search)' },
    difficulty: 'hard',
    prompt: {
      pt: 'DFS explora o mais fundo possível com slice como pilha. Implemente iterativamente.',
      en: 'DFS explores as deep as possible with slice as stack. Implement it iteratively.',
    },
    code: `func dfs(graph map[string][]string, start string) []string {
    visited := map[string]bool{}
    stack := []string{start}
    var result []string
    for len(stack) > 0 {
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        if visited[node] { continue }
        visited[node] = true
        result = append(result, node)
        neighbors := graph[node]
        for i := len(neighbors) - 1; i >= 0; i-- {
            if !visited[neighbors[i]] {
                stack = append(stack, neighbors[i])
            }
        }
    }
    return result
}`,
  },
  {
    id: 'go-053',
    concept: { pt: 'Hash Map', en: 'Hash Map' },
    difficulty: 'medium',
    prompt: {
      pt: 'map é o hash map nativo de Go com acesso O(1) médio. Use operações comuns e iteração.',
      en: 'map is Go\'s native hash map with O(1) average access. Use common operations and iteration.',
    },
    code: `scores := map[string]int{
    "Alice": 95,
    "Bob":   87,
    "Carol": 92,
}

alice := scores["Alice"]
dave, ok := scores["Dave"]
if !ok { dave = 0 }

for name, score := range scores {
    fmt.Printf("%s: %d\\n", name, score)
}`,
  },
]
