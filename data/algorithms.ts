import { Snippet } from '@/lib/types'

export const algorithmsSnippets: Snippet[] = [
  {
    id: 'algo-001',
    concept: { pt: 'Notação Big O', en: 'Big O Notation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Big O descreve a complexidade de tempo de um algoritmo. Demonstre O(1), O(n) e O(n²) com exemplos práticos de operações comuns.',
      en: 'Big O describes an algorithm\'s time complexity. Demonstrate O(1), O(n), and O(n²) with practical examples of common operations.',
    },
    code: `// O(1) -- acesso direto
const first = arr[0];

// O(n) -- percorrer tudo
function includes(arr, target) {
  for (const item of arr) {
    if (item === target) return true;
  }
  return false;
}

// O(n²) -- loop aninhado
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}`,
  },
  {
    id: 'algo-002',
    concept: { pt: 'Busca Binária', en: 'Binary Search' },
    difficulty: 'medium',
    prompt: {
      pt: 'Busca binária divide o array ordenado ao meio a cada passo, alcançando O(log n). Implemente a busca que retorna o índice do alvo ou -1 se não encontrar.',
      en: 'Binary search halves a sorted array at each step, achieving O(log n). Implement the search that returns the target\'s index or -1 if not found.',
    },
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

binarySearch([1, 3, 5, 7, 9, 11], 7); // 3`,
  },
  {
    id: 'algo-003',
    concept: { pt: 'Bubble Sort', en: 'Bubble Sort' },
    difficulty: 'easy',
    prompt: {
      pt: 'Bubble Sort compara pares adjacentes e troca se estiverem fora de ordem -- O(n²). Implemente com otimização de parada antecipada quando não houver trocas.',
      en: 'Bubble Sort compares adjacent pairs and swaps if out of order -- O(n²). Implement with early stop optimization when no swaps occur.',
    },
    code: `function bubbleSort(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}

bubbleSort([5, 3, 8, 1, 2]); // [1, 2, 3, 5, 8]`,
  },
  {
    id: 'algo-004',
    concept: { pt: 'Merge Sort', en: 'Merge Sort' },
    difficulty: 'hard',
    prompt: {
      pt: 'Merge Sort divide o array recursivamente e depois intercala as metades ordenadas -- O(n log n). Implemente as funções mergeSort e merge.',
      en: 'Merge Sort recursively splits the array then merges sorted halves -- O(n log n). Implement the mergeSort and merge functions.',
    },
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i), right.slice(j));
}

