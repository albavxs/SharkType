import type { Snippet } from '@/lib/types'

type Level = Snippet['difficulty']

function snippet(
  id: string,
  slot: string,
  pt: string,
  en: string,
  code: string,
  difficulty: Level = 'easy'
): Snippet {
  return {
    id,
    slot,
    concept: { pt, en },
    difficulty,
    prompt: {
      pt: `Pratique ${pt.toLowerCase()} em C e observe a sintaxe usada no exemplo.`,
      en: `Practice ${en.toLowerCase()} in C and pay attention to the syntax used in the example.`,
    },
    code,
  }
}

export const cSnippets: Snippet[] = [
  snippet('c-001', 'cond-basic-if', 'If simples', 'Basic if', `if (age >= 18) {\n    printf("adult\\n");\n}`),
  snippet('c-002', 'cond-if-else', 'If e else', 'If and else', `if (score >= 70) {\n    puts("pass");\n} else {\n    puts("fail");\n}`),
  snippet('c-003', 'cond-switch', 'Switch', 'Switch statement', `switch (status) {\n    case 0: puts("idle"); break;\n    case 1: puts("running"); break;\n    default: puts("unknown");\n}`),
  snippet('c-004', 'cond-guard', 'Cláusula de guarda', 'Guard clause', `int divide(int a, int b, int *out) {\n    if (b == 0 || out == NULL) return 0;\n    *out = a / b;\n    return 1;\n}`),

  snippet('c-005', 'var-declare', 'Declaração de variável', 'Variable declaration', `int count = 0;\ndouble price = 19.90;\nchar grade = 'A';`),
  snippet('c-006', 'var-const', 'Constante', 'Constant', `const double PI = 3.1415926535;\nconst int MAX_RETRIES = 3;`),
  snippet('c-007', 'var-types', 'Tipos básicos', 'Basic types', `int age = 20;\nlong total = 1000L;\nfloat ratio = 0.5f;\ndouble precise = 0.125;`),
  snippet('c-008', 'var-array', 'Arrays', 'Arrays', `int values[] = {4, 8, 15, 16, 23, 42};\nsize_t count = sizeof values / sizeof values[0];`),
  snippet('c-009', 'var-interpolation', 'Formatação de texto', 'String formatting', `char message[64];\nsnprintf(message, sizeof message, "User %s is %d", name, age);`),

  snippet('c-010', 'fn-basic', 'Função básica', 'Basic function', `int add(int a, int b) {\n    return a + b;\n}`),
  snippet('c-011', 'fn-callback', 'Callback com ponteiro de função', 'Function pointer callback', `int apply(int value, int (*operation)(int)) {\n    return operation(value);\n}`),

  snippet('c-012', 'obj-create', 'Struct', 'Struct', `typedef struct {\n    char name[32];\n    int age;\n} User;\n\nUser user = {"Ada", 36};`),
  snippet('c-013', 'obj-nested', 'Structs aninhadas', 'Nested structs', `typedef struct { int x, y; } Point;\ntypedef struct { Point origin; int width, height; } Rect;\nRect box = {{10, 20}, 100, 50};`),

  snippet('c-014', 'loop-for', 'Loop for', 'For loop', `for (int i = 0; i < 10; ++i) {\n    printf("%d\\n", i);\n}`),
  snippet('c-015', 'loop-while', 'Loop while', 'While loop', `while (node != NULL) {\n    printf("%d\\n", node->value);\n    node = node->next;\n}`),
  snippet('c-016', 'loop-foreach', 'Percorrer array', 'Iterating an array', `for (size_t i = 0; i < count; ++i) {\n    printf("%d\\n", values[i]);\n}`),

  snippet('c-017', 'type-generic', 'Seleção genérica', 'Generic selection', `#define type_name(x) _Generic((x), \\\n    int: "int", \\\n    double: "double", \\\n    default: "other")`, 'medium'),
  snippet('c-018', 'type-union', 'Union', 'Union', `union Number {\n    int integer;\n    double decimal;\n};\nunion Number value = {.integer = 42};`, 'medium'),
  snippet('c-019', 'type-constraint', 'Asserção em compilação', 'Compile-time assertion', `_Static_assert(sizeof(int) >= 4, "int must be at least 32 bits");`, 'medium'),
  snippet('c-020', 'type-utility', 'Alias de tipo', 'Type alias', `typedef unsigned long UserId;\nUserId current_user = 42UL;`, 'medium'),

  snippet('c-021', 'err-custom', 'Código de erro', 'Error code', `typedef enum {\n    APP_OK = 0,\n    APP_NOT_FOUND = 1,\n    APP_INVALID = 2\n} AppError;`, 'medium'),
  snippet('c-022', 'err-result', 'Resultado por retorno', 'Result via return value', `int parse_positive(const char *text, int *out) {\n    long value = strtol(text, NULL, 10);\n    if (value <= 0) return 0;\n    *out = (int)value;\n    return 1;\n}`, 'medium'),
  snippet('c-023', 'err-finally', 'Cleanup centralizado', 'Centralized cleanup', `FILE *file = fopen(path, "r");\nif (!file) goto cleanup;\n/* use file */\ncleanup:\nif (file) fclose(file);`, 'medium'),

  snippet('c-024', 'adv-macro', 'Macro', 'Macro', `#define ARRAY_LEN(xs) (sizeof(xs) / sizeof((xs)[0]))\nsize_t count = ARRAY_LEN(values);`, 'hard'),
  snippet('c-025', 'adv-pattern', 'Tabela de funções', 'Function table', `typedef int (*Operation)(int, int);\nOperation operations[] = {add, subtract, multiply};\nint result = operations[index](a, b);`, 'hard'),
  snippet('c-026', 'adv-concurrent', 'Threads C11', 'C11 threads', `thrd_t worker;\nthrd_create(&worker, run_worker, &context);\nthrd_join(worker, NULL);`, 'hard'),
]
