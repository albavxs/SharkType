import { Snippet } from '@/lib/types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-001',
    concept: { pt: 'Variáveis', en: 'Variables' },
    difficulty: 'easy',
    slot: 'var-declare',
    prompt: {
      pt: 'Variáveis em Bash são declaradas sem espaço no "=" e expandidas com $. Atribui "world" pra NAME e usa dentro de uma mensagem com echo -- aspas duplas deixam a variável expandir.',
      en: 'Bash variables are declared without spaces around "=" and expanded with $. Assign the string "world" to NAME and use it inside a message with echo -- double quotes allow variable expansion.',
    },
    code: `NAME="world"
echo "Hello, $NAME!"`,
  },
  {
    id: 'bash-002',
    concept: { pt: 'If/Else', en: 'If/Else' },
    difficulty: 'easy',
    slot: 'cond-if-else',
    prompt: {
      pt: 'Condicionais no Bash usam [ ] (test) pra avaliar expressões. O -f checa se o caminho é um arquivo regular. Testa $FILE com -f e mostra mensagens diferentes no then e no else.',
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
    concept: { pt: 'Laço For', en: 'For Loop' },
    difficulty: 'easy',
    slot: 'loop-for',
    prompt: {
      pt: 'For loop no Bash itera sobre glob patterns. Usa "for file in *.txt" pra percorrer todos os .txt do diretório atual, printa o nome de cada arquivo e conta as linhas com wc -l.',
      en: 'Bash for loops can iterate over glob patterns. Use "for file in *.txt" to iterate over all .txt files in the current directory, print each filename and count its lines with wc -l.',
    },
    code: `for file in *.txt; do
    echo "Processing $file"
    wc -l "$file"
done`,
  },
  {
    id: 'bash-004',
    concept: { pt: 'Laço While', en: 'While Loop' },
    difficulty: 'medium',
    slot: 'loop-while',
    prompt: {
      pt: 'While loop repete enquanto a condição for true. Usa [ $count -lt 10 ] pra rodar de 0 a 9: printa o contador em cada iteração e incrementa com aritmética bash ($((count + 1))).',
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
    slot: 'fn-basic',
    prompt: {
      pt: 'Funções no Bash agrupam comandos reutilizáveis e recebem args via $1, $2... Declara greet(), usa "local" pra criar uma variável com escopo local a partir de $1, printa a saudação e retorna 0.',
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
    concept: { pt: 'Tubulações', en: 'Pipes' },
    difficulty: 'medium',
    slot: 'adv-pattern',
    prompt: {
      pt: 'Pipe (|) joga a saída de um comando na entrada do próximo, formando pipelines. Encadeia cat, grep "404", awk pra extrair a URL, sort, uniq -c pra contar e sort -rn | head -10 pras mais frequentes.',
      en: 'Pipes (|) connect one command\'s output to the next command\'s input, creating pipelines. Chain cat, grep "404", awk to extract the URL, sort, uniq -c to count and sort -rn | head -10 for the most frequent.',
    },
    code: `cat access.log | grep "404" | awk '{print $7}' | sort | uniq -c | sort -rn | head -10`,
  },
]
