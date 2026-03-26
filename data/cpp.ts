import { Snippet } from '@/lib/types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-001',
    concept: 'Template Function',
    difficulty: 'medium',
    prompt: 'Escreva uma funcao template generica que retorna o maior de dois valores de qualquer tipo comparavel.',
    code: `template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
  },
  {
    id: 'cpp-002',
    concept: 'Smart Pointer',
    difficulty: 'medium',
    prompt: 'Use make_unique e make_shared para criar objetos com propriedade unica e compartilhada.',
    code: `auto ptr = std::make_unique<User>("Alice", 30);
auto shared = std::make_shared<User>("Bob", 25);`,
  },
  {
    id: 'cpp-003',
    concept: 'Lambda',
    difficulty: 'medium',
    prompt: 'Use uma lambda generica como comparador para std::sort ordenar uma colecao por nome.',
    code: `auto compare = [](const auto& a, const auto& b) {
    return a.name < b.name;
};
std::sort(users.begin(), users.end(), compare);`,
  },
  {
    id: 'cpp-004',
    concept: 'Range-Based For',
    difficulty: 'easy',
    prompt: 'Itere sobre um vector de inteiros usando range-based for com const auto& para imprimir os valores.',
    code: `std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << " ";
}`,
  },
  {
    id: 'cpp-005',
    concept: 'Auto Type',
    difficulty: 'easy',
    prompt: 'Use auto para inferencia de tipo ao buscar em um container e desestruturar o par com structured binding.',
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
    prompt: 'Defina uma struct Point com campos double e um metodo const que calcula a distancia da origem.',
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
    prompt: 'Agrupe constantes e funcoes matematicas dentro de um namespace para evitar colisoes de nomes.',
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
    prompt: 'Adicione elementos a um vector, ordene-o e remova duplicatas usando o idioma erase-unique.',
    code: `std::vector<int> v = {3, 1, 4, 1, 5};
v.push_back(9);
std::sort(v.begin(), v.end());
v.erase(std::unique(v.begin(), v.end()), v.end());`,
  },
  {
    id: 'cpp-009',
    concept: 'Structured Bindings',
    difficulty: 'medium',
    prompt: 'Use structured bindings com auto& para desestruturar pares ao iterar um std::map.',
    code: `std::map<std::string, int> scores = {{"Alice", 95}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << "\\n";
}`,
  },
  {
    id: 'cpp-010',
    concept: 'Optional',
    difficulty: 'hard',
    prompt: 'Implemente uma funcao de busca que retorna std::optional para representar ausencia de resultado.',
    code: `std::optional<User> find(int id) {
    if (auto it = db.find(id); it != db.end()) {
        return it->second;
    }
    return std::nullopt;
}`,
  },
]
