import { Snippet } from '@/lib/types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-001',
    concept: { pt: 'Class', en: 'Class' },
    difficulty: 'easy',
    prompt: {
      pt: 'Classe em Java encapsula estado com campos privados e expõe comportamento com métodos públicos. Defina User com dois campos private (name e age) e um constructor público que inicializa eles com "this.campo = parâmetro".',
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
  },
  {
    id: 'java-002',
    concept: { pt: 'Interface', en: 'Interface' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interface em Java define um contrato; métodos default oferecem implementação opcional pra manter retrocompatibilidade. Declare Printable com o método abstrato print() e um método default format() que só chama toString().',
      en: 'Java interfaces define contracts; default methods provide optional implementations for backward compatibility. Declare Printable with the abstract method print() and a default format() method that simply calls toString().',
    },
    code: `public interface Printable {
    void print();
    default String format() {
        return toString();
    }
}`,
  },
  {
    id: 'java-003',
    concept: { pt: 'Generics', en: 'Generics' },
    difficulty: 'medium',
    prompt: {
      pt: 'Método genérico em Java aceita qualquer tipo que bata com a constraint. Implemente max<T extends Comparable<T>>: receba dois objetos do mesmo tipo comparável e retorne o maior usando .compareTo() >= 0.',
      en: 'Generic methods in Java accept any type that satisfies the constraint. Implement max<T extends Comparable<T>>: take two objects of the same comparable type and return the greater one using .compareTo() >= 0.',
    },
    code: `public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
  },
  {
    id: 'java-004',
    concept: { pt: 'Stream API', en: 'Stream API' },
    difficulty: 'medium',
    prompt: {
      pt: 'Stream API é o jeito funcional do Java de processar coleções de forma declarativa. Filtre os usuários maiores de 18, mapeie pra nome com method reference (User::getName), ordene e colete numa List.',
      en: 'Stream API is Java\'s functional pattern for processing collections declaratively. Filter users over 18, map to names with a method reference (User::getName), sort, and collect into a List.',
    },
    code: `List<String> names = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());`,
  },
  {
    id: 'java-005',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lambda substitui instância de interface funcional com uma sintaxe enxuta. Crie um Comparator<User> que ordena por idade usando Integer.compare — sem precisar criar uma classe anônima inteira.',
      en: 'Lambda expressions replace functional interface instances with concise syntax. Create a Comparator<User> that sorts by age using Integer.compare — no need to declare an entire anonymous class.',
    },
    code: `Comparator<User> byAge = (a, b) ->
    Integer.compare(a.getAge(), b.getAge());`,
  },
  {
    id: 'java-006',
    concept: { pt: 'Optional', en: 'Optional' },
    difficulty: 'medium',
    prompt: {
      pt: 'Optional<T> evita NullPointerException representando a ausência de valor de forma explícita. Busque um usuário por id, mapeie pro nome com .map(User::getName) e dê "Unknown" como fallback com .orElse.',
      en: 'Optional<T> prevents NullPointerException by explicitly representing the absence of a value. Look up a user by id, map to the name with .map(User::getName), and provide "Unknown" as a fallback with .orElse.',
    },
    code: `Optional<User> user = findById(id);
String name = user
    .map(User::getName)
    .orElse("Unknown");`,
  },
  {
    id: 'java-007',
    concept: { pt: 'Record', en: 'Record' },
    difficulty: 'easy',
    prompt: {
      pt: 'Record (Java 14+) é uma classe imutável de dados com constructor, getters, equals e toString gerados automaticamente. Declare Point com coordenadas x e y, e adicione um método distance() que calcula a distância até a origem.',
      en: 'Records (Java 14+) are immutable data classes with constructor, getters, equals, and toString generated automatically. Declare Point with x and y coordinates, and add an instance method distance() calculating the distance from the origin.',
    },
    code: `public record Point(double x, double y) {
    public double distance() {
        return Math.sqrt(x * x + y * y);
    }
}`,
  },
  {
    id: 'java-008',
    concept: { pt: 'Switch Expression', en: 'Switch Expression' },
    difficulty: 'medium',
    prompt: {
      pt: 'Switch expression (Java 14+) retorna um valor e usa -> eliminando break e fall-through. Mapeie os valores do enum "day" pra strings usando a sintaxe nova, agrupando cases com vírgula quando dão no mesmo resultado.',
      en: 'Switch expressions (Java 14+) return a value and use -> eliminating break and fall-through. Map enum "day" values to strings using the new syntax, grouping cases with commas when they map to the same result.',
    },
    code: `String label = switch (day) {
    case MONDAY, FRIDAY -> "Work";
    case SATURDAY, SUNDAY -> "Rest";
    default -> "Midweek";
};`,
  },
  {
    id: 'java-009',
    concept: { pt: 'Try-With-Resources', en: 'Try-With-Resources' },
    difficulty: 'medium',
    prompt: {
      pt: 'Try-with-resources garante o fechamento automático de qualquer Closeable ao sair do bloco. Declare o BufferedReader na cláusula try(...) — ele fecha sozinho, mesmo se rolar uma exceção durante a leitura.',
      en: 'Try-with-resources ensures automatic closing of any Closeable when exiting the block. Declare the BufferedReader in the try(...) clause — it will be closed automatically, even if an exception occurs during reading.',
    },
    code: `try (var reader = new BufferedReader(
        new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}`,
  },
  {
    id: 'java-010',
    concept: { pt: 'Pattern Matching', en: 'Pattern Matching' },
    difficulty: 'hard',
    prompt: {
      pt: 'Pattern matching com instanceof (Java 16+) checa o tipo e faz o cast numa expressão só. Verifique se "obj" é String, atribua a "s" na mesma linha e combine com && pra testar o tamanho — sem cast separado.',
      en: 'Pattern matching with instanceof (Java 16+) checks the type and casts in a single expression. Check if "obj" is a String, assign it to "s" on the same line, and combine with && to test length — no separate cast needed.',
    },
    code: `if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());
}`,
  },
]