mergeSort([38, 27, 43, 3, 9, 82, 10]);`,
  },
  {
    id: 'algo-005',
    concept: { pt: 'Quick Sort', en: 'Quick Sort' },
    difficulty: 'hard',
    prompt: {
      pt: 'Quick Sort escolhe um pivô e particiona o array em menores e maiores, depois ordena recursivamente -- O(n log n) médio. Implemente com pivô no último elemento.',
      en: 'Quick Sort picks a pivot and partitions the array into smaller and larger, then sorts recursively -- O(n log n) average. Implement with last element as pivot.',
    },
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

quickSort([10, 7, 8, 9, 1, 5]); // [1, 5, 7, 8, 9, 10]`,
  },
  {
    id: 'algo-006',
    concept: { pt: 'Pilha (Stack)', en: 'Stack' },
    difficulty: 'easy',
    prompt: {
      pt: 'Uma pilha segue LIFO (Last In, First Out). Implemente uma Stack com push, pop, peek e isEmpty usando um array interno.',
      en: 'A stack follows LIFO (Last In, First Out). Implement a Stack with push, pop, peek, and isEmpty using an internal array.',
    },
    code: `class Stack {
  constructor() {
    this.items = [];
  }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  get size() { return this.items.length; }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
stack.pop();  // 2
stack.peek(); // 1`,
  },
  {
    id: 'algo-007',
    concept: { pt: 'Fila (Queue)', en: 'Queue' },
    difficulty: 'easy',
    prompt: {
      pt: 'Uma fila segue FIFO (First In, First Out). Implemente uma Queue com enqueue, dequeue, front e isEmpty.',
      en: 'A queue follows FIFO (First In, First Out). Implement a Queue with enqueue, dequeue, front, and isEmpty.',
    },
    code: `class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
  get size() { return this.items.length; }
}

const queue = new Queue();
queue.enqueue('A');
queue.enqueue('B');
queue.dequeue(); // 'A'
queue.front();   // 'B'`,
  },
  {
    id: 'algo-008',
    concept: { pt: 'Lista Ligada', en: 'Linked List' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma lista ligada armazena nós onde cada um aponta pro próximo. Implemente inserção no início, no final e travessia.',
      en: 'A linked list stores nodes where each one points to the next. Implement insert at head, insert at tail, and traversal.',
    },
    code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  prepend(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) { this.head = node; return; }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = node;
  }

  toArray() {
    const result = [];
    let curr = this.head;
    while (curr) { result.push(curr.value); curr = curr.next; }
    return result;
  }
}`,
  },
  {
    id: 'algo-009',
    concept: { pt: 'Árvore Binária de Busca', en: 'Binary Search Tree' },
    difficulty: 'medium',
    prompt: {
      pt: 'Uma BST mantém nós menores à esquerda e maiores à direita -- O(log n) para busca. Implemente inserção e busca recursiva.',
      en: 'A BST keeps smaller nodes on the left and larger on the right -- O(log n) for search. Implement recursive insert and search.',
    },
    code: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() { this.root = null; }

  insert(value) {
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (!node) return new TreeNode(value);
    if (value < node.value) node.left = this._insert(node.left, value);
    else node.right = this._insert(node.right, value);
    return node;
  }

  search(value) {
    return this._search(this.root, value);
  }

  _search(node, value) {
    if (!node) return false;
    if (value === node.value) return true;
    return value < node.value
      ? this._search(node.left, value)
      : this._search(node.right, value);
  }
}`,
  },
  {
    id: 'algo-010',
    concept: { pt: 'BFS (Busca em Largura)', en: 'BFS (Breadth-First Search)' },
    difficulty: 'hard',
    prompt: {
      pt: 'BFS explora um grafo nível por nível usando uma fila. Implemente BFS que retorna todos os nós visitados a partir de um nó inicial.',
      en: 'BFS explores a graph level by level using a queue. Implement BFS that returns all visited nodes from a starting node.',
    },
    code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;

    visited.add(node);
    result.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) queue.push(neighbor);
    }
  }

  return result;
}

const graph = { A: ['B', 'C'], B: ['D'], C: ['D', 'E'], D: [], E: [] };
bfs(graph, 'A'); // ['A', 'B', 'C', 'D', 'E']`,
  },
  {
    id: 'algo-011',
    concept: { pt: 'DFS (Busca em Profundidade)', en: 'DFS (Depth-First Search)' },
    difficulty: 'hard',
    prompt: {
      pt: 'DFS explora um grafo o mais fundo possível antes de retroceder, usando uma pilha ou recursão. Implemente DFS iterativo com uma pilha.',
      en: 'DFS explores a graph as deep as possible before backtracking, using a stack or recursion. Implement iterative DFS with a stack.',
    },
    code: `function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;

    visited.add(node);
    result.push(node);

    const neighbors = graph[node] || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) stack.push(neighbors[i]);
    }
  }

  return result;
}

const graph = { A: ['B', 'C'], B: ['D'], C: ['D', 'E'], D: [], E: [] };
dfs(graph, 'A'); // ['A', 'B', 'D', 'C', 'E']`,
  },
  {
    id: 'algo-012',
    concept: { pt: 'Hash Map Simples', en: 'Simple Hash Map' },
    difficulty: 'medium',
    prompt: {
      pt: 'Um hash map usa uma função de hash pra mapear chaves a posições num array -- O(1) médio. Implemente um HashMap básico com set, get e has.',
      en: 'A hash map uses a hash function to map keys to array positions -- O(1) average. Implement a basic HashMap with set, get, and has.',
    },
    code: `class HashMap {
  constructor(size = 53) {
    this.buckets = new Array(size);
  }

  _hash(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total = (total * 31 + key.charCodeAt(i)) % this.buckets.length;
    }
    return total;
  }

  set(key, value) {
    const idx = this._hash(key);
    if (!this.buckets[idx]) this.buckets[idx] = [];
    const existing = this.buckets[idx].find(([k]) => k === key);
    if (existing) existing[1] = value;
    else this.buckets[idx].push([key, value]);
  }

  get(key) {
    const idx = this._hash(key);
    const pair = this.buckets[idx]?.find(([k]) => k === key);
    return pair?.[1];
  }

  has(key) {
    return this.get(key) !== undefined;
  }
}`,
  },
]
