import { Snippet } from '@/lib/types'

// ── Nmap (Red Team) ──────────────────────────────────────────────────────
export const nmapSnippets: Snippet[] = [
  {
    id: 'sec-001',
    concept: { pt: 'Varredura Nmap Básica', en: 'Basic Nmap Scan' },
    difficulty: 'easy',
    prompt: {
      pt: 'Escaneia um host, uma sub-rede inteira e faz descoberta de hosts sem scan de portas.',
      en: 'Scan a single host, an entire subnet, and do host discovery without port scanning.',
    },
    code: `nmap 192.168.1.1
nmap 192.168.1.0/24
nmap -sn 192.168.1.0/24`,
  },
  {
    id: 'sec-002',
    concept: { pt: 'Padrão de Varredura Recon', en: 'Recon Scan Pattern' },
    difficulty: 'medium',
    prompt: {
      pt: 'Roda um scan com scripts padrão e detecção de versão, depois um completo em todas as portas salvando num arquivo.',
      en: 'Run a scan with default scripts and version detection, then a full all-ports scan saving output to a file.',
    },
    code: `nmap -sC -sV -T4 192.168.1.1
nmap -sC -sV -p- -T4 192.168.1.1 -oN scan.txt`,
  },
  {
    id: 'sec-003',
    concept: { pt: 'Tipos de Varredura', en: 'Scan Types' },
    difficulty: 'medium',
    prompt: {
      pt: 'Roda os quatro tipos principais de scan: SYN stealth, TCP connect, UDP e ACK.',
      en: 'Run the four main scan types: SYN stealth, TCP connect, UDP, and ACK.',
    },
    code: `nmap -sS 192.168.1.1   # SYN scan (stealthy)
nmap -sT 192.168.1.1   # TCP connect scan
nmap -sU 192.168.1.1   # UDP scan
nmap -sA 192.168.1.1   # ACK scan`,
  },
  {
    id: 'sec-004',
    concept: { pt: 'Portas Específicas', en: 'Specific Ports' },
    difficulty: 'easy',
    prompt: {
      pt: 'Escaneia portas específicas, um range, todas as 65535 e as 100 mais comuns.',
      en: 'Scan specific ports, a range, all 65535, and the top 100 most common.',
    },
    code: `nmap -p 22,80,443 192.168.1.1
nmap -p 1-1000 192.168.1.1
nmap -p- 192.168.1.1
nmap --top-ports 100 192.168.1.1`,
  },
  {
    id: 'sec-005',
    concept: { pt: 'Detecção de SO e Versão', en: 'OS and Version Detection' },
    difficulty: 'medium',
    prompt: {
      pt: 'Detecta o sistema operacional, as versões dos serviços e roda o scan agressivo completo.',
      en: 'Detect the operating system, service versions, and run the full aggressive scan.',
    },
    code: `nmap -O 192.168.1.1
nmap -sV 192.168.1.1
nmap -A 192.168.1.1   # OS + version + scripts + traceroute`,
  },
  {
    id: 'sec-006',
    concept: { pt: 'Saída e Evasão', en: 'Output and Evasion' },
    difficulty: 'hard',
    prompt: {
      pt: 'Salva os resultados em texto e XML, pula descoberta de host e usa decoys pra dificultar a detecção.',
      en: 'Save results as text and XML, skip host discovery, and use decoys to evade detection.',
    },
    code: `nmap -oN normal.txt 192.168.1.1
nmap -oX scan.xml 192.168.1.1
nmap -Pn 192.168.1.1   # pular descoberta de host
nmap -D RND:10 192.168.1.1   # decoys`,
  },
]

// ── Web Recon (Red Team) ─────────────────────────────────────────────────
export const webReconSnippets: Snippet[] = [
  {
    id: 'sec-017',
    concept: { pt: 'Teste de Endpoints com curl', en: 'curl Endpoint Testing' },
    difficulty: 'easy',
    prompt: {
      pt: 'Pega só os headers, busca o header do servidor, testa o método OPTIONS e força resolução DNS local.',
      en: 'Fetch headers only, grab the server header, test OPTIONS method, and force local DNS resolution.',
    },
    code: `curl -I https://example.com
curl -sk https://example.com | grep -i "server"
curl -X OPTIONS https://example.com -v
curl --resolve example.com:443:127.0.0.1 https://example.com`,
  },
  {
    id: 'sec-018',
    concept: { pt: 'Reconhecimento com whois e dig', en: 'whois and dig Recon' },
    difficulty: 'easy',
    prompt: {
      pt: 'Consulta dados WHOIS, resolve DNS com dig, busca registros MX e A e usa nslookup com DNS alternativo.',
      en: 'Look up WHOIS data, resolve DNS with dig, query MX and A records, and use nslookup with an alternate DNS.',
    },
    code: `whois example.com
dig example.com
dig example.com MX
dig +short example.com A
nslookup example.com 8.8.8.8`,
  },
]

// ── Firewall (Blue Team) ─────────────────────────────────────────────────
export const firewallSnippets: Snippet[] = [
  {
    id: 'sec-007',
    concept: { pt: 'Firewall UFW', en: 'UFW Firewall' },
    difficulty: 'easy',
    prompt: {
      pt: 'Confere o status do UFW, ativa, libera SSH e HTTP, bloqueia telnet e remove uma regra.',
      en: 'Check UFW status, enable it, allow SSH and HTTP, block telnet, and delete a rule.',
    },
    code: `sudo ufw status
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw deny 23
sudo ufw delete allow 80/tcp`,
  },
  {
    id: 'sec-008',
    concept: { pt: 'Regras iptables', en: 'iptables Rules' },
    difficulty: 'hard',
    prompt: {
      pt: 'Lista as regras detalhadas, libera SSH e HTTP, bloqueia todo o resto e seta a política padrão como DROP.',
      en: 'List verbose rules, allow SSH and HTTP, drop everything else, and set the default INPUT policy to DROP.',
    },
    code: `sudo iptables -L -v
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -j DROP
sudo iptables -P INPUT DROP`,
  },
]

