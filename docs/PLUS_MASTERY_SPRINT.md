# SharkType Plus Mastery — Sprint atual

## Objetivo

Transformar o SharkType Plus em uma camada de progressão de domínio (Mastery) visível dentro do catálogo de trilhas, sem tornar o Ranked pay-to-win e sem mexer na integração comercial do Asaas nesta sprint.

## Escopo desta sprint

### 1. Plus Mastery por categoria

A página `/tracks` passa a exibir, abaixo de cada categoria de código, um rail/carrossel horizontal de **SharkType Plus Mastery**.

- Conceitos: todas as trilhas de `section: concept` aparecem no rail Mastery.
- Tecnologia: trilhas de `focused` e `cyberdevops` entram no rail quando possuem mais de 4 exercícios/conteúdos disponíveis no catálogo.
- Idiomas e treino puro de teclado continuam fora do Mastery.
- O rail é recolhível e usa navegação por setas, scroll horizontal e scroll-snap.
- Usuários Free veem a proposta de valor e são direcionados para `/plus`.
- Usuários Plus entram na trilha normal; enquanto o modo Mastery dedicado não estiver disponível para uma track, o card deixa isso explícito em vez de prometer conteúdo inexistente.

### 2. Gamificação Mastery

Modelo de progressão alvo:

- até 3 estrelas por desafio;
- níveis `Mastery I`, `Mastery II`, `Mastery III` e `Master`;
- coroas/títulos por tecnologia;
- conquistas e cosméticos Plus;
- Streak Shield como benefício futuro;
- XP de perfil pode receber benefícios Plus;
- Ranked Score, WPM e ranking competitivo não recebem multiplicadores Plus.

Nesta sprint, a UI introduz o conceito de estrelas/progresso Mastery e prepara o contrato para a evolução posterior.

### 3. Upsell contextual no fim de trilha Free

Quando um usuário sem Plus conclui uma trilha de código e chega à tela de resultado/gráfico, exibir um anúncio contextual do SharkType Plus com CTA direto para `/plus`.

O anúncio deve:

- aparecer depois do resultado principal;
- explicar que o Plus libera Mastery e desafios extras;
- usar o mesmo padrão visual e de interação do app;
- ter botão de ação para `/plus`;
- não aparecer para usuários Plus/superadmin;
- não aparecer em trilhas de idioma/digitação que são totalmente Free.

### 4. Conteúdo privado / Package v2

Próxima etapa técnica desta mesma frente:

- adicionar ao pacote privado `getPremiumTrackManifest()`;
- adicionar `getPremiumTrackSnippets(trackId, languageId?)`;
- manter o conteúdo Mastery fora do repositório público;
- criar extensões Mastery para todos os conceitos e para tracks técnicas elegíveis (>4 exercícios);
- adicionar verificação de cobertura no build para impedir uma track marcada como Mastery ficar sem conteúdo.

## Fora desta sprint

### Asaas / cobrança

Separado para próxima sprint:

- webhook de produção;
- `ASAAS_WEBHOOK_TOKEN`;
- sincronização checkout/assinatura/pagamento;
- regras de inadimplência/cancelamento;
- preço comercial definitivo;
- teste de compra ponta a ponta.

A tela `/plus` continua sendo o destino dos CTAs e será o ponto de entrada do checkout quando a sprint de billing começar.

## Critérios de aceite

- `/tracks` mostra rails Mastery por categoria de código.
- Todos os conceitos aparecem no Mastery.
- Tracks técnicas com mais de 4 conteúdos aparecem no Mastery.
- Free vê CTA para `/plus` nos cards Mastery.
- Free vê CTA para `/plus` no resultado final de uma track elegível.
- Plus não vê o anúncio de conversão no resultado.
- Ranked permanece sem vantagem paga.
- Nenhuma alteração funcional no Asaas nesta sprint.
