import { Snippet } from '@/lib/types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-001',
    concept: { pt: 'Classe', en: 'Class' },
    difficulty: 'easy',
    prompt: {
      pt: 'Classe em Java encapsula estado com campos privados e expoe comportamento com metodos publicos. Defina User com dois campos private (name e age) e um constructor publico que inicializa eles com "this.campo = parametro".',
      en: 'Classes in Java encapsulate state with private fields and expose behavior through public methods. Define User with two private fields (name and age) and a public constructor that initializes them using "this.field = parameter".',
    },
    code: `public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
}`,
    slot: 'class-basic',
  },
  {
    id: 'java-002',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interface em Java define um contrato; metodos default oferecem implementacao opcional pra manter retrocompatibilidade. Declare Printable com o metodo abstrato print() e um metodo default format() que so chama toString().',
      en: 'Java interfaces define contracts; default methods provide optional implementations for backward compatibility. Declare Printable with the abstract method print() and a default format() method that simply calls toString().',
    },
    code: `public interface Printable {
    void print();
    default String format() {
        return toString();
    }
}`,
    slot: 'obj-interface',
  },
  {
    id: 'java-003',
    concept: { pt: 'Genericos', en: 'Generics' },
    difficulty: 'medium',
    prompt: {
      pt: 'Metodo generico em Java aceita qualquer tipo que bata com a constraint. Implemente max<T extends Comparable<T>>: receba dois objetos do mesmo tipo comparavel e retorne o maior usando .compareTo() >= 0.',
      en: 'Generic methods in Java accept any type that satisfies the constraint. Implement max<T extends Comparable<T>>: take two objects of the same comparable type and return the greater one using .compareTo() >= 0.',
    },
    code: `public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
    slot: 'type-generic',
  },
  {
    id: 'java-004',
    concept: { pt: 'API de Fluxo', en: 'Stream API' },
    difficulty: 'medium',
    prompt: {
      pt: 'Stream API e o jeito funcional do Java de processar colecoes de forma declarativa. Filtre os usuarios maiores de 18, mapeie pra nome com method reference (User::getName), ordene e colete numa List.',
      en: 'Stream API is Java\'s functional pattern for processing collections declaratively. Filter users over 18, map to names with a method reference (User::getName), sort, and collect into a List.',
    },
    code: `List<String> names = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());`,
    slot: 'loop-filter',
  },
  {
    id: 'java-005',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lambda substitui instancia de interface funcional com uma sintaxe enxuta. Crie um Comparator<User> que ordena por idade usando Integer.compare — sem precisar criar uma classe anonima inteira.',
      en: 'Lambda expressions replace functional interface instances with concise syntax. Create a Comparator<User> that sorts by age using Integer.compare — no need to declare an entire anonymous class.',
    },
    code: `Comparator<User> byAge = (a, b) ->
    Integer.compare(a.getAge(), b.getAge());`,
    slot: 'fn-arrow',
  },
  {
    id: 'java-006',
    concept: { pt: 'Opcional', en: 'Optional' },
    difficulty: 'medium',
    prompt: {
      pt: 'Optional<T> evita NullPointerException representando a ausencia de valor de forma explicita. Busque um usuario por id, mapeie pro nome com .map(User::getName) e de "Unknown" como fallback com .orElse.',
      en: 'Optional<T> prevents NullPointerException by explicitly representing the absence of a value. Look up a user by id, map to the name with .map(User::getName), and provide "Unknown" as a fallback with .orElse.',
    },
    code: `Optional<User> user = findById(id);
