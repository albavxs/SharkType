import { Snippet } from '@/lib/types'

export const linuxSnippets: Snippet[] = [
  {
    id: 'linux-001',
    concept: 'Navigation',
    difficulty: 'easy',
    prompt: 'Liste todos os arquivos (incluindo ocultos) com permissoes em /var/log, navegue ate /etc/nginx e mostre o caminho atual.',
    code: `ls -la /var/log
cd /etc/nginx
pwd`,
  },
  {
    id: 'linux-002',
    concept: 'File Operations',
    difficulty: 'easy',
    prompt: 'Copie um diretorio recursivamente, renomeie um arquivo e remova um diretorio de cache com todo seu conteudo.',
    code: `cp -r src/ backup/
mv old_name.txt new_name.txt
rm -rf /tmp/cache`,
  },
  {
    id: 'linux-003',
    concept: 'Create & View',
    difficulty: 'easy',
    prompt: 'Crie uma estrutura de diretorios aninhada, crie arquivos de configuracao vazios e exiba informacoes do sistema operacional.',
    code: `mkdir -p projects/api/src
touch .env .gitignore
cat /etc/os-release`,
  },
  {
    id: 'linux-004',
    concept: 'Search',
    difficulty: 'easy',
    prompt: 'Busque por TODOs em arquivos TypeScript, encontre logs com mais de 7 dias e localize arquivos grandes em /var.',
    code: `grep -r "TODO" src/ --include="*.ts"
find . -name "*.log" -mtime +7
find /var -size +100M -type f`,
  },
  {
    id: 'linux-005',
    concept: 'Permissions',
    difficulty: 'medium',
    prompt: 'Torne um script executavel, defina permissoes de leitura para arquivos web e transfira propriedade para o usuario do servidor.',
    code: `chmod 755 deploy.sh
chmod -R 644 /var/www/html
chown -R www-data:www-data /var/www`,
  },
  {
    id: 'linux-006',
    concept: 'Processes',
    difficulty: 'medium',
    prompt: 'Encontre o processo do nginx, encerre um processo pelo PID, reinicie o servico e acompanhe seus logs em tempo real.',
    code: `ps aux | grep nginx
kill -9 1234
systemctl restart nginx
journalctl -u nginx -f`,
  },
  {
    id: 'linux-007',
    concept: 'Archives',
    difficulty: 'medium',
    prompt: 'Comprima um diretorio em .tar.gz, extraia em outro local e crie um .zip excluindo arquivos de mapa de source.',
    code: `tar -czf backup.tar.gz /var/www
tar -xzf backup.tar.gz -C /restore
zip -r dist.zip dist/ -x "*.map"`,
  },
  {
    id: 'linux-008',
    concept: 'Network',
    difficulty: 'medium',
    prompt: 'Envie uma requisicao POST com JSON para uma API e faca download de um arquivo de uma URL remota.',
    code: `curl -X POST https://api.example.com/data \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
wget -O file.zip https://example.com/file.zip`,
  },
  {
    id: 'linux-009',
    concept: 'Text Processing',
    difficulty: 'hard',
    prompt: 'Some uma coluna numerica de um log com awk, substitua uma variavel de ambiente com sed e liste usuarios unicos do sistema.',
    code: `awk '{sum += $3} END {print sum}' access.log
sed -i 's/localhost/production.db/g' .env
cut -d: -f1 /etc/passwd | sort | uniq`,
  },
  {
    id: 'linux-010',
    concept: 'Pipelines',
    difficulty: 'hard',
    prompt: 'Identifique os IPs com mais erros no log de acesso e liste os diretorios que mais ocupam espaco em disco.',
    code: `cat access.log | grep "ERROR" | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
du -sh */ | sort -rh | head -10`,
  },
]
