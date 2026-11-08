# Decisões do projeto

Este documento explica por que escolhi a stack do **Assistente de Estudos com IA** e o que aprendi construindo o projeto.

## Por que esta stack

- **Node.js + Express:** é leve e me permite usar JavaScript no frontend e no backend. Como a API tem só duas rotas (`/saude` e `/perguntar`), um framework mínimo era suficiente.
- **Google Gemini via `fetch`, sem SDK:** chamar a API diretamente reduziu dependências e me deixou controlar toda a requisição, inclusive o cabeçalho com a chave. O plano gratuito também cabia no escopo de um projeto acadêmico.
- **Frontend em HTML, CSS e JavaScript puro:** a interface é um formulário e uma área de resposta. Um framework só adicionaria complexidade. O próprio backend serve a pasta `frontend`, então há uma única URL e não preciso configurar CORS entre serviços.
- **Jest + Supertest:** são a combinação mais comum para testar APIs Node, com cobertura integrada e limite mínimo de 70% configurado no `package.json`.
- **GitHub Actions + Render:** o pipeline roda os testes a cada push e o `render.yaml` descreve o deploy como código, o que torna a publicação reproduzível.

## O que aprendi

1. **Segredos ficam no servidor.** A chave da API nunca chega ao navegador, vai no cabeçalho `x-goog-api-key` em vez de na URL, e o `.env` fica no `.gitignore`, com apenas o `.env.example` versionado.
2. **Testes de IA precisam de mock.** Chamar o modelo de verdade deixaria os testes lentos, pagos e instáveis. Simulando a IA, testei os casos de sucesso e de falha (chave ausente, erro HTTP, resposta vazia) sem rede.
3. **Validar a entrada protege o sistema.** Limitar o tamanho da pergunta e o corpo da requisição evita abusos e gastos desnecessários de cota.
4. **O prompt de sistema define o comportamento.** Pedir resposta curta, em português e didática mudou muito a qualidade do resultado.

## O que faria diferente

Adicionaria limite de requisições por usuário, histórico de conversa e deploy condicionado ao pipeline verde.