String name = user
    .map(User::getName)
    .orElse("Unknown");`,
    slot: 'err-result',
  },
  {
    id: 'java-007',
    concept: { pt: 'Registro', en: 'Record' },
    difficulty: 'easy',
    prompt: {
      pt: 'Record (Java 14+) e uma classe imutavel de dados com constructor, getters, equals e toString gerados automaticamente. Declare Point com coordenadas x e y, e adicione um metodo distance() que calcula a distancia ate a origem.',
      en: 'Records (Java 14+) are immutable data classes with constructor, getters, equals, and toString generated automatically. Declare Point with x and y coordinates, and add an instance method distance() calculating the distance from the origin.',
    },
    code: `public record Point(double x, double y) {
    public double distance() {
        return Math.sqrt(x * x + y * y);
    }
}`,
    slot: 'obj-create',
  },
  {
    id: 'java-008',
    concept: { pt: 'Expressao Switch', en: 'Switch Expression' },
    difficulty: 'medium',
    prompt: {
      pt: 'Switch expression (Java 14+) retorna um valor e usa -> eliminando break e fall-through. Mapeie os valores do enum "day" pra strings usando a sintaxe nova, agrupando cases com virgula quando dao no mesmo resultado.',
      en: 'Switch expressions (Java 14+) return a value and use -> eliminating break and fall-through. Map enum "day" values to strings using the new syntax, grouping cases with commas when they map to the same result.',
    },
    code: `String label = switch (day) {
    case MONDAY, FRIDAY -> "Work";
    case SATURDAY, SUNDAY -> "Rest";
    default -> "Midweek";
};`,
    slot: 'cond-switch',
  },
  {
    id: 'java-009',
    concept: { pt: 'Try com Recursos', en: 'Try-With-Resources' },
    difficulty: 'medium',
    prompt: {
      pt: 'Try-with-resources garante o fechamento automatico de qualquer Closeable ao sair do bloco. Declare o BufferedReader na clausula try(...) — ele fecha sozinho, mesmo se rolar uma excecao durante a leitura.',
      en: 'Try-with-resources ensures automatic closing of any Closeable when exiting the block. Declare the BufferedReader in the try(...) clause — it will be closed automatically, even if an exception occurs during reading.',
    },
    code: `try (var reader = new BufferedReader(
        new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}`,
    slot: 'err-try-catch',
  },
  {
    id: 'java-010',
    concept: { pt: 'Casamento de Padroes', en: 'Pattern Matching' },
    difficulty: 'hard',
    prompt: {
      pt: 'Pattern matching com instanceof (Java 16+) checa o tipo e faz o cast numa expressao so. Verifique se "obj" e String, atribua a "s" na mesma linha e combine com && pra testar o tamanho — sem cast separado.',
      en: 'Pattern matching with instanceof (Java 16+) checks the type and casts in a single expression. Check if "obj" is a String, assign it to "s" on the same line, and combine with && to test length — no separate cast needed.',
    },
    code: `if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());
}`,
    slot: 'adv-pattern',
  },
  // ── If e Else ──────────────────────────────────────────────
  {
    id: 'java-011',
    concept: { pt: 'If Simples', en: 'Basic If' },
    difficulty: 'easy',
    prompt: {
      pt: 'If em Java usa parenteses na condicao e chaves pro bloco. Verifique se age e maior ou igual a 18 e imprima com System.out.println.',
      en: 'If in Java uses parentheses for the condition and braces for the block. Check if age is 18 or older and print with System.out.println.',
    },
    code: `if (age >= 18) {
    System.out.println("You are an adult");
}`,
    slot: 'cond-basic-if',
  },
  {
    id: 'java-012',
    concept: { pt: 'If-Else', en: 'If-Else' },
    difficulty: 'easy',
    prompt: {
      pt: 'If-else em Java permite escolher entre dois caminhos. Classifique score como "Pass" ou "Fail" e guarde numa variavel.',
      en: 'If-else in Java lets you choose between two paths. Classify score as "Pass" or "Fail" and store in a variable.',
    },
    code: `String result;
