import { Snippet } from '@/lib/types'

export const goSnippets: Snippet[] = [
  {
    id: 'go-001',
    concept: 'Function',
    difficulty: 'easy',
    code: `func add(a, b int) int {
	return a + b
}`,
  },
  {
    id: 'go-002',
    concept: 'Struct',
    difficulty: 'easy',
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
    code: `type Reader interface {
	Read(p []byte) (n int, err error)
}`,
  },
  {
    id: 'go-004',
    concept: 'Goroutine',
    difficulty: 'medium',
    code: `go func() {
	result := heavyComputation()
	ch <- result
}()`,
  },
  {
    id: 'go-005',
    concept: 'Channel',
    difficulty: 'medium',
    code: `ch := make(chan string, 1)
ch <- "hello"
msg := <-ch
fmt.Println(msg)`,
  },
  {
    id: 'go-006',
    concept: 'Defer',
    difficulty: 'easy',
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
    code: `result, err := doSomething()
if err != nil {
	return fmt.Errorf("failed: %w", err)
}`,
  },
  {
    id: 'go-008',
    concept: 'Range Loop',
    difficulty: 'easy',
    code: `for i, v := range items {
	fmt.Printf("%d: %s\\n", i, v)
}`,
  },
  {
    id: 'go-009',
    concept: 'Map',
    difficulty: 'easy',
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
    code: `func increment(n *int) {
	*n++
}

x := 5
increment(&x)`,
  },
]
