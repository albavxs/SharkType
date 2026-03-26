import { Snippet } from '@/lib/types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-001',
    concept: 'Class',
    difficulty: 'easy',
    prompt: 'Defina uma classe User com campos privados e construtor que inicializa nome e idade.',
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
    concept: 'Interface',
    difficulty: 'easy',
    prompt: 'Crie uma interface Printable com metodo abstrato e metodo default com implementacao.',
    code: `public interface Printable {
    void print();
    default String format() {
        return toString();
    }
}`,
  },
  {
    id: 'java-003',
    concept: 'Generics',
    difficulty: 'medium',
    prompt: 'Implemente um metodo generico que retorna o maior de dois objetos usando a interface Comparable.',
    code: `public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
  },
  {
    id: 'java-004',
    concept: 'Stream API',
    difficulty: 'medium',
    prompt: 'Use Stream API para filtrar usuarios maiores de 18, mapear para nomes e coletar em lista ordenada.',
    code: `List<String> names = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());`,
  },
  {
    id: 'java-005',
    concept: 'Lambda',
    difficulty: 'easy',
    prompt: 'Crie um Comparator de usuarios por idade usando expressao lambda.',
    code: `Comparator<User> byAge = (a, b) ->
    Integer.compare(a.getAge(), b.getAge());`,
  },
  {
    id: 'java-006',
    concept: 'Optional',
    difficulty: 'medium',
    prompt: 'Use Optional para buscar um usuario pelo id e retornar o nome ou um valor padrao.',
    code: `Optional<User> user = findById(id);
String name = user
    .map(User::getName)
    .orElse("Unknown");`,
  },
  {
    id: 'java-007',
    concept: 'Record',
    difficulty: 'easy',
    prompt: 'Defina um record Point com coordenadas e um metodo para calcular a distancia da origem.',
    code: `public record Point(double x, double y) {
    public double distance() {
        return Math.sqrt(x * x + y * y);
    }
}`,
  },
  {
    id: 'java-008',
    concept: 'Switch Expression',
    difficulty: 'medium',
    prompt: 'Use a nova sintaxe de switch expression com arrow para mapear dias da semana em categorias.',
    code: `String label = switch (day) {
    case MONDAY, FRIDAY -> "Work";
    case SATURDAY, SUNDAY -> "Rest";
    default -> "Midweek";
};`,
  },
  {
    id: 'java-009',
    concept: 'Try-With-Resources',
    difficulty: 'medium',
    prompt: 'Leia a primeira linha de um arquivo usando try-with-resources para fechamento automatico do reader.',
    code: `try (var reader = new BufferedReader(
        new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}`,
  },
  {
    id: 'java-010',
    concept: 'Pattern Matching',
    difficulty: 'hard',
    prompt: 'Use pattern matching com instanceof para verificar o tipo, fazer cast e acessar metodos em uma linha.',
    code: `if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());
}`,
  },
]