if (score >= 70) {
    result = "Pass";
} else {
    result = "Fail";
}`,
    slot: 'cond-if-else',
  },
  {
    id: 'java-013',
    concept: { pt: 'Operador Ternario', en: 'Ternary Operator' },
    difficulty: 'easy',
    prompt: {
      pt: 'O operador ternario em Java condensa um if-else em uma unica expressao. Use pra classificar idade em "adult" ou "minor".',
      en: 'The ternary operator in Java condenses an if-else into a single expression. Use it to classify age as "adult" or "minor".',
    },
    code: `String status = (age >= 18) ? "adult" : "minor";`,
    slot: 'cond-ternary',
  },
  {
    id: 'java-014',
    concept: { pt: 'Guard Clause', en: 'Guard Clause' },
    difficulty: 'easy',
    prompt: {
      pt: 'Guard clause retorna cedo pra evitar aninhamento excessivo. Valide os parametros no inicio do metodo e lance excecao se forem invalidos.',
      en: 'Guard clauses return early to avoid excessive nesting. Validate parameters at the start of the method and throw if invalid.',
    },
    code: `public void process(String input) {
    if (input == null || input.isEmpty()) {
        throw new IllegalArgumentException("input required");
    }
    System.out.println(input.toUpperCase());
}`,
    slot: 'cond-guard',
  },
  // ── Variaveis ──────────────────────────────────────────────
  {
    id: 'java-015',
    concept: { pt: 'Declaracao de Variavel', en: 'Variable Declaration' },
    difficulty: 'easy',
    prompt: {
      pt: 'Java exige o tipo na declaracao, mas desde o Java 10 "var" infere o tipo local. Declare variaveis com tipo explicito e com var.',
      en: 'Java requires the type in declarations, but since Java 10 "var" infers the local type. Declare variables with explicit type and with var.',
    },
    code: `String name = "Alice";
int age = 25;
var list = new ArrayList<String>();`,
    slot: 'var-declare',
  },
  {
    id: 'java-016',
    concept: { pt: 'Constante', en: 'Constant' },
    difficulty: 'easy',
    prompt: {
      pt: 'Em Java, constantes sao declaradas com "static final" e por convencao usam UPPER_SNAKE_CASE. Declare PI e MAX_RETRIES como constantes de classe.',
      en: 'In Java, constants are declared with "static final" and by convention use UPPER_SNAKE_CASE. Declare PI and MAX_RETRIES as class constants.',
    },
    code: `public static final double PI = 3.14159;
public static final int MAX_RETRIES = 3;`,
    slot: 'var-const',
  },
  {
    id: 'java-017',
    concept: { pt: 'Tipos Basicos', en: 'Basic Types' },
    difficulty: 'easy',
    prompt: {
      pt: 'Java tem tipos primitivos (int, double, boolean) e wrappers (Integer, Double). Declare um de cada e use autoboxing pra converter.',
      en: 'Java has primitive types (int, double, boolean) and wrappers (Integer, Double). Declare one of each and use autoboxing to convert.',
    },
    code: `int count = 42;
double price = 9.99;
boolean active = true;
Integer boxed = count;`,
    slot: 'var-types',
  },
  {
    id: 'java-018',
    concept: { pt: 'Interpolacao de String', en: 'String Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Java usa String.format ou concatenacao pra montar strings. Use String.format com %s e %d pra construir uma saudacao.',
      en: 'Java uses String.format or concatenation to build strings. Use String.format with %s and %d to construct a greeting.',
    },
    code: `String name = "Alice";
int age = 30;
String msg = String.format("Hello, %s! You are %d.", name, age);`,
    slot: 'var-interpolation',
  },
  {
    id: 'java-019',
    concept: { pt: 'Array e Lista', en: 'Array and List' },
    difficulty: 'easy',
    prompt: {
      pt: 'Java tem arrays nativos e ArrayList pra colecoes dinamicas. Crie um ArrayList, adicione elementos e acesse por indice.',
      en: 'Java has native arrays and ArrayList for dynamic collections. Create an ArrayList, add elements, and access by index.',
    },
    code: `List<String> fruits = new ArrayList<>();
