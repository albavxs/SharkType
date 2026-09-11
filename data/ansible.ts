import { Snippet } from '@/lib/types'

export const ansibleSnippets: Snippet[] = [
  {
    id: 'ans-001',
    concept: { pt: 'Playbook Básico', en: 'Basic Playbook' },
    difficulty: 'medium',
    prompt: {
      pt: 'Monta um playbook que atualiza os pacotes, instala o nginx e garante que o serviço tá rodando e habilitado no boot.',
      en: 'Write a playbook that updates packages, installs nginx, and ensures the service is running and enabled on boot.',
    },
    code: `- hosts: webservers
  become: yes
  tasks:
    - name: Atualizar pacotes
      apt:
        update_cache: yes
        upgrade: dist

    - name: Instalar nginx
      apt:
        name: nginx
        state: present

    - name: Iniciar nginx
      service:
        name: nginx
        state: started
        enabled: yes`,
  },
  {
    id: 'ans-002',
    concept: { pt: 'Inventário e Variáveis', en: 'Inventory and Variables' },
    difficulty: 'medium',
    prompt: {
      pt: 'Monta um inventário INI com dois servidores web, setando o usuário SSH e a chave privada como variáveis do grupo.',
      en: 'Set up an INI inventory with two web servers, defining the SSH user and private key as group variables.',
    },
    code: `# inventory/hosts.ini
[webservers]
web1 ansible_host=192.168.1.10
web2 ansible_host=192.168.1.11

[webservers:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/id_rsa`,
  },
  {
    id: 'ans-003',
    concept: { pt: 'Comandos ansible-playbook', en: 'ansible-playbook Commands' },
    difficulty: 'easy',
    prompt: {
      pt: 'Roda um playbook com inventário customizado, faz dry-run, filtra por tag e testa a conectividade com ping.',
      en: 'Run a playbook with a custom inventory, do a dry run, filter by tag, and test connectivity with ping.',
    },
    code: `ansible-playbook -i inventory/hosts.ini playbook.yml
ansible-playbook playbook.yml --check
ansible-playbook playbook.yml --tags "nginx"
ansible all -m ping`,
  },
  {
    id: 'ans-004',
    concept: { pt: 'Handlers e Notificações', en: 'Handlers and Notifications' },
    difficulty: 'medium',
    prompt: {
      pt: 'Handlers executam tarefas somente quando notificados por uma mudança. Use notify pra reiniciar o nginx quando a config mudar.',
      en: 'Handlers run tasks only when notified by a change. Use notify to restart nginx when the config changes.',
    },
    code: `- hosts: webservers
  become: yes
  tasks:
    - name: Copiar config do nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: Reiniciar nginx

    - name: Copiar site config
      copy:
        src: site.conf
        dest: /etc/nginx/sites-available/default
      notify: Reiniciar nginx

  handlers:
    - name: Reiniciar nginx
      service:
        name: nginx
        state: restarted`,
  },
  {
    id: 'ans-005',
    concept: { pt: 'Template Jinja2', en: 'Jinja2 Template' },
    difficulty: 'medium',
    prompt: {
      pt: 'O módulo template renderiza arquivos Jinja2 com variáveis do Ansible. Crie um template de config do nginx com variáveis dinâmicas.',
      en: 'The template module renders Jinja2 files with Ansible variables. Create an nginx config template with dynamic variables.',
    },
    code: `# templates/nginx.conf.j2
server {
    listen {{ http_port }};
    server_name {{ server_name }};

    location / {
        proxy_pass http://127.0.0.1:{{ app_port }};
        proxy_set_header Host $host;
    }

    {% if ssl_enabled %}
    listen 443 ssl;
    ssl_certificate {{ ssl_cert_path }};
    ssl_certificate_key {{ ssl_key_path }};
    {% endif %}
}`,
  },
  {
    id: 'ans-006',
    concept: { pt: 'Condicionais com when', en: 'Conditionals with when' },
    difficulty: 'medium',
    prompt: {
      pt: 'when executa uma tarefa somente se a condição for verdadeira. Use condicionais pra instalar pacotes diferentes por distribuição.',
      en: 'when runs a task only if the condition is true. Use conditionals to install different packages per distribution.',
    },
    code: `- hosts: all
  become: yes
  tasks:
    - name: Instalar no Debian/Ubuntu
      apt:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - curl
        - git
      when: ansible_os_family == "Debian"

    - name: Instalar no RedHat/CentOS
      yum:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - curl
        - git
      when: ansible_os_family == "RedHat"`,
  },
]
