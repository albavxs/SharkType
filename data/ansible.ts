import { Snippet } from '@/lib/types'

export const ansibleSnippets: Snippet[] = [
  {
    id: 'ans-001',
    concept: { pt: 'Playbook Básico', en: 'Basic Playbook' },
    difficulty: 'medium',
    prompt: {
      pt: 'Escreva um playbook que atualiza pacotes, instala o nginx e garante que o serviço tá rodando e habilitado no boot.',
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
      pt: 'Monte um inventário INI com dois servidores web, definindo usuário SSH e chave privada como variáveis do grupo.',
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
      pt: 'Execute um playbook com inventário customizado, faça dry-run, filtre por tag e teste conectividade com ping.',
      en: 'Run a playbook with a custom inventory, do a dry run, filter by tag, and test connectivity with ping.',
    },
    code: `ansible-playbook -i inventory/hosts.ini playbook.yml
ansible-playbook playbook.yml --check
ansible-playbook playbook.yml --tags "nginx"
ansible all -m ping`,
  },
]
