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
]
