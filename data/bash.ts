import { Snippet } from '@/lib/types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-001',
    concept: 'Variables',
    difficulty: 'easy',
    prompt: 'Variaveis em Bash sao declaradas sem espacos em torno do "=" e expandidas com $. Atribua a string "world" a NAME e use-a dentro de uma mensagem com echo — aspas duplas permitem a expansao de variaveis.',
    code: `NAME="world"
echo "Hello, $NAME!"`,
  },
  {
    id: 'bash-002',
    concept: 'If/Else',
    difficulty: 'easy',
    prompt: 'Condicionais Bash usam [ ] (test) para avaliar expressoes. O operador -f testa se um caminho aponta para um arquivo regular. Verifique $FILE com -f e exiba mensagens diferentes no then e no else.',
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
    prompt: 'For loops em Bash podem iterar sobre glob patterns. Use "for file in *.txt" para iterar sobre todos os arquivos .txt do diretorio atual, exiba o nome de cada arquivo e conte suas linhas com wc -l.',
    code: `for file in *.txt; do
    echo "Processing $file"
    wc -l "$file"
done`,
  },
  {
    id: 'bash-004',
    concept: 'While Loop',
    difficulty: 'medium',
    prompt: 'While loops repetem enquanto a condicao for verdadeira. Use [ $count -lt 10 ] para repetir de 0 a 9: imprima o contador em cada iteracao e incremente-o com aritmetica bash ($((count + 1))).',
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
    prompt: 'Funcoes Bash agrupam comandos reutilizaveis e recebem argumentos via $1, $2... Declare greet(), use "local" para criar uma variavel de escopo local a partir de $1, imprima a saudacao e retorne 0.',
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
    prompt: 'Pipes (|) conectam a saida de um comando a entrada do proximo, criando pipelines. Encadeie cat, grep "404", awk para extrair a URL, sort, uniq -c para contar e sort -rn | head -10 para as mais frequentes.',
    code: `cat access.log | grep "404" | awk '{print $7}' | sort | uniq -c | sort -rn | head -10`,
  },
  {
    id: 'bash-007',
    concept: 'Redirection',
    difficulty: 'easy',
    prompt: 'Redirecionamento controla destino de stdout e stderr. Use ">" para criar/sobrescrever um arquivo, "2>&1" para redirecionar stderr para o mesmo destino de stdout, e ">>" para adicionar sem apagar o conteudo existente.',
    code: `command > output.txt 2>&1
cat input.txt | sort >> sorted.txt`,
  },
  {
    id: 'bash-008',
    concept: 'Arrays',
    difficulty: 'medium',
    prompt: 'Arrays em Bash usam parenteses para declaracao e ${array[indice]} para acesso. Declare fruits, acesse o primeiro elemento com [0], obtenha o total de elementos com ${#fruits[@]} e adicione um novo com +=.',
    code: `fruits=("apple" "banana" "cherry")
echo "\${fruits[0]}"
echo "\${#fruits[@]}"
fruits+=("date")`,
  },
  {
    id: 'bash-009',
    concept: 'Case Statement',
    difficulty: 'medium',
    prompt: 'Case statements verificam um valor contra multiplos padroes com sintaxe limpa. Use case "$1" para tratar os argumentos "start" e "stop" com mensagens especificas, e o padrao "*" como fallback exibindo o uso correto.',
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
    prompt: 'Expansao de parametro manipula strings sem programas externos. Use ${var%padrao} para remover o sufixo mais curto, ${var##padrao} para remover o prefixo mais longo e ${var/antigo/novo} para substituir.',
    code: `filename="document.tar.gz"
echo "\${filename%.tar.gz}"
echo "\${filename##*.}"
echo "\${filename/tar/zip}"`,
  },
]
