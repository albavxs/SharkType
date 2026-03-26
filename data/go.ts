import { Snippet } from '@/lib/types'

export const goSnippets: Snippet[] = [
  {
    id: 'go-001',
    concept: 'Function',
    difficulty: 'easy',
    prompt: 'Defina uma funcao Go simples que recebe dois inteiros e retorna a soma.',
    code: `func add(a, b int) int {
	return a + b
}`,
  },
  {
    id: 'go-002',
    concept: 'Struct',
    difficulty: 'easy',
    prompt: 'Declare uma struct User com campos exportados de string e int.',
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
    prompt: 'Defina uma interface Reader com um metodo Read seguindo o padrao de io do Go.',
    code: `type Reader interface {
	Read(p []byte) (n int, err error)
}`,
  },
  {
    id: 'go-004',
    concept: 'Goroutine',
    difficulty: 'medium',
    prompt: 'Lance uma goroutine anonima para executar um calculo e enviar o resultado por um canal.',
    code: `go func() {
	result := heavyComputation()
	ch <- result
}()`,
  },
  {
    id: 'go-005',
    concept: 'Channel',
    difficulty: 'medium',
    prompt: 'Crie um canal bufferizado, envie uma mensagem e receba-a usando o operador <-.',
    code: `ch := make(chan string, 1)
ch <- "hello"
msg := <-ch
fmt.Println(msg)`,
  },
  {
    id: 'go-006',
    concept: 'Defer',
    difficulty: 'easy',
    prompt: 'Use defer para garantir que um arquivo seja fechado ao final da funcao, independente de erros.',
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
    prompt: 'Trate um erro retornado por uma funcao e use fmt.Errorf com %w para embrulhar o erro original.',
    code: `result, err := doSomething()
if err != nil {
	return fmt.Errorf("failed: %w", err)
}`,
  },
  {
    id: 'go-008',
    concept: 'Range Loop',
    difficulty: 'easy',
    prompt: 'Itere sobre uma slice usando range para obter o indice e valor de cada elemento.',
    code: `for i, v := range items {
	fmt.Printf("%d: %s\\n", i, v)
}`,
  },
  {
    id: 'go-009',
    concept: 'Map',
    difficulty: 'easy',
    prompt: 'Declare um map com literal, insira valores e acesse uma chave com verificacao de existencia.',
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
    prompt: 'Passe um ponteiro para uma funcao que modifica o valor original da variavel usando *n++.',
    code: `func increment(n *int) {
	*n++
}

x := 5
increment(&x)`,
  },
]
