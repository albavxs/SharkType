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
      pt: `Pratique ${pt.toLowerCase()} em C# e observe a sintaxe usada no exemplo.`,
      en: `Practice ${en.toLowerCase()} in C# and pay attention to the syntax used in the example.`,
    },
    code,
  }
}

export const csharpSnippets: Snippet[] = [
  snippet('cs-001', 'cond-basic-if', 'If simples', 'Basic if', `if (age >= 18)\n{\n    Console.WriteLine("adult");\n}`),
  snippet('cs-002', 'cond-if-else', 'If e else', 'If and else', `if (score >= 70)\n{\n    Console.WriteLine("pass");\n}\nelse\n{\n    Console.WriteLine("fail");\n}`),
  snippet('cs-003', 'cond-ternary', 'Operador ternário', 'Ternary operator', `string status = user.IsActive ? "online" : "offline";`),
  snippet('cs-004', 'cond-switch', 'Switch expression', 'Switch expression', `string label = status switch\n{\n    200 => "OK",\n    404 => "Not Found",\n    _ => "Unknown"\n};`),
  snippet('cs-005', 'cond-guard', 'Cláusula de guarda', 'Guard clause', `static int Divide(int a, int b)\n{\n    if (b == 0) throw new ArgumentException("b cannot be zero");\n    return a / b;\n}`),

  snippet('cs-006', 'var-declare', 'Declaração de variável', 'Variable declaration', `int count = 0;\nstring name = "Ada";\nbool active = true;`),
  snippet('cs-007', 'var-const', 'Constante', 'Constant', `const double Pi = 3.1415926535;\nconst int MaxRetries = 3;`),
  snippet('cs-008', 'var-types', 'Tipos básicos', 'Basic types', `int age = 20;\ndouble price = 19.90;\ndecimal balance = 125.50m;\nstring name = "Ada";`),
  snippet('cs-009', 'var-interpolation', 'Interpolação de string', 'String interpolation', `string message = $"User {name} is {age} years old";`),
  snippet('cs-010', 'var-array', 'Arrays e listas', 'Arrays and lists', `int[] values = { 4, 8, 15, 16, 23, 42 };\nvar names = new List<string> { "Ada", "Linus" };`),
  snippet('cs-011', 'var-destructure', 'Desconstrução', 'Deconstruction', `(string name, int age) = user;`),

  snippet('cs-012', 'fn-basic', 'Método básico', 'Basic method', `static int Add(int a, int b)\n{\n    return a + b;\n}`),
  snippet('cs-013', 'fn-arrow', 'Lambda', 'Lambda', `Func<int, int, int> add = (a, b) => a + b;`),
  snippet('cs-014', 'fn-callback', 'Callback com Action', 'Callback with Action', `static void Process(IEnumerable<int> values, Action<int> visit)\n{\n    foreach (int value in values) visit(value);\n}`),
  snippet('cs-015', 'fn-closure', 'Closure', 'Closure', `static Func<int> Counter()\n{\n    int count = 0;\n    return () => ++count;\n}`),
  snippet('cs-016', 'fn-default-params', 'Parâmetro opcional', 'Optional parameter', `static string Greet(string name, string prefix = "Hello")\n    => $"{prefix}, {name}!";`),

  snippet('cs-017', 'obj-create', 'Objeto', 'Object creation', `var user = new User("Ada", 36);`),
  snippet('cs-018', 'obj-methods', 'Métodos de objeto', 'Object methods', `public sealed class Counter\n{\n    public int Value { get; private set; }\n    public void Increment() => Value++;\n}`),
  snippet('cs-019', 'obj-interface', 'Interface', 'Interface', `public interface IRepository<T>\n{\n    T? FindById(int id);\n    void Save(T entity);\n}`),
  snippet('cs-020', 'obj-nested', 'Objeto aninhado', 'Nested object', `var city = user?.Address?.City ?? "Unknown";`),

  snippet('cs-021', 'loop-for', 'Loop for', 'For loop', `for (int i = 0; i < values.Length; i++)\n{\n    Console.WriteLine(values[i]);\n}`),
  snippet('cs-022', 'loop-while', 'Loop while', 'While loop', `while (queue.Count > 0)\n{\n    Console.WriteLine(queue.Dequeue());\n}`),
  snippet('cs-023', 'loop-foreach', 'Foreach', 'Foreach', `foreach (var item in items)\n{\n    Console.WriteLine(item);\n}`),
  snippet('cs-024', 'loop-filter', 'Filtro com LINQ', 'LINQ filtering', `var activeNames = users\n    .Where(user => user.Active)\n    .Select(user => user.Name)\n    .ToList();`, 'medium'),
  snippet('cs-025', 'loop-range', 'Range', 'Range', `foreach (int value in Enumerable.Range(1, 5))\n{\n    Console.WriteLine(value);\n}`),

  snippet('cs-026', 'type-generic', 'Genérico', 'Generic type', `public static T First<T>(IReadOnlyList<T> items)\n{\n    return items[0];\n}`, 'medium'),
  snippet('cs-027', 'type-constraint', 'Restrição genérica', 'Generic constraint', `public static T Create<T>() where T : new()\n{\n    return new T();\n}`, 'medium'),
  snippet('cs-028', 'type-utility', 'Tipo anulável', 'Nullable type', `string? nickname = null;\nint? score = user.Score;`, 'medium'),

  snippet('cs-029', 'err-try-catch', 'Try e catch', 'Try and catch', `try\n{\n    Save(user);\n}\ncatch (IOException ex)\n{\n    Console.Error.WriteLine(ex.Message);\n}`, 'medium'),
  snippet('cs-030', 'err-custom', 'Exceção customizada', 'Custom exception', `public sealed class InvalidOrderException : Exception\n{\n    public InvalidOrderException(string message) : base(message) { }\n}`, 'medium'),
  snippet('cs-031', 'err-result', 'Try pattern', 'Try pattern', `if (int.TryParse(input, out int value))\n{\n    Console.WriteLine(value);\n}`, 'medium'),
  snippet('cs-032', 'err-finally', 'Finally', 'Finally', `Stream? stream = null;\ntry\n{\n    stream = File.OpenRead(path);\n}\nfinally\n{\n    stream?.Dispose();\n}`, 'medium'),

  snippet('cs-033', 'class-basic', 'Classe', 'Class', `public class User\n{\n    public string Name { get; }\n    public User(string name) => Name = name;\n}`),
  snippet('cs-034', 'class-inherit', 'Herança', 'Inheritance', `public class Admin : User\n{\n    public Admin(string name) : base(name) { }\n}`),
  snippet('cs-035', 'class-override', 'Override', 'Override', `public override string ToString()\n{\n    return $"User: {Name}";\n}`),
  snippet('cs-036', 'class-abstract', 'Classe abstrata', 'Abstract class', `public abstract class Shape\n{\n    public abstract double Area();\n}`, 'medium'),

  snippet('cs-037', 'adv-async', 'Async e await', 'Async and await', `static async Task<User> LoadUserAsync(int id)\n{\n    using var response = await client.GetAsync($"/users/{id}");\n    return await response.Content.ReadFromJsonAsync<User>()\n        ?? throw new InvalidOperationException();\n}`, 'hard'),
  snippet('cs-038', 'adv-pattern', 'Pattern matching', 'Pattern matching', `string label = value switch\n{\n    int number when number > 0 => "positive",\n    string text when text.Length > 0 => "text",\n    _ => "other"\n};`, 'hard'),
  snippet('cs-039', 'adv-concurrent', 'Execução concorrente', 'Concurrent execution', `Task<User[]> usersTask = Task.WhenAll(\n    ids.Select(id => LoadUserAsync(id))\n);\nUser[] users = await usersTask;`, 'hard'),
]
