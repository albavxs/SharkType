import { Snippet } from '@/lib/types'

export const angularSnippets: Snippet[] = [
  {
    id: 'angular-001',
    concept: { pt: 'Componente Standalone', en: 'Standalone Component' },
    difficulty: 'easy',
    prompt: {
      pt: 'Componentes Angular modernos sao standalone por padrão. Crie um componente simples com selector, template inline e styles locais.',
      en: 'Modern Angular components are standalone by default. Create a simple component with a selector, inline template, and local styles.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: \`
    <h1>Hello, {{ name }}</h1>
    <p>Welcome to Angular.</p>
  \`,
  styles: ['h1 { color: #dd0031; }'],
})
export class GreetingComponent {
  name = 'Ana';
}`,
  },
  {
    id: 'angular-002',
    concept: { pt: 'Selector e Template', en: 'Selector and Template' },
    difficulty: 'easy',
    prompt: {
      pt: 'O selector define como o componente aparece no HTML. Crie um card de perfil usado pela tag app-profile-card.',
      en: 'The selector defines how the component appears in HTML. Create a profile card used with the app-profile-card tag.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  template: \`
    <article>
      <h2>{{ user.name }}</h2>
      <span>{{ user.role }}</span>
    </article>
  \`,
})
export class ProfileCardComponent {
  user = {
    name: 'Bianca',
    role: 'Frontend Dev',
  };
}`,
  },
  {
    id: 'angular-003',
    concept: { pt: 'Interpolação', en: 'Interpolation' },
    difficulty: 'easy',
    prompt: {
      pt: 'Interpolação exibe valores da classe no template. Mostre titulo, usuario e status calculado.',
      en: 'Interpolation displays class values in the template. Show a title, user, and calculated status.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-title',
  template: \`
    <h1>{{ title }}</h1>
    <p>{{ user }} has {{ taskCount }} open tasks.</p>
    <strong>{{ taskCount > 0 ? 'Active' : 'Done' }}</strong>
  \`,
})
export class DashboardTitleComponent {
  title = 'Sprint Board';
  user = 'Carlos';
  taskCount = 7;
}`,
  },
  {
    id: 'angular-004',
    concept: { pt: 'Property Binding', en: 'Property Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'Property binding conecta atributos do DOM a valores da classe. Controle src, alt e disabled pelo estado do componente.',
      en: 'Property binding connects DOM properties to class values. Control src, alt, and disabled from component state.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: \`
    <img [src]="avatarUrl" [alt]="avatarAlt" />
    <button [disabled]="isSaving">Save</button>
  \`,
})
export class AvatarComponent {
  avatarUrl = '/assets/avatar.png';
  avatarAlt = 'User avatar';
  isSaving = false;
}`,
  },
  {
    id: 'angular-005',
    concept: { pt: 'Event Binding', en: 'Event Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'Event binding chama métodos da classe a partir de eventos do template. Crie um contador com cliques.',
      en: 'Event binding calls class methods from template events. Create a click counter.',
    },
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-click-counter',
  template: \`
    <button (click)="increment()">Clicked {{ count }} times</button>
    <button (click)="reset()">Reset</button>
  \`,
})
export class ClickCounterComponent {
  count = 0;

  increment() {
    this.count++;
  }

  reset() {
    this.count = 0;
  }
}`,
  },
  {
    id: 'angular-006',
    concept: { pt: 'Two-Way Binding', en: 'Two-Way Binding' },
    difficulty: 'easy',
    prompt: {
      pt: 'FormsModule habilita ngModel para ligação bidirecional. Crie um campo de busca que atualiza a preview em tempo real.',
      en: 'FormsModule enables ngModel for two-way binding. Create a search field that updates a preview in real time.',
    },
    code: `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  template: \`
    <input [(ngModel)]="query" placeholder="Search" />
    <p>Searching for: {{ query }}</p>
  \`,
})
export class SearchBoxComponent {
  query = '';
}`,
  },
]