// ── Network Analysis (Blue Team) ─────────────────────────────────────────
export const networkAnalysisSnippets: Snippet[] = [
  {
    id: 'sec-009',
    concept: { pt: 'Captura de Pacotes com tcpdump', en: 'tcpdump Packet Capture' },
    difficulty: 'medium',
    prompt: {
      pt: 'Captura pacotes numa interface, salva em arquivo, filtra por host e porta e lê uma captura salva.',
      en: 'Capture packets on an interface, save to file, filter by host and port, and read a saved capture.',
    },
    code: `sudo tcpdump -i eth0
sudo tcpdump -w capture.pcap -i eth0
sudo tcpdump host 192.168.1.1
sudo tcpdump port 80
sudo tcpdump -r capture.pcap`,
  },
  {
    id: 'sec-010',
    concept: { pt: 'Portas Abertas com ss/netstat', en: 'Open Ports with ss/netstat' },
    difficulty: 'easy',
    prompt: {
      pt: 'Lista as portas abertas com ss e netstat, filtrando pelas conexões em LISTEN e pela porta 80.',
      en: 'List open ports with ss and netstat, filtering for listening connections and port 80.',
    },
    code: `ss -tuln
ss -tulnp | grep LISTEN
netstat -tuln
netstat -tulnp | grep :80`,
  },
]

// ── Hardening (Blue Team) ────────────────────────────────────────────────
export const hardeningSnippets: Snippet[] = [
  {
    id: 'sec-014',
    concept: { pt: 'Auditoria de Permissões', en: 'Permission Audit' },
    difficulty: 'medium',
    prompt: {
      pt: 'Encontra binários com SUID e SGID no sistema, confere as permissões do shadow e os detalhes do passwd.',
      en: 'Find SUID and SGID binaries on the system, check shadow permissions, and inspect passwd details.',
    },
    code: `find / -perm -4000 2>/dev/null   # SUID bits
find / -perm -2000 2>/dev/null   # SGID bits
ls -la /etc/shadow
stat /etc/passwd`,
  },
  {
    id: 'sec-015',
    concept: { pt: 'Monitoramento de Logs de Segurança', en: 'Security Log Monitoring' },
    difficulty: 'easy',
    prompt: {
      pt: 'Fica acompanhando o auth.log em tempo real, filtra tentativas de senha errada e vê os últimos logins.',
      en: 'Tail the auth log in real time, filter failed password attempts, and check recent logins.',
    },
    code: `sudo tail -f /var/log/auth.log
sudo grep "Failed password" /var/log/auth.log
sudo lastlog
sudo last -n 20`,
  },
  {
    id: 'sec-016',
    concept: { pt: 'Usuários e sudo', en: 'Users and sudo' },
    difficulty: 'medium',
    prompt: {
      pt: 'Cria um usuário deploy, adiciona no grupo sudo, desabilita login do root, confere o ID e edita o sudoers.',
      en: 'Create a deploy user, add to sudo group, disable root login, check the user ID, and edit sudoers.',
    },
    code: `sudo adduser deploy
sudo usermod -aG sudo deploy
sudo passwd -l root   # desabilitar login root
id deploy
sudo visudo`,
  },
]

// ── Cryptography ─────────────────────────────────────────────────────────
export const cryptoSnippets: Snippet[] = [
  {
    id: 'sec-011',
    concept: { pt: 'Certificado SSL Autoassinado', en: 'Self-signed Certificate' },
    difficulty: 'medium',
    prompt: {
      pt: 'Gera um certificado autoassinado RSA 4096 bits válido por 1 ano, sem passphrase na chave privada.',
      en: 'Generate a self-signed RSA 4096-bit certificate valid for 1 year, with no passphrase on the private key.',
    },
    code: `openssl req -x509 -newkey rsa:4096 \\
  -keyout key.pem \\
  -out cert.pem \\
  -days 365 \\
  -nodes`,
  },
  {
    id: 'sec-012',
    concept: { pt: 'Inspecionar Certificado SSL', en: 'Inspect Certificate' },
    difficulty: 'medium',
    prompt: {
      pt: 'Mostra os detalhes de um certificado local, conecta num servidor pra ver o cert remoto e verifica a cadeia de confiança.',
      en: 'Display details of a local certificate, connect to a server to view the remote cert, and verify the trust chain.',
    },
    code: `openssl x509 -in cert.pem -text -noout
openssl s_client -connect example.com:443
openssl verify -CAfile ca.pem cert.pem`,
  },
  {
    id: 'sec-013',
    concept: { pt: 'Gerenciamento de Chave SSH', en: 'SSH Key Management' },
    difficulty: 'medium',
    prompt: {
      pt: 'Gera uma chave ed25519, copia pro servidor remoto, adiciona no authorized_keys e ajusta as permissões.',
      en: 'Generate an ed25519 key, copy it to the remote server, add it to authorized_keys, and fix permissions.',
    },
    code: `ssh-keygen -t ed25519 -C "voce@email.com"
ssh-copy-id user@192.168.1.10
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys`,
  },
]

// ── Combined export (backwards compat) ───────────────────────────────────
export const cybersecSnippets: Snippet[] = [
  ...nmapSnippets,
  ...webReconSnippets,
  ...firewallSnippets,
  ...networkAnalysisSnippets,
  ...hardeningSnippets,
  ...cryptoSnippets,
]
