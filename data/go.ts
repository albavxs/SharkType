import { Snippet } from '@/lib/types'

export const goSnippets: Snippet[] = [
  {
    id: 'go-001',
    concept: { pt: 'Function', en: 'Function' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Go, função declara o tipo de cada parâmetro e do retorno. Defina "add" com dois parâmetros int (dá pra abreviar "a, b int" quando o tipo é o mesmo) e retorne a soma direto.',
      en: 'In Go, functions declare the types of all parameters and the return value. Define "add" with two int parameters (you can shorten to "a, b int" when the types match) and return the sum directly.',
    },
    code: `func add(a, b int) int {
    return a + b
}`,
  },
  {
    id: 'go-002',
    concept: { pt: 'Struct', en: 'Struct' },
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
  },
  {
    id: 'go-003',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'medium',
    prompt: {
      pt: 'Interface em Go é satisfeita implicitamente — qualquer tipo que implementa todos os métodos já se qualifica sem precisar declarar. Defina Reader com o método Read(p []byte) (n int, err error), seguindo a convenção da stdlib.',
      en: 'Interfaces in Go are satisfied implicitly — any type that implements all methods qualifies without declaring it. Define Reader with the method Read(p []byte) (n int, err error), following the stdlib convention.',
    },
    code: `type Reader interface {
    Read(p []byte) (n int, err error)
}`,
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
  },
  {
    id: 'go-005',
    concept: { pt: 'Channel', en: 'Channel' },
    difficulty: 'medium',
    prompt: {
      pt: 'Channel é o mecanismo de comunicação segura entre goroutines em Go. Crie um channel de string com buffer de 1 usando make, envie "hello" pra ele e receba a mensagem com o operador <-.',
      en: 'Channels are the safe communication mechanism between goroutines in Go. Create a buffered string channel with capacity 1 using make, send "hello" into it, and receive the message with the <- operator.',
    },
    code: `ch := make(chan string, 1)
ch <- "hello"
msg := <-ch
fmt.Println(msg)`,
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
  },
  {
    id: 'go-007',
    concept: { pt: 'Tratamento de Erros', en: 'Error Handling' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Go, erro é um valor retornado — a convenção é checar if err != nil na hora. Capture o erro de doSomething() e use fmt.Errorf com %w pra wrappear o erro original, preservando o contexto da falha.',
      en: 'In Go, errors are returned values — the convention is to check if err != nil immediately. Capture the error from doSomething() and use fmt.Errorf with %w to wrap the original error, preserving failure context.',
    },
    code: `result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed: %w", err)
}`,
  },
  {
    id: 'go-008',
    concept: { pt: 'Range Loop', en: 'Range Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'Range itera sobre slices, arrays, maps e channels retornando índice e valor. Use "for i, v := range items" pra acessar cada par e imprima formatado com Printf.',
      en: 'Range iterates over slices, arrays, maps, and channels returning index and value. Use "for i, v := range items" to access each pair and print them formatted with Printf.',
    },
    code: `for i, v := range items {
    fmt.Printf("%d: %s\\n", i, v)
}`,
  },
  {
    id: 'go-009',
    concept: { pt: 'Map', en: 'Map' },
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
  },
]
