import { Snippet } from '@/lib/types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-001',
    concept: 'Template Function',
    difficulty: 'medium',
    code: `template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
  },
  {
    id: 'cpp-002',
    concept: 'Smart Pointer',
    difficulty: 'medium',
    code: `auto ptr = std::make_unique<User>("Alice", 30);
auto shared = std::make_shared<User>("Bob", 25);`,
  },
  {
    id: 'cpp-003',
    concept: 'Lambda',
    difficulty: 'medium',
    code: `auto compare = [](const auto& a, const auto& b) {
    return a.name < b.name;
};
std::sort(users.begin(), users.end(), compare);`,
  },
  {
    id: 'cpp-004',
    concept: 'Range-Based For',
    difficulty: 'easy',
    code: `std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << " ";
}`,
  },
  {
    id: 'cpp-005',
    concept: 'Auto Type',
    difficulty: 'easy',
    code: `auto it = container.find(key);
if (it != container.end()) {
    auto& [k, v] = *it;
    std::cout << k << ": " << v;
}`,
  },
  {
    id: 'cpp-006',
    concept: 'Struct with Methods',
    difficulty: 'easy',
    code: `struct Point {
    double x, y;

    double distance() const {
        return std::sqrt(x * x + y * y);
    }
};`,
  },
  {
    id: 'cpp-007',
    concept: 'Namespace',
    difficulty: 'easy',
    code: `namespace math {
    constexpr double PI = 3.14159265358979;

    double area(double radius) {
        return PI * radius * radius;
    }
}`,
  },
  {
    id: 'cpp-008',
    concept: 'Vector Operations',
    difficulty: 'medium',
    code: `std::vector<int> v = {3, 1, 4, 1, 5};
v.push_back(9);
std::sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());`,
  },
  {
    id: 'cpp-009',
    concept: 'Structured Bindings',
    difficulty: 'medium',
    code: `std::map<std::string, int> scores = {{"Alice", 95}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << "\\n";
}`,
  },
  {
    id: 'cpp-010',
    concept: 'Optional',
    difficulty: 'hard',
    code: `std::optional<User> find(int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}`,
  },
]
