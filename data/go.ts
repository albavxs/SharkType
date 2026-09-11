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
]
