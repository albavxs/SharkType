import { Snippet } from '@/lib/types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-001',
    concept: { pt: 'Variáveis', en: 'Variables' },
    difficulty: 'easy',
    slot: 'var-declare',
    prompt: {
      pt: 'Variáveis em Bash são declaradas sem espaço no "=" e expandidas com $. Atribui "world" pra NAME e usa dentro de uma mensagem com echo — aspas duplas deixam a variável expandir.',
      en: 'Bash variables are declared without spaces around "=" and expanded with $. Assign the string "world" to NAME and use it inside a message with echo — double quotes allow variable expansion.',
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
  {
    id: 'bash-007',
    concept: { pt: 'Redirecionamento', en: 'Redirection' },
    difficulty: 'easy',
    prompt: {
      pt: 'Redirecionamento controla pra onde vão stdout e stderr. Usa ">" pra criar/sobrescrever arquivo, "2>&1" pra mandar stderr pro mesmo lugar que stdout, e ">>" pra appendar sem apagar o que já tem.',
      en: 'Redirection controls where stdout and stderr go. Use ">" to create/overwrite a file, "2>&1" to redirect stderr to the same destination as stdout, and ">>" to append without erasing existing content.',
    },
    code: `command > output.txt 2>&1
cat input.txt | sort >> sorted.txt`,
  },
  {
    id: 'bash-008',
    concept: { pt: 'Vetores', en: 'Arrays' },
    difficulty: 'medium',
    slot: 'var-array',
    prompt: {
      pt: 'Arrays no Bash usam parênteses pra declarar e ${array[index]} pra acessar. Declara fruits, pega o primeiro elemento com [0], vê o total com ${#fruits[@]} e adiciona um novo com +=.',
      en: 'Bash arrays use parentheses for declaration and ${array[index]} for access. Declare fruits, access the first element with [0], get the total count with ${#fruits[@]} and append a new one with +=.',
    },
    code: `fruits=("apple" "banana" "cherry")
echo "\${fruits[0]}"
echo "\${#fruits[@]}"
fruits+=("date")`,
  },
  {
    id: 'bash-009',
    concept: { pt: 'Estrutura Escolha', en: 'Case Statement' },
    difficulty: 'medium',
    slot: 'cond-switch',
    prompt: {
      pt: 'Case statement compara um valor contra vários padrões com sintaxe limpa. Usa case "$1" pra tratar os argumentos "start" e "stop" com mensagens específicas, e o "*" como fallback mostrando o uso correto.',
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
      pt: 'Expansão de parâmetro manipula strings sem precisar de programas externos. Usa ${var%pattern} pra remover o sufixo mais curto, ${var##pattern} pra tirar o prefixo mais longo e ${var/old/new} pra substituir.',
      en: 'Parameter expansion manipulates strings without external programs. Use ${var%pattern} to remove the shortest suffix, ${var##pattern} to remove the longest prefix and ${var/old/new} to substitute.',
    },
    code: `filename="document.tar.gz"
echo "\${filename%.tar.gz}"
echo "\${filename##*.}"
echo "\${filename/tar/zip}"`,
  },
  // ── New snippets ──────────────────────────────────────────────────────────
  {
    id: 'bash-011',
    concept: { pt: 'If Básico', en: 'Basic If' },
    difficulty: 'easy',
    slot: 'cond-basic-if',
    prompt: {
      pt: 'O if mais simples no Bash testa uma condição e executa comandos no then. Use [[ ]] pra verificar se uma variável não está vazia.',
      en: 'The simplest Bash if tests a condition and runs commands in then. Use [[ ]] to check if a variable is not empty.',
    },
    code: `NAME="Alice"
if [[ -n "$NAME" ]]; then
    echo "Name is set: $NAME"
fi`,
  },
  {
    id: 'bash-012',
    concept: { pt: 'Operador Ternário', en: 'Ternary Operator' },
    difficulty: 'easy',
    slot: 'cond-ternary',
    prompt: {
      pt: 'Bash não tem ternário, mas && e || combinados simulam o efeito. Use "condição && comando_true || comando_false" pra uma decisão inline.',
      en: 'Bash has no ternary, but && and || combined simulate it. Use "condition && true_cmd || false_cmd" for an inline decision.',
    },
    code: `age=20
[[ $age -ge 18 ]] && status="adult" || status="minor"
echo "Status: $status"`,
  },
  {
    id: 'bash-013',
    concept: { pt: 'Guard Clause', en: 'Guard Clause' },
    difficulty: 'medium',
    slot: 'cond-guard',
    prompt: {
      pt: 'Guard clauses em Bash usam testes com exit ou return antecipado pra validar pré-condições antes da lógica principal.',
      en: 'Bash guard clauses use tests with early exit or return to validate preconditions before the main logic.',
    },
    code: `process() {
    [[ -z "$1" ]] && { echo "no arg"; return 1; }
    [[ ! -f "$1" ]] && { echo "not a file"; return 1; }
    echo "Processing $1"
}
process "$1"`,
  },
  {
    id: 'bash-014',
    concept: { pt: 'Variável Readonly', en: 'Readonly Variable' },
    difficulty: 'easy',
    slot: 'var-const',
    prompt: {
      pt: 'readonly marca uma variável como constante em Bash. Qualquer tentativa de reatribuição gera erro. Use pra proteger configurações.',
      en: 'readonly marks a variable as constant in Bash. Any reassignment attempt causes an error. Use it to protect configurations.',
    },
    code: `readonly MAX_RETRIES=3
readonly API_URL="https://api.example.com"
echo "URL: $API_URL, max: $MAX_RETRIES"`,
  },
  {
    id: 'bash-015',
    concept: { pt: 'Tipos (declare)', en: 'Types (declare)' },
    difficulty: 'medium',
    slot: 'var-types',
    prompt: {
      pt: 'declare no Bash define tipos: -i pra inteiro, -a pra array, -A pra array associativo. Use declare pra criar variáveis tipadas.',
      en: 'Bash declare defines types: -i for integer, -a for array, -A for associative array. Use declare to create typed variables.',
    },
    code: `declare -i count=0
count+=5
echo "count: $count"
declare -A config
config[host]="localhost"
config[port]="8080"
echo "\${config[host]}:\${config[port]}"`,
  },
  {
    id: 'bash-016',
    concept: { pt: 'Interpolação', en: 'Interpolation' },
    difficulty: 'easy',
    slot: 'var-interpolation',
    prompt: {
      pt: 'Bash interpola variáveis dentro de aspas duplas com $ e ${var}. Use ${var} pra separar o nome da variável do texto ao redor.',
      en: 'Bash interpolates variables inside double quotes with $ and ${var}. Use ${var} to separate the variable name from surrounding text.',
    },
    code: `name="Bash"
version=5
echo "Running \${name} v\${version}"
echo "Path: \${HOME}/.config/\${name}"`,
  },
  {
    id: 'bash-017',
    concept: { pt: 'Callback com Função', en: 'Callback with Function' },
    difficulty: 'medium',
    slot: 'fn-callback',
    prompt: {
      pt: 'Bash simula callbacks passando nomes de funções como argumentos. A função receptora chama o nome recebido com "$callback".',
      en: 'Bash simulates callbacks by passing function names as arguments. The receiver calls the passed name with "$callback".',
    },
    code: `on_success() { echo "OK: $1"; }
on_error() { echo "FAIL: $1"; }

run_task() {
    local callback="$2"
    $callback "$1"
}
run_task "deploy" on_success`,
  },
  {
    id: 'bash-018',
    concept: { pt: 'Clausura (Variável Capturada)', en: 'Closure (Captured Variable)' },
    difficulty: 'medium',
    slot: 'fn-closure',
    prompt: {
      pt: 'Bash não tem closures reais, mas funções podem capturar variáveis do escopo pai via subshells e eval. Demonstre o padrão com variável capturada.',
      en: 'Bash has no real closures, but functions can capture parent scope variables via subshells and eval. Demonstrate the pattern with a captured variable.',
    },
    code: `make_greeter() {
    local greeting="$1"
    eval "$2() { echo \"$greeting, \\\$1!\"; }"
}
make_greeter "Hello" say_hello
say_hello "World"`,
  },
  {
    id: 'bash-019',
    concept: { pt: 'Parâmetros Padrão', en: 'Default Parameters' },
    difficulty: 'easy',
    slot: 'fn-default-params',
    prompt: {
      pt: 'Bash simula parâmetros padrão com ${1:-valor}. Se o argumento não for passado, o valor padrão é usado automaticamente.',
      en: 'Bash simulates default parameters with ${1:-value}. If the argument is not passed, the default value is used automatically.',
    },
    code: `greet() {
    local name="\${1:-World}"
    local greeting="\${2:-Hello}"
    echo "$greeting, $name!"
}
greet
greet "Alice" "Hi"`,
  },
  {
    id: 'bash-020',
    concept: { pt: 'Foreach com For-In', en: 'Foreach with For-In' },
    difficulty: 'easy',
    slot: 'loop-foreach',
    prompt: {
      pt: 'for-in no Bash itera sobre listas e expansões. Use pra percorrer os elementos de um array e processar cada um.',
      en: 'Bash for-in iterates over lists and expansions. Use it to traverse array elements and process each one.',
    },
    code: `fruits=("apple" "banana" "cherry")
for fruit in "\${fruits[@]}"; do
    echo "Fruit: $fruit"
done`,
  },
  {
    id: 'bash-021',
    concept: { pt: 'Filtro com Grep', en: 'Filter with Grep' },
    difficulty: 'medium',
    slot: 'loop-filter',
    prompt: {
      pt: 'Bash filtra dados com grep em pipelines. Combine echo, grep e loops pra selecionar elementos que atendem uma condição.',
      en: 'Bash filters data with grep in pipelines. Combine echo, grep and loops to select elements matching a condition.',
    },
    code: `nums=(1 2 3 4 5 6 7 8 9 10)
evens=()
for n in "\${nums[@]}"; do
    (( n % 2 == 0 )) && evens+=("$n")
done
echo "Evens: \${evens[*]}"`,
  },
  {
    id: 'bash-022',
    concept: { pt: 'Sequência e Range', en: 'Sequence and Range' },
    difficulty: 'easy',
    slot: 'loop-range',
    prompt: {
      pt: 'Bash gera ranges com seq, {start..end} e {start..end..step}. Use diferentes formas pra iterar sobre intervalos numéricos.',
      en: 'Bash generates ranges with seq, {start..end} and {start..end..step}. Use different forms to iterate over numeric intervals.',
    },
    code: `for i in {1..5}; do
    echo -n "$i "
done
echo
for i in $(seq 0 2 10); do
    echo -n "$i "
done`,
  },
  {
    id: 'bash-023',
    concept: { pt: 'Array Associativo', en: 'Associative Array' },
    difficulty: 'medium',
    slot: 'obj-create',
    prompt: {
      pt: 'Arrays associativos (declare -A) funcionam como objetos/dicionários no Bash. Crie um, adicione campos e itere sobre as chaves.',
      en: 'Associative arrays (declare -A) work as objects/dictionaries in Bash. Create one, add fields and iterate over keys.',
    },
    code: `declare -A person
person[name]="Alice"
person[age]=30
person[city]="SP"
for key in "\${!person[@]}"; do
    echo "$key: \${person[$key]}"
done`,
  },
  {
    id: 'bash-024',
    concept: { pt: 'Funções sobre Dados', en: 'Functions on Data' },
    difficulty: 'medium',
    slot: 'obj-methods',
    prompt: {
      pt: 'Bash simula métodos com funções que operam em arrays associativos passados por referência (declare -n). Crie funções que leem e modificam dados.',
      en: 'Bash simulates methods with functions that operate on associative arrays passed by reference (declare -n). Create functions that read and modify data.',
    },
    code: `get_field() {
    declare -n ref="$1"
    echo "\${ref[$2]}"
}
declare -A user
user[name]="Alice"
user[role]="admin"
get_field user name
get_field user role`,
  },
  {
    id: 'bash-025',
    concept: { pt: 'Trap e Tratamento de Erros', en: 'Trap and Error Handling' },
    difficulty: 'medium',
    slot: 'err-try-catch',
    prompt: {
      pt: 'Bash simula try/catch com trap e set -e. Use trap pra capturar erros e executar cleanup quando um comando falha.',
      en: 'Bash simulates try/catch with trap and set -e. Use trap to catch errors and run cleanup when a command fails.',
    },
    code: `cleanup() { echo "Cleaning up..."; }
trap cleanup EXIT

set -e
echo "Step 1"
echo "Step 2"
echo "All done"`,
  },
  {
    id: 'bash-026',
    concept: { pt: 'Código de Erro Customizado', en: 'Custom Error Code' },
    difficulty: 'medium',
    slot: 'err-custom',
    prompt: {
      pt: 'Bash usa códigos de saída (0-255) pra sinalizar erros. Crie funções que retornam códigos específicos e verifique com $?.',
      en: 'Bash uses exit codes (0-255) to signal errors. Create functions that return specific codes and check with $?.',
    },
    code: `validate_age() {
    [[ "$1" -lt 0 ]] && { echo "negative age"; return 2; }
    [[ "$1" -gt 150 ]] && { echo "too old"; return 3; }
    echo "valid: $1"; return 0
}
validate_age -1
echo "Exit code: $?"`,
  },
  {
    id: 'bash-027',
    concept: { pt: 'Result com Return', en: 'Result with Return' },
    difficulty: 'medium',
    slot: 'err-result',
    prompt: {
      pt: 'Bash simula o padrão Result combinando stdout pra o valor e o código de retorno pra sucesso/erro. Capture ambos pra tratar o resultado.',
      en: 'Bash simulates the Result pattern combining stdout for the value and the return code for success/error. Capture both to handle the result.',
    },
    code: `parse_int() {
    if [[ "$1" =~ ^[0-9]+$ ]]; then
        echo "$1"; return 0
    else
        echo "invalid: $1"; return 1
    fi
}
val=$(parse_int "42") && echo "Ok: $val" || echo "Err: $val"`,
  },
  {
    id: 'bash-028',
    concept: { pt: 'Trap Finally', en: 'Trap Finally' },
    difficulty: 'medium',
    slot: 'err-finally',
    prompt: {
      pt: 'trap EXIT funciona como finally: executa sempre, mesmo com erros. Use pra garantir que recursos temporários sejam limpos.',
      en: 'trap EXIT works like finally: it always runs, even on errors. Use it to ensure temporary resources are cleaned up.',
    },
    code: `tmpfile=$(mktemp)
trap "rm -f $tmpfile; echo 'Cleaned up'" EXIT

echo "data" > "$tmpfile"
cat "$tmpfile"`,
  },
  {
    id: 'bash-029',
    concept: { pt: 'Função Arrow (Alias)', en: 'Arrow Function (Alias)' },
    difficulty: 'easy',
    slot: 'fn-arrow',
    prompt: {
      pt: 'Bash não tem arrow functions, mas aliases e funções inline de uma linha servem como equivalente compacto. Crie funções curtas numa única linha.',
      en: 'Bash has no arrow functions, but aliases and one-liner inline functions serve as a compact equivalent. Create short functions in a single line.',
    },
    code: `double() { echo $(( $1 * 2 )); }
square() { echo $(( $1 * $1 )); }
echo "double 5: $(double 5)"
echo "square 4: $(square 4)"`,
  },
  {
    id: 'bash-030',
    concept: { pt: 'Async com Background', en: 'Async with Background' },
    difficulty: 'hard',
    slot: 'adv-async',
    prompt: {
      pt: 'Bash roda processos em background com & e espera com wait. Use pra executar tarefas em paralelo e coletar os resultados.',
      en: 'Bash runs background processes with & and waits with wait. Use it to execute tasks in parallel and collect results.',
    },
    code: `task() { sleep 0.1; echo "Task $1 done"; }

task 1 &
task 2 &
task 3 &
wait
echo "All tasks complete"`,
  },
  {
    id: 'bash-031',
    concept: { pt: 'Concorrência com Named Pipes', en: 'Concurrency with Named Pipes' },
    difficulty: 'hard',
    slot: 'adv-concurrent',
    prompt: {
      pt: 'Named pipes (mkfifo) permitem comunicação entre processos no Bash. Crie um pipe pra enviar dados entre um produtor e consumidor.',
      en: 'Named pipes (mkfifo) enable inter-process communication in Bash. Create a pipe to send data between a producer and consumer.',
    },
    code: `pipe=$(mktemp -u)
mkfifo "$pipe"
trap "rm -f $pipe" EXIT

echo "hello from producer" > "$pipe" &
cat < "$pipe"
wait`,
  },
  {
    id: 'bash-032',
    concept: { pt: 'Macro com Eval', en: 'Macro with Eval' },
    difficulty: 'hard',
    slot: 'adv-macro',
    prompt: {
      pt: 'eval em Bash executa strings como código, funcionando como uma macro. Use pra gerar e executar comandos dinamicamente.',
      en: 'Bash eval executes strings as code, acting like a macro. Use it to generate and execute commands dynamically.',
    },
    code: `make_var() {
    eval "$1=\\"$2\\""
}
make_var greeting "Hello, World"
echo "$greeting"

cmd="echo 'dynamic command'"
eval "$cmd"`,
  },
]
