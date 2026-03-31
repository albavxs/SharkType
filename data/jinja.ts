import { Snippet } from '@/lib/types'

export const jinjaSnippets: Snippet[] = [
  {
    id: 'jinja-001',
    concept: { pt: 'Interpolação de Variável', en: 'Variable Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'No Jinja, {{ }} imprime o valor de uma variável no template. Crie um template que exibe o nome e email de um usuário usando interpolação.',
      en: 'In Jinja, {{ }} prints a variable\'s value in the template. Create a template that displays a user\'s name and email using interpolation.',
    },
    code: `<h1>Bem-vindo, {{ user.name }}!</h1>
<p>Email: {{ user.email }}</p>
<p>Cadastro: {{ user.created_at | dateformat('%d/%m/%Y') }}</p>`,
  },
  {
    id: 'jinja-002',
    concept: { pt: 'Loop For', en: 'For Loop' },
    difficulty: 'easy',
    prompt: {
      pt: '{% for %} itera sobre listas no Jinja, com acesso a variáveis do loop como loop.index. Itere sobre uma lista de produtos exibindo nome, preço e posição.',
      en: '{% for %} iterates over lists in Jinja, with access to loop variables like loop.index. Iterate over a product list showing name, price, and position.',
    },
    code: `<ul>
{% for product in products %}
  <li>
    {{ loop.index }}. {{ product.name }}
    — R$ {{ "%.2f" | format(product.price) }}
  </li>
{% else %}
  <li>Nenhum produto encontrado.</li>
{% endfor %}
</ul>`,
  },
  {
    id: 'jinja-003',
    concept: { pt: 'Condicional If', en: 'If Conditional' },
    difficulty: 'easy',
    prompt: {
      pt: '{% if %} avalia condições no template Jinja. Use if/elif/else para exibir diferentes badges de acordo com o role do usuário.',
      en: '{% if %} evaluates conditions in the Jinja template. Use if/elif/else to display different badges based on the user\'s role.',
    },
    code: `{% if user.role == 'admin' %}
  <span class="badge badge-red">Admin</span>
{% elif user.role == 'moderator' %}
  <span class="badge badge-yellow">Moderator</span>
{% else %}
  <span class="badge badge-gray">User</span>
{% endif %}`,
  },
  {
    id: 'jinja-004',
    concept: { pt: 'Herança de Template', en: 'Template Inheritance' },
    difficulty: 'medium',
    prompt: {
      pt: '{% extends %} herda um layout base e {% block %} define regiões substituíveis. Crie um layout base com blocos title, content e scripts, e um template filho que os preenche.',
      en: '{% extends %} inherits a base layout and {% block %} defines overridable regions. Create a base layout with title, content, and scripts blocks, and a child template that fills them.',
    },
    code: `{# base.html #}
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Meu Site{% endblock %}</title>
</head>
<body>
  <nav>{% include 'partials/nav.html' %}</nav>
  <main>{% block content %}{% endblock %}</main>
  {% block scripts %}{% endblock %}
</body>
</html>

{# home.html #}
{% extends 'base.html' %}

{% block title %}Home — Meu Site{% endblock %}

{% block content %}
  <h1>Bem-vindo!</h1>
  <p>{{ message }}</p>
{% endblock %}`,
  },
  {
    id: 'jinja-005',
    concept: { pt: 'Filtros', en: 'Filters' },
    difficulty: 'easy',
    prompt: {
      pt: 'Filtros Jinja transformam valores com o operador pipe (|). Aplique filtros como upper, default, truncate e join para formatar dados no template.',
      en: 'Jinja filters transform values with the pipe operator (|). Apply filters like upper, default, truncate, and join to format data in the template.',
    },
    code: `<h1>{{ title | upper }}</h1>
<p>{{ description | truncate(100) }}</p>
<p>Autor: {{ author | default('Anônimo') }}</p>
<p>Tags: {{ tags | join(', ') }}</p>
<p>{{ content | striptags | wordcount }} palavras</p>`,
  },
  {
    id: 'jinja-006',
    concept: { pt: 'Macros', en: 'Macros' },
    difficulty: 'medium',
    prompt: {
      pt: '{% macro %} define funções reutilizáveis no Jinja, como componentes de template. Crie uma macro para renderizar campos de formulário com label, input e mensagem de erro.',
      en: '{% macro %} defines reusable functions in Jinja, like template components. Create a macro to render form fields with label, input, and error message.',
    },
    code: `{% macro field(name, label, type='text', required=false) %}
  <div class="form-group">
    <label for="{{ name }}">{{ label }}</label>
    <input
      type="{{ type }}"
      id="{{ name }}"
      name="{{ name }}"
      class="form-control {{ 'is-invalid' if errors.get(name) }}"
      value="{{ values.get(name, '') }}"
      {{ 'required' if required }}
    />
    {% if errors.get(name) %}
      <span class="error">{{ errors[name] }}</span>
    {% endif %}
  </div>
{% endmacro %}

{{ field('email', 'Email', type='email', required=true) }}
{{ field('name', 'Nome completo') }}`,
  },
  {
    id: 'jinja-007',
    concept: { pt: 'Include Parcial', en: 'Include Partial' },
    difficulty: 'easy',
    prompt: {
      pt: '{% include %} insere o conteúdo de outro template no ponto atual. Use include para compor uma página com header, sidebar e footer como arquivos separados.',
      en: '{% include %} inserts another template\'s content at the current point. Use include to compose a page with header, sidebar, and footer as separate files.',
    },
    code: `<body>
  {% include 'partials/header.html' %}

  <div class="container">
    {% include 'partials/sidebar.html' ignore missing %}

    <main>
      {% block content %}{% endblock %}
    </main>
  </div>

  {% include 'partials/footer.html' %}
</body>`,
  },
  {
    id: 'jinja-008',
    concept: { pt: 'Controle de Whitespace', en: 'Whitespace Control' },
    difficulty: 'medium',
    prompt: {
      pt: '{%- e -%} removem espaços em branco antes/depois das tags Jinja, gerando HTML mais limpo. Aplique whitespace control numa lista para evitar linhas vazias no output.',
      en: '{%- and -%} strip whitespace before/after Jinja tags, producing cleaner HTML. Apply whitespace control to a list to avoid blank lines in the output.',
    },
    code: `<ul>
  {%- for item in items %}
  <li>{{ item.name }} — {{ item.value }}</li>
  {%- endfor %}
</ul>

{%- if show_footer %}
<footer>{{ footer_text | trim }}</footer>
{%- endif -%}`,
  },
  {
    id: 'jinja-009',
    concept: { pt: 'Set Variáveis', en: 'Set Variables' },
    difficulty: 'easy',
    prompt: {
      pt: '{% set %} declara variáveis locais dentro do template Jinja. Use set para computar valores intermediários e simplificar expressões repetidas.',
      en: '{% set %} declares local variables inside the Jinja template. Use set to compute intermediate values and simplify repeated expressions.',
    },
    code: `{% set full_name = user.first_name ~ ' ' ~ user.last_name %}
{% set is_premium = user.plan in ['pro', 'enterprise'] %}
{% set discount = 0.2 if is_premium else 0 %}

<p>Olá, {{ full_name }}!</p>
<p>Desconto: {{ (discount * 100) | int }}%</p>
<p>Total: R$ {{ "%.2f" | format(price * (1 - discount)) }}</p>`,
  },
  {
    id: 'jinja-010',
    concept: { pt: 'Layout Complexo com Blocos', en: 'Complex Layout with Blocks' },
    difficulty: 'hard',
    prompt: {
      pt: 'Combine herança multinível, macros importadas e blocos opcionais para criar um layout de dashboard com sidebar, breadcrumbs e área de conteúdo customizável.',
      en: 'Combine multi-level inheritance, imported macros, and optional blocks to create a dashboard layout with sidebar, breadcrumbs, and customizable content area.',
    },
    code: `{# dashboard.html — extends base.html #}
{% extends 'base.html' %}
{% from 'macros/ui.html' import icon, badge %}

{% block title %}Dashboard — {{ page_title }}{% endblock %}

{% block content %}
<div class="dashboard">
  <aside>
    {% block sidebar %}
      {% for link in nav_links %}
        <a href="{{ link.url }}" class="{{ 'active' if link.active }}">
          {{ icon(link.icon) }} {{ link.label }}
        </a>
      {% endfor %}
    {% endblock %}
  </aside>

  <section>
    <nav class="breadcrumb">
      {% for crumb in breadcrumbs %}
        <a href="{{ crumb.url }}">{{ crumb.label }}</a>
        {%- if not loop.last %} / {% endif %}
      {% endfor %}
    </nav>

    {% block dashboard_content %}{% endblock %}
  </section>
</div>
{% endblock %}`,
  },
]
