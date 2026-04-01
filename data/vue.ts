import { Snippet } from '@/lib/types'

export const vueSnippets: Snippet[] = [
  {
    id: 'vue-001',
    concept: { pt: 'Composition API com ref', en: 'Composition API with ref' },
    difficulty: 'easy',
    prompt: {
      pt: 'No Vue 3, <script setup> com ref() é a forma mais enxuta de declarar estado reativo. Crie um componente que exibe um contador e um botão que incrementa o valor ao clicar.',
      en: 'In Vue 3, <script setup> with ref() is the most concise way to declare reactive state. Create a component that displays a counter and a button that increments the value on click.',
    },
    code: `<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>`,
  },
  {
    id: 'vue-002',
    concept: { pt: 'reactive vs ref', en: 'reactive vs ref' },
    difficulty: 'easy',
    prompt: {
      pt: 'reactive() cria um proxy reativo para objetos inteiros, enquanto ref() empacota valores primitivos. Use reactive() para agrupar nome e email de um usuário num único objeto reativo.',
      en: 'reactive() creates a reactive proxy for entire objects, while ref() wraps primitive values. Use reactive() to group a user\'s name and email into a single reactive object.',
    },
    code: `<script setup>
import { reactive } from 'vue'

const user = reactive({
  name: 'Paulo',
  email: 'paulo@email.com',
})

const updateName = (name) => {
  user.name = name
}
</script>`,
  },
  {
    id: 'vue-003',
    concept: { pt: 'Propriedade Computada', en: 'Computed Property' },
    difficulty: 'easy',
    prompt: {
      pt: 'computed() cria um valor derivado que recalcula automaticamente quando suas dependências mudam. Crie um computed que retorna o nome completo a partir de firstName e lastName reativos.',
      en: 'computed() creates a derived value that automatically recalculates when its dependencies change. Create a computed that returns the full name from reactive firstName and lastName.',
    },
    code: `<script setup>
import { ref, computed } from 'vue'

const firstName = ref('Paulo')
const lastName = ref('Guilherme')

const fullName = computed(() => {
  return \`\${firstName.value} \${lastName.value}\`
})
</script>`,
  },
  {
    id: 'vue-004',
    concept: { pt: 'watch e watchEffect', en: 'watch and watchEffect' },
    difficulty: 'medium',
    prompt: {
      pt: 'watch() observa fontes específicas e executa um callback quando mudam, recebendo valor antigo e novo. Use watch para reagir a mudanças no campo de busca com debounce.',
      en: 'watch() observes specific sources and runs a callback when they change, receiving old and new values. Use watch to react to search field changes with debounce.',
    },
    code: `<script setup>
import { ref, watch } from 'vue'

const search = ref('')
const results = ref([])

watch(search, async (newQuery, oldQuery) => {
  if (newQuery.length < 3) return
  const res = await fetch(\`/api/search?q=\${newQuery}\`)
  results.value = await res.json()
}, { debounce: 300 })
</script>`,
  },
  {
    id: 'vue-005',
    concept: { pt: 'Diretivas v-if e v-for', en: 'v-if and v-for Directives' },
    difficulty: 'easy',
    prompt: {
      pt: 'v-if renderiza condicionalmente e v-for itera sobre listas no template. Combine ambos para mostrar uma lista de tarefas, exibindo uma mensagem quando não houver itens.',
      en: 'v-if conditionally renders and v-for iterates over lists in the template. Combine both to show a task list, displaying a message when there are no items.',
    },
    code: `<template>
  <ul v-if="todos.length > 0">
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
    </li>
  </ul>
  <p v-else>Nenhuma tarefa encontrada.</p>
</template>`,
  },
  {
    id: 'vue-006',
    concept: { pt: 'v-model two-way binding', en: 'v-model Two-Way Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'v-model cria ligação bidirecional entre um input e uma variável reativa. Crie um formulário com v-model em campos de texto e select, exibindo os valores em tempo real.',
      en: 'v-model creates two-way binding between an input and a reactive variable. Create a form with v-model on text and select fields, displaying the values in real time.',
    },
    code: `<script setup>
import { ref } from 'vue'

const name = ref('')
const role = ref('dev')
</script>

<template>
  <input v-model="name" placeholder="Nome" />
  <select v-model="role">
    <option value="dev">Developer</option>
    <option value="design">Designer</option>
  </select>
  <p>{{ name }} -- {{ role }}</p>
</template>`,
  },
  {
    id: 'vue-007',
    concept: { pt: 'Props e Emits', en: 'Props and Emits' },
    difficulty: 'medium',
    prompt: {
      pt: 'defineProps recebe dados do pai e defineEmits permite que o filho emita eventos para cima. Crie um componente filho que recebe um título como prop e emite um evento de clique.',
      en: 'defineProps receives data from the parent and defineEmits lets the child emit events upward. Create a child component that receives a title as prop and emits a click event.',
    },
    code: `<script setup>
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
})

const emit = defineEmits(['increment'])

const handleClick = () => {
  emit('increment', props.count + 1)
}
</script>

<template>
  <button @click="handleClick">
    {{ title }}: {{ count }}
  </button>
</template>`,
  },
  {
    id: 'vue-008',
    concept: { pt: 'Lifecycle Hooks', en: 'Lifecycle Hooks' },
    difficulty: 'medium',
    prompt: {
      pt: 'onMounted executa código após o componente ser montado no DOM, e onUnmounted faz a limpeza quando é destruído. Use ambos para iniciar e parar um intervalo de tempo.',
      en: 'onMounted runs code after the component is mounted to the DOM, and onUnmounted cleans up when it is destroyed. Use both to start and stop a time interval.',
    },
    code: `<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const elapsed = ref(0)
let timer

onMounted(() => {
  timer = setInterval(() => {
    elapsed.value++
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>`,
  },
  {
    id: 'vue-009',
    concept: { pt: 'Pinia Store', en: 'Pinia Store' },
    difficulty: 'medium',
    prompt: {
      pt: 'Pinia é o gerenciador de estado oficial do Vue 3. Use defineStore para criar uma store com state, getters e actions para gerenciar um carrinho de compras.',
      en: 'Pinia is the official state manager for Vue 3. Use defineStore to create a store with state, getters, and actions to manage a shopping cart.',
    },
    code: `import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    total: (state) =>
      state.items.reduce((sum, i) => sum + i.price * i.qty, 0),
    count: (state) => state.items.length,
  },
  actions: {
    addItem(product) {
      const existing = this.items.find(i => i.id === product.id)
      existing ? existing.qty++ : this.items.push({ ...product, qty: 1 })
    },
    removeItem(id) {
      this.items = this.items.filter(i => i.id !== id)
    },
  },
})`,
  },
  {
    id: 'vue-010',
    concept: { pt: 'Vue Router', en: 'Vue Router' },
    difficulty: 'medium',
    prompt: {
      pt: 'Vue Router gerencia navegação SPA com rotas declarativas. Configure createRouter com histórico, rotas estáticas e dinâmicas, e um guard de autenticação.',
      en: 'Vue Router manages SPA navigation with declarative routes. Configure createRouter with history, static and dynamic routes, and an authentication guard.',
    },
    code: `import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/user/:id', component: () => import('@/views/User.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  const isAuth = !!localStorage.getItem('token')
  if (to.path !== '/login' && !isAuth) return '/login'
})

export default router`,
  },
  {
    id: 'vue-011',
    concept: { pt: 'Composable Customizado', en: 'Custom Composable' },
    difficulty: 'hard',
    prompt: {
      pt: 'Composables extraem lógica reativa reutilizável em funções useXxx. Crie um composable useFetch que encapsula chamada HTTP, estado de loading e tratamento de erro.',
      en: 'Composables extract reusable reactive logic into useXxx functions. Create a useFetch composable that encapsulates HTTP calls, loading state, and error handling.',
    },
    code: `import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)

  watchEffect(async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url.value ?? url)
      data.value = await res.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}`,
  },
  {
    id: 'vue-012',
    concept: { pt: 'Provide e Inject', en: 'Provide and Inject' },
    difficulty: 'hard',
    prompt: {
      pt: 'provide/inject permite injeção de dependência através da árvore de componentes sem prop drilling. Use provide no componente raiz para compartilhar um tema e inject nos filhos para consumi-lo.',
      en: 'provide/inject enables dependency injection across the component tree without prop drilling. Use provide in the root component to share a theme and inject in children to consume it.',
    },
    code: `// Parent.vue
<script setup>
import { ref, provide } from 'vue'

const theme = ref('dark')
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

provide('theme', { theme, toggleTheme })
</script>

// Child.vue
<script setup>
import { inject } from 'vue'

const { theme, toggleTheme } = inject('theme')
</script>

<template>
  <div :class="theme">
    <button @click="toggleTheme">Toggle: {{ theme }}</button>
  </div>
</template>`,
  },
]
