import { Snippet } from '@/lib/types'

export const goSnippets: Snippet[] = [
  {
    id: 'go-001',
    concept: 'Function',
    difficulty: 'easy',
    prompt: 'Em Go, funcoes declaram os tipos de todos os parametros e do retorno. Defina "add" com dois parametros int (voce pode abreviar como "a, b int" quando os tipos sao iguais) e retorne a soma diretamente.',
    code: `func add(a, b int) int {
    return a + b
}`,
  },
  {
    id: 'go-002',
    concept: 'Struct',
    difficulty: 'easy',
    prompt: 'Structs em Go agrupam campos tipados. Declare User com tres campos exportados (com letra maiuscula para ser visivel fora do pacote): Name e Email como string, e Age como int.',
    code: `type User struct {
    Name  string
    Email string
    Age   int
}`,
  },
  {
    id: 'go-003',
    concept: 'Interface',
    difficulty: 'medium',
    prompt: 'Interfaces em Go sao satisfeitas implicitamente — qualquer tipo que implementa todos os metodos se qualifica sem declarar. Defina Reader com o metodo Read(p []byte) (n int, err error), seguindo a convencao da stdlib.',
    code: `type Reader interface {
    Read(p []byte) (n int, err error)
}`,
  },
  {
    id: 'go-004',
    concept: 'Goroutine',
    difficulty: 'medium',
    prompt: 'Goroutines sao threads leves iniciadas com "go". Lance uma funcao anonima em segundo plano que executa heavyComputation() e envia o resultado para o canal ch com o operador de envio (<-).',
    code: `go func() {
    result := heavyComputation()
    ch <- result
}()`,
  },
  {
    id: 'go-005',
    concept: 'Channel',
    difficulty: 'medium',
    prompt: 'Canais (channels) sao o mecanismo de comunicacao segura entre goroutines em Go. Crie um canal de string com buffer de 1 usando make, envie "hello" para ele e receba a mensagem com o operador <-.',
    code: `ch := make(chan string, 1)
ch <- "hello"
msg := <-ch
fmt.Println(msg)`,
  },
  {
    id: 'go-006',
    concept: 'Defer',
    difficulty: 'easy',
    prompt: 'Defer agenda a execucao de uma chamada para quando a funcao atual retornar, garantindo limpeza mesmo com erros. Abra o arquivo, verifique o erro imediatamente e use defer f.Close() para garantir o fechamento em qualquer caminho de saida.',
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
    concept: 'Error Handling',
    difficulty: 'medium',
    prompt: 'Em Go, erros sao valores retornados — a convencao e verificar if err != nil imediatamente. Capture o erro de doSomething() e use fmt.Errorf com %w para embrulhar o erro original, preservando o contexto da falha.',
    code: `result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed: %w", err)
}`,
  },
  {
    id: 'go-008',
    concept: 'Range Loop',
    difficulty: 'easy',
    prompt: 'Range itera sobre slices, arrays, maps e canais retornando indice e valor. Use "for i, v := range items" para acessar cada par e imprima-os formatados com Printf.',
    code: `for i, v := range items {
    fmt.Printf("%d: %s\\n", i, v)
}`,
  },
  {
    id: 'go-009',
    concept: 'Map',
    difficulty: 'easy',
    prompt: 'Maps em Go associam chaves a valores e sao declarados com make ou com literal. Inicialize um map[string]int com um literal, insira dois pares e acesse um valor com verificacao de existencia: age, ok := m["alice"].',
    code: `m := map[string]int{
    "alice": 25,
    "bob":   30,
}
age, ok := m["alice"]`,
  },
  {
    id: 'go-010',
    concept: 'Pointer',
    difficulty: 'medium',
    prompt: 'Ponteiros armazenam o endereco de uma variavel, permitindo modifica-la de dentro de uma funcao. Implemente increment recebendo *int e usando *n++ para incrementar o inteiro no endereco apontado, depois chame com &x.',
    code: `func increment(n *int) {
    *n++
}

x := 5
increment(&x)`,
  },
]
