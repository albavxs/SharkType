import { Snippet } from '@/lib/types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-001',
    concept: { pt: 'Função Template', en: 'Template Function' },
    difficulty: 'medium',
    prompt: {
      pt: 'Templates sao o jeito do C++ de escrever codigo genérico pra qualquer tipo. Monte max<T> com template<typename T>: receba dois parâmetros do mesmo tipo e devolva o maior usando o operador > com ternario.',
      en: 'Templates let you write generic code that works with any type in C++. Write max<T> with template<typename T>: take two parameters of the same type and return the larger one using the > operator with a ternary.',
    },
    code: `template <typename T>
T max(T a, T b) {
    return (a > b) ? a : b;
}`,
    slot: 'type-generic',
  },
  {
    id: 'cpp-002',
    concept: { pt: 'Ponteiro Inteligente', en: 'Smart Pointer' },
    difficulty: 'medium',
    prompt: {
      pt: 'Smart pointers cuidam da vida dos objetos automaticamente, sem precisar de raw pointers nem se preocupar com memory leaks. Use make_unique pra ownership exclusivo (destruido ao sair do escopo) e make_shared pra ownership compartilhado por referencia.',
      en: 'Smart pointers manage object lifetimes automatically, eliminating raw pointers and memory leaks. Use make_unique for exclusive ownership (destroyed when leaving scope) and make_shared for reference-counted shared ownership.',
    },
    code: `auto ptr = std::make_unique<User>("Alice", 30);
auto shared = std::make_shared<User>("Bob", 25);`,
    slot: 'adv-pattern',
  },
  {
    id: 'cpp-003',
    concept: { pt: 'Lambda', en: 'Lambda' },
    difficulty: 'medium',
    prompt: {
      pt: 'Lambdas em C++ capturam variáveis do escopo ao redor e servem como callbacks. Crie um comparador lambda com "const auto&" pra aceitar qualquer tipo e passe como terceiro argumento de std::sort pra ordenar usuarios por nome.',
      en: 'C++ lambdas capture the surrounding environment and can be passed as callbacks. Create a comparator lambda with "const auto&" to accept any type and use it as the third argument to std::sort to sort users by name.',
    },
    code: `auto compare = [](const auto& a, const auto& b) {
    return a.name < b.name;
};
std::sort(users.begin(), users.end(), compare);`,
    slot: 'fn-arrow',
  },
  {
    id: 'cpp-004',
    concept: { pt: 'For Baseado em Intervalo', en: 'Range-Based For' },
    difficulty: 'easy',
    prompt: {
      pt: 'Range-based for (C++11) deixa a iteracao em qualquer container bem mais limpa. Use "for (const auto& n : nums)" pra percorrer um vector<int> sem ficar mexendo com indice, e imprima cada valor com cout.',
      en: 'Range-based for (C++11) simplifies iteration over any container. Use "for (const auto& n : nums)" to safely iterate over a vector<int> without manual indices, and print each value with cout.',
    },
    code: `std::vector<int> nums = {1, 2, 3, 4, 5};
for (const auto& n : nums) {
    std::cout << n << " ";
}`,
    slot: 'loop-foreach',
  },
  {
    id: 'cpp-005',
    concept: { pt: 'Tipo Auto', en: 'Auto Type' },
    difficulty: 'easy',
    prompt: {
      pt: '"auto" deixa o compilador inferir o tipo da variável pra voce. Use pra pegar o iterador que .find() retorna, depois acesse com structured binding (auto& [k, v]) pra desestruturar o par sem precisar de .first e .second.',
      en: '"auto" infers the variable type at compile time. Use it for the iterator returned by .find(), then access the result with structured binding (auto& [k, v]) to destructure the pair without using .first and .second.',
    },
    code: `auto it = container.find(key);
if (it != container.end()) {
    auto& [k, v] = *it;
    std::cout << k << ": " << v;
}`,
    slot: 'var-destructure',
  },
  {
    id: 'cpp-006',
    concept: { pt: 'Struct com Métodos', en: 'Struct with Methods' },
    difficulty: 'easy',
    prompt: {
      pt: 'No C++ moderno, structs podem ter métodos igualzinho a classes. Defina Point com campos double x e y, e crie o método distance() marcado como "const" (nao altera o objeto) que calcula a norma com std::sqrt.',
      en: 'Modern C++ structs can have member methods just like classes. Define Point with double x and y fields, and add the distance() method marked as "const" (doesn\'t modify the object) that computes the norm with std::sqrt.',
    },
    code: `struct Point {
    double x, y;

    double distance() const {
        return std::sqrt(x * x + y * y);
    }
};`,
    slot: 'obj-methods',
  },
]
