import { Snippet } from '@/lib/types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-001',
    concept: 'Class',
    difficulty: 'easy',
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
    code: `public <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}`,
  },
  {
    id: 'java-004',
    concept: 'Stream API',
    difficulty: 'medium',
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
    code: `Comparator<User> byAge = (a, b) ->
    Integer.compare(a.getAge(), b.getAge());`,
  },
  {
    id: 'java-006',
    concept: 'Optional',
    difficulty: 'medium',
    code: `Optional<User> user = findById(id);
String name = user
    .map(User::getName)
    .orElse("Unknown");`,
  },
  {
    id: 'java-007',
    concept: 'Record',
    difficulty: 'easy',
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
    code: `if (obj instanceof String s && s.length() > 5) {
    System.out.println(s.toUpperCase());
}`,
  },
]