fruits.add("apple");
fruits.add("banana");
String first = fruits.get(0);`,
    slot: 'var-array',
  },
  {
    id: 'java-020',
    concept: { pt: 'Desestruturacao com Record', en: 'Destructuring with Record' },
    difficulty: 'medium',
    prompt: {
      pt: 'Java 21+ suporta record patterns pra desestruturar direto no if. Use pattern matching pra extrair x e y de um Point.',
      en: 'Java 21+ supports record patterns for direct destructuring in if. Use pattern matching to extract x and y from a Point.',
    },
    code: `if (obj instanceof Point(double x, double y)) {
    System.out.println("x=" + x + ", y=" + y);
}`,
    slot: 'var-destructure',
  },
  // ── Funcoes ────────────────────────────────────────────────
  {
    id: 'java-021',
    concept: { pt: 'Metodo Simples', en: 'Simple Method' },
    difficulty: 'easy',
    prompt: {
      pt: 'Metodo em Java define o tipo de retorno, nome e parametros. Crie um metodo estatico add que recebe dois inteiros e retorna a soma.',
      en: 'Methods in Java define return type, name, and parameters. Create a static method add that takes two ints and returns the sum.',
    },
    code: `public static int add(int a, int b) {
    return a + b;
}`,
    slot: 'fn-basic',
  },
  {
    id: 'java-022',
    concept: { pt: 'Callback com Interface Funcional', en: 'Callback with Functional Interface' },
    difficulty: 'medium',
    prompt: {
      pt: 'Em Java, callbacks sao passados como interfaces funcionais. Crie um metodo que aceita um Consumer<String> e o executa.',
      en: 'In Java, callbacks are passed as functional interfaces. Create a method that accepts a Consumer<String> and executes it.',
    },
    code: `public void greet(String name, Consumer<String> callback) {
    String msg = "Hello, " + name;
    callback.accept(msg);
}`,
    slot: 'fn-callback',
  },
  {
    id: 'java-023',
    concept: { pt: 'Closure com Lambda', en: 'Closure with Lambda' },
    difficulty: 'medium',
    prompt: {
      pt: 'Lambdas em Java capturam variaveis efetivamente finais do escopo externo. Crie um Supplier que captura um prefixo e retorna uma string formatada.',
      en: 'Java lambdas capture effectively final variables from the outer scope. Create a Supplier that captures a prefix and returns a formatted string.',
    },
    code: `String prefix = "Hello";
Supplier<String> greeter = () -> prefix + ", World!";
System.out.println(greeter.get());`,
    slot: 'fn-closure',
  },
  {
    id: 'java-024',
    concept: { pt: 'Parametros Default com Overload', en: 'Default Params via Overload' },
    difficulty: 'easy',
    prompt: {
      pt: 'Java nao tem parametros default, mas usa overloading pra simular. Crie duas versoes de greet — uma com nome e titulo, outra so com nome que chama a primeira.',
      en: 'Java has no default parameters, but uses overloading to simulate them. Create two versions of greet — one with name and title, another with just name that calls the first.',
    },
    code: `public String greet(String name, String title) {
    return "Hello, " + title + " " + name;
}

public String greet(String name) {
    return greet(name, "Mr.");
}`,
    slot: 'fn-default-params',
  },
  // ── Loops ──────────────────────────────────────────────────
  {
    id: 'java-025',
    concept: { pt: 'For Classico', en: 'Classic For' },
    difficulty: 'easy',
    prompt: {
      pt: 'O for classico em Java tem inicializador, condicao e incremento separados por ";". Use pra imprimir de 0 a 4.',
      en: 'The classic for loop in Java has initializer, condition, and increment separated by ";". Use it to print 0 through 4.',
    },
    code: `for (int i = 0; i < 5; i++) {
    System.out.println(i);
}`,
    slot: 'loop-for',
  },
  {
    id: 'java-026',
    concept: { pt: 'While', en: 'While' },
    difficulty: 'easy',
    prompt: {
      pt: 'While em Java repete enquanto a condicao for verdadeira. Use pra ler linhas de um BufferedReader ate retornar null.',
      en: 'While in Java repeats while the condition is true. Use it to read lines from a BufferedReader until it returns null.',
    },
    code: `String line;
while ((line = reader.readLine()) != null) {
    System.out.println(line);
}`,
    slot: 'loop-while',
  },
  {
    id: 'java-027',
    concept: { pt: 'For-Each', en: 'For-Each' },
    difficulty: 'easy',
    prompt: {
      pt: 'For-each em Java itera sobre qualquer Iterable sem lidar com indice. Percorra uma lista de strings e imprima cada uma.',
      en: 'For-each in Java iterates over any Iterable without index management. Loop through a list of strings and print each one.',
    },
    code: `List<String> names = List.of("Alice", "Bob", "Carol");
