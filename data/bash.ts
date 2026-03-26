import { Snippet } from '@/lib/types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-001',
    concept: 'Variables',
    difficulty: 'easy',
    prompt: 'Declare uma variavel de texto e use-a dentro de uma string com echo.',
    code: `NAME="world"
echo "Hello, $NAME!"`,
  },
  {
    id: 'bash-002',
    concept: 'If/Else',
    difficulty: 'easy',
    prompt: 'Use if com o operador -f para verificar se um arquivo existe e exibir a mensagem correspondente.',
    code: `if [ -f "$FILE" ]; then
    echo "File exists"
else
    echo "File not found"
fi`,
  },
  {
    id: 'bash-003',
    concept: 'For Loop',
    difficulty: 'easy',
    prompt: 'Itere sobre todos os arquivos .txt do diretorio e exiba o nome e contagem de linhas de cada um.',
    code: `for file in *.txt; do
    echo "Processing $file"
    wc -l "$file"
done`,
  },
  {
    id: 'bash-004',
    concept: 'While Loop',
    difficulty: 'medium',
    prompt: 'Use while loop com contador para imprimir os numeros de 0 a 9 com aritmetica bash.',
    code: `count=0
while [ $count -lt 10 ]; do
    echo "Count: $count"
    count=$((count + 1))
done`,
  },
  {
    id: 'bash-005',
    concept: 'Function',
    difficulty: 'medium',
    prompt: 'Defina uma funcao bash com variavel local, use $1 para o argumento e retorne 0.',
    code: `greet() {
    local name="$1"
    echo "Hello, $name!"
    return 0
}
greet "Alice"`,
  },
  {
    id: 'bash-006',
    concept: 'Pipes',
    difficulty: 'medium',
    prompt: 'Encadeie cat, grep, awk, sort, uniq e head para listar as URLs com mais erros 404 em um log.',
    code: `cat access.log | grep "404" | awk '{print $7}' | sort | uniq -c | sort -rn | head -10`,
  },
  {
    id: 'bash-007',
    concept: 'Redirection',
    difficulty: 'easy',
    prompt: 'Redirecione stdout e stderr para um arquivo e adicione output de outro comando a um segundo arquivo.',
    code: `command > output.txt 2>&1
cat input.txt | sort >> sorted.txt`,
  },
  {
    id: 'bash-008',
    concept: 'Arrays',
    difficulty: 'medium',
    prompt: 'Declare um array, acesse um elemento por indice, obtenha o tamanho e adicione um novo elemento.',
    code: `fruits=("apple" "banana" "cherry")
echo "\${fruits[0]}"
echo "\${#fruits[@]}"
fruits+=("date")`,
  },
  {
    id: 'bash-009',
    concept: 'Case Statement',
    difficulty: 'medium',
    prompt: 'Use um case statement para tratar argumentos de linha de comando como start, stop ou uso invalido.',
    code: `case "$1" in
    start)
        echo "Starting..."
        ;;
    stop)
        echo "Stopping..."
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        ;;
esac`,
  },
  {
    id: 'bash-010',
    concept: 'String Operations',
    difficulty: 'hard',
    prompt: 'Use expansao de parametro para remover extensao, obter a ultima extensao e substituir parte de um nome de arquivo.',
    code: `filename="document.tar.gz"
echo "\${filename%.tar.gz}"
echo "\${filename##*.}"
echo "\${filename/tar/zip}"`,
  },
]
