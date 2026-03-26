import { Snippet } from '@/lib/types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-001',
    concept: { pt: 'Variáveis', en: 'Variables' },
    difficulty: 'easy',
    prompt: {
      pt: 'Variáveis em Bash são declaradas sem espaços em torno do "=" e expandidas com $. Atribua a string "world" a NAME e use-a dentro de uma mensagem com echo — aspas duplas permitem a expansão de variáveis.',
      en: 'Bash variables are declared without spaces around "=" and expanded with $. Assign the string "world" to NAME and use it inside a message with echo — double quotes allow variable expansion.',
    },
    code: `NAME="world"
echo "Hello, $NAME!"`,
  },
  {
    id: 'bash-002',
    concept: { pt: 'If/Else', en: 'If/Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'Condicionais Bash usam [ ] (test) para avaliar expressões. O operador -f testa se um caminho aponta para um arquivo regular. Verifique $FILE com -f e exiba mensagens diferentes no then e no else.',
      en: 'Bash conditionals use [ ] (test) to evaluate expressions. The -f operator checks if a path points to a regular file. Check $FILE with -f and display different messages in then and else.',
    },
    code: `if [ -f "$FILE" ]; then
    echo "File exists"
else
    echo "File not found"
fi`,
  },
  {
    id: 'bash-003',
    concept: { pt: 'For Loop', en: 'For Loop' },
    difficulty: 'easy',
    prompt: {
      pt: 'For loops em Bash podem iterar sobre glob patterns. Use "for file in *.txt" para iterar sobre todos os arquivos .txt do diretório atual, exiba o nome de cada arquivo e conte suas linhas com wc -l.',
      en: 'Bash for loops can iterate over glob patterns. Use "for file in *.txt" to iterate over all .txt files in the current directory, print each filename and count its lines with wc -l.',
    },
    code: `for file in *.txt; do
    echo "Processing $file"
    wc -l "$file"
done`,
  },
  {
    id: 'bash-004',
    concept: { pt: 'While Loop', en: 'While Loop' },
    difficulty: 'medium',
    prompt: {
      pt: 'While loops repetem enquanto a condição for verdadeira. Use [ $count -lt 10 ] para repetir de 0 a 9: imprima o contador em cada iteração e incremente-o com aritmética bash ($((count + 1))).',
      en: 'While loops repeat as long as the condition is true. Use [ $count -lt 10 ] to loop from 0 to 9: print the counter on each iteration and increment it with bash arithmetic ($((count + 1))).',
    },
    code: `count=0
while [ $count -lt 10 ]; do
    echo "Count: $count"
    count=$((count + 1))
done`,
  },
  {
    id: 'bash-005',
    concept: { pt: 'Função', en: 'Function' },
    difficulty: 'medium',
    prompt: {
      pt: 'Funções Bash agrupam comandos reutilizáveis e recebem argumentos via $1, $2... Declare greet(), use "local" para criar uma variável de escopo local a partir de $1, imprima a saudação e retorne 0.',
      en: 'Bash functions group reusable commands and receive arguments via $1, $2... Declare greet(), use "local" to create a local-scoped variable from $1, print the greeting and return 0.',
    },
    code: `greet() {
    local name="$1"
    echo "Hello, $name!"
    return 0
}
greet "Alice"`,
  },
  {
    id: 'bash-006',
    concept: { pt: 'Pipes', en: 'Pipes' },
    difficulty: 'medium',
    prompt: {
      pt: 'Pipes (|) conectam a saída de um comando à entrada do próximo, criando pipelines. Encadeie cat, grep "404", awk para extrair a URL, sort, uniq -c para contar e sort -rn | head -10 para as mais frequentes.',
      en: 'Pipes (|) connect one command\'s output to the next command\'s input, creating pipelines. Chain cat, grep "404", awk to extract the URL, sort, uniq -c to count and sort -rn | head -10 for the most frequent.',
    },
    code: `cat access.log | grep "404" | awk '{print $7}' | sort | uniq -c | sort -rn | head -10`,
  },
  {
    id: 'bash-007',
    concept: { pt: 'Redirecionamento', en: 'Redirection' },
    difficulty: 'easy',
    prompt: {
      pt: 'Redirecionamento controla destino de stdout e stderr. Use ">" para criar/sobrescrever um arquivo, "2>&1" para redirecionar stderr para o mesmo destino de stdout, e ">>" para adicionar sem apagar o conteúdo existente.',
      en: 'Redirection controls where stdout and stderr go. Use ">" to create/overwrite a file, "2>&1" to redirect stderr to the same destination as stdout, and ">>" to append without erasing existing content.',
    },
    code: `command > output.txt 2>&1
cat input.txt | sort >> sorted.txt`,
  },
  {
    id: 'bash-008',
    concept: { pt: 'Arrays', en: 'Arrays' },
    difficulty: 'medium',
    prompt: {
      pt: 'Arrays em Bash usam parênteses para declaração e ${array[índice]} para acesso. Declare fruits, acesse o primeiro elemento com [0], obtenha o total de elementos com ${#fruits[@]} e adicione um novo com +=.',
      en: 'Bash arrays use parentheses for declaration and ${array[index]} for access. Declare fruits, access the first element with [0], get the total count with ${#fruits[@]} and append a new one with +=.',
    },
    code: `fruits=("apple" "banana" "cherry")
echo "\${fruits[0]}"
echo "\${#fruits[@]}"
fruits+=("date")`,
  },
  {
    id: 'bash-009',
    concept: { pt: 'Case Statement', en: 'Case Statement' },
    difficulty: 'medium',
    prompt: {
      pt: 'Case statements verificam um valor contra múltiplos padrões com sintaxe limpa. Use case "$1" para tratar os argumentos "start" e "stop" com mensagens específicas, e o padrão "*" como fallback exibindo o uso correto.',
      en: 'Case statements check a value against multiple patterns with clean syntax. Use case "$1" to handle the "start" and "stop" arguments with specific messages, and the "*" pattern as a fallback showing correct usage.',
    },
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
    concept: { pt: 'Operações com String', en: 'String Operations' },
    difficulty: 'hard',
    prompt: {
      pt: 'Expansão de parâmetro manipula strings sem programas externos. Use ${var%padrão} para remover o sufixo mais curto, ${var##padrão} para remover o prefixo mais longo e ${var/antigo/novo} para substituir.',
      en: 'Parameter expansion manipulates strings without external programs. Use ${var%pattern} to remove the shortest suffix, ${var##pattern} to remove the longest prefix and ${var/old/new} to substitute.',
    },
    code: `filename="document.tar.gz"
echo "\${filename%.tar.gz}"
echo "\${filename##*.}"
echo "\${filename/tar/zip}"`,
  },
]