for (String name : names) {
    System.out.println(name);
}`,
    slot: 'loop-foreach',
  },
  {
    id: 'java-028',
    concept: { pt: 'IntStream Range', en: 'IntStream Range' },
    difficulty: 'medium',
    prompt: {
      pt: 'IntStream.range gera uma sequencia de inteiros como stream. Use pra gerar numeros de 1 a 10 e colete numa lista.',
      en: 'IntStream.range generates a sequence of integers as a stream. Use it to generate numbers from 1 to 10 and collect into a list.',
    },
    code: `List<Integer> nums = IntStream.rangeClosed(1, 10)
    .boxed()
    .collect(Collectors.toList());`,
    slot: 'loop-range',
  },
  // ── Objetos ────────────────────────────────────────────────
  {
    id: 'java-029',
    concept: { pt: 'Metodos de Objeto', en: 'Object Methods' },
    difficulty: 'easy',
    prompt: {
      pt: 'Metodos de instancia operam sobre o estado do objeto. Adicione getters e um metodo toString ao User.',
      en: 'Instance methods operate on the object\'s state. Add getters and a toString method to User.',
    },
    code: `public String getName() { return name; }
public int getAge() { return age; }

@Override
public String toString() {
    return name + " (" + age + ")";
}`,
    slot: 'obj-methods',
  },
  {
    id: 'java-030',
    concept: { pt: 'Objeto Aninhado', en: 'Nested Object' },
    difficulty: 'medium',
    prompt: {
      pt: 'Objetos aninhados em Java sao composicao — uma classe contem outra como campo. Crie Company com um campo Address.',
      en: 'Nested objects in Java use composition — one class contains another as a field. Create Company with an Address field.',
    },
    code: `public class Company {
    private String name;
    private Address address;

    public record Address(String city, String state) {}
}`,
    slot: 'obj-nested',
  },
  // ── Classes ────────────────────────────────────────────────
  {
    id: 'java-031',
    concept: { pt: 'Heranca', en: 'Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: 'Heranca em Java usa "extends" pra reutilizar codigo da classe pai. Crie Employee que estende Person e adiciona o campo role.',
      en: 'Inheritance in Java uses "extends" to reuse code from the parent class. Create Employee extending Person and adding the role field.',
    },
    code: `public class Employee extends Person {
    private String role;

    public Employee(String name, int age, String role) {
        super(name, age);
        this.role = role;
    }
}`,
    slot: 'class-inherit',
  },
  {
    id: 'java-032',
    concept: { pt: 'Sobrescrita de Metodo', en: 'Method Override' },
    difficulty: 'medium',
    prompt: {
      pt: 'Override em Java redefine o comportamento do metodo da classe pai. Sobrescreva toString em Employee pra incluir o cargo.',
      en: 'Override in Java redefines the behavior of the parent class method. Override toString in Employee to include the role.',
    },
    code: `@Override
public String toString() {
    return getName() + " - " + role;
}`,
    slot: 'class-override',
  },
  {
    id: 'java-033',
    concept: { pt: 'Classe Abstrata', en: 'Abstract Class' },
    difficulty: 'medium',
    prompt: {
      pt: 'Classe abstrata em Java define metodos que as subclasses devem implementar. Crie Shape abstrata com area() e implemente Circle.',
      en: 'Abstract classes in Java define methods that subclasses must implement. Create abstract Shape with area() and implement Circle.',
    },
    code: `public abstract class Shape {
    public abstract double area();
}

public class Circle extends Shape {
    private double radius;
    public double area() {
        return Math.PI * radius * radius;
    }
}`,
    slot: 'class-abstract',
  },
  // ── Erros ──────────────────────────────────────────────────
  {
    id: 'java-034',
    concept: { pt: 'Excecao Customizada', en: 'Custom Exception' },
    difficulty: 'medium',
    prompt: {
      pt: 'Excecoes customizadas em Java estendem Exception ou RuntimeException. Crie ValidationException com um campo field.',
      en: 'Custom exceptions in Java extend Exception or RuntimeException. Create ValidationException with a field property.',
    },
    code: `public class ValidationException extends RuntimeException {
    private final String field;

    public ValidationException(String field, String message) {
        super(message);
        this.field = field;
    }
}`,
    slot: 'err-custom',
  },
  {
    id: 'java-035',
    concept: { pt: 'Finally', en: 'Finally' },
    difficulty: 'easy',
    prompt: {
      pt: 'O bloco finally em Java sempre executa, mesmo com excecao. Use try-catch-finally pra garantir que o recurso e liberado.',
      en: 'The finally block in Java always executes, even with an exception. Use try-catch-finally to ensure the resource is released.',
    },
    code: `Connection conn = null;
