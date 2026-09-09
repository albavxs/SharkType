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
]