try {
    conn = getConnection();
    conn.execute(query);
} catch (SQLException e) {
    log.error("Query failed", e);
} finally {
    if (conn != null) conn.close();
}`,
    slot: 'err-finally',
  },
  // ── Tipos ──────────────────────────────────────────────────
  {
    id: 'java-036',
    concept: { pt: 'Union com Sealed', en: 'Union with Sealed' },
    difficulty: 'hard',
    prompt: {
      pt: 'Sealed classes (Java 17+) restringem quais classes podem herdar, simulando union types. Crie Result selado com Success e Failure.',
      en: 'Sealed classes (Java 17+) restrict which classes can inherit, simulating union types. Create sealed Result with Success and Failure.',
    },
    code: `public sealed interface Result<T>
    permits Success, Failure {
}
public record Success<T>(T value) implements Result<T> {}
public record Failure<T>(String error) implements Result<T> {}`,
    slot: 'type-union',
  },
  {
    id: 'java-037',
    concept: { pt: 'Constraint com Bounded', en: 'Bounded Type Constraint' },
    difficulty: 'hard',
    prompt: {
      pt: 'Bounded types em Java restringem genericos com extends. Crie um metodo que aceita apenas tipos que implementam Comparable e Serializable.',
      en: 'Bounded types in Java constrain generics with extends. Create a method accepting only types that implement Comparable and Serializable.',
    },
    code: `public <T extends Comparable<T> & Serializable> T clamp(T val, T min, T max) {
    if (val.compareTo(min) < 0) return min;
    if (val.compareTo(max) > 0) return max;
    return val;
}`,
    slot: 'type-constraint',
  },
  {
    id: 'java-038',
    concept: { pt: 'Tipo Utilitario com Wildcard', en: 'Utility Type with Wildcard' },
    difficulty: 'hard',
    prompt: {
      pt: 'Wildcards em Java permitem flexibilidade em genericos. Use "? extends Number" pra criar um metodo que soma qualquer lista numerica.',
      en: 'Wildcards in Java allow flexibility in generics. Use "? extends Number" to create a method that sums any numeric list.',
    },
    code: `public double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) {
        total += n.doubleValue();
    }
    return total;
}`,
    slot: 'type-utility',
  },
  // ── Avancado ───────────────────────────────────────────────
  {
    id: 'java-039',
    concept: { pt: 'Async com CompletableFuture', en: 'Async with CompletableFuture' },
    difficulty: 'hard',
    prompt: {
      pt: 'CompletableFuture e o mecanismo async do Java. Encadeie operacoes assincronas com supplyAsync, thenApply e thenAccept.',
      en: 'CompletableFuture is Java\'s async mechanism. Chain async operations with supplyAsync, thenApply, and thenAccept.',
    },
    code: `CompletableFuture.supplyAsync(() -> fetchUser(id))
    .thenApply(User::getName)
    .thenAccept(System.out::println)
    .exceptionally(e -> { log.error(e); return null; });`,
    slot: 'adv-async',
  },
  {
    id: 'java-040',
    concept: { pt: 'Anotacao Customizada', en: 'Custom Annotation' },
    difficulty: 'hard',
    prompt: {
      pt: 'Anotacoes em Java sao metadados declarativos. Crie uma anotacao @Validate retida em runtime com um campo message.',
      en: 'Java annotations are declarative metadata. Create a @Validate annotation retained at runtime with a message field.',
    },
    code: `@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Validate {
    String message() default "invalid";
}`,
    slot: 'adv-macro',
  },
  {
    id: 'java-041',
    concept: { pt: 'Threads Virtuais', en: 'Virtual Threads' },
    difficulty: 'hard',
    prompt: {
      pt: 'Virtual threads (Java 21+) sao threads leves gerenciadas pela JVM. Lance milhares delas com Executors.newVirtualThreadPerTaskExecutor.',
      en: 'Virtual threads (Java 21+) are lightweight JVM-managed threads. Launch thousands with Executors.newVirtualThreadPerTaskExecutor.',
    },
    code: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (String url : urls) {
        executor.submit(() -> fetch(url));
    }
}`,
    slot: 'adv-concurrent',
  },
]
