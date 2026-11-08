# Assistente de Estudos com IA

![CI](https://github.com/JozySouza/AssistenteEstudos/blob/main/.github/workflows/ci.yml)

Sistema de perguntas e respostas com IA generativa (**Google Gemini**). O estudante digita uma dúvida e recebe uma explicação curta e didática na tela.

🔗 **Aplicação publicada:** https://assistente-estudos-apum.onrender.com

## Tecnologias

- **Backend:** Node.js + Express
- **IA:** Gemini API (chamada via `fetch`, chave só no servidor)
- **Frontend:** HTML, CSS e JavaScript puro
- **Testes:** Jest + Supertest (chamada à IA simulada com mock)
- **CI/CD:** GitHub Actions · **Deploy:** Render

## Estrutura

```
/backend    API Express, serviço da IA e testes
/frontend   Interface web (index.html, style.css, app.js)
.github/workflows/ci.yml   Pipeline de testes
render.yaml                Configuração de deploy
```

## Endpoints

| Método | Rota         | Descrição                                                        |
|--------|--------------|------------------------------------------------------------------|
| GET    | `/saude`     | Verifica se a API está no ar. Retorna `{ "status": "ok", ... }`  |
| POST   | `/perguntar` | Recebe `{ "pergunta": "..." }` e retorna `{ "resposta": "..." }` |

Erros: `400` (pergunta vazia, inválida ou com mais de 500 caracteres) e `502` (falha ao consultar a IA).

## Rodando localmente

1. Gere uma chave gratuita em https://aistudio.google.com/apikey
2. Configure o ambiente:
   ```bash
   cd backend
   cp .env.example .env      # edite o .env e coloque sua chave
   npm install
   npm start                 # http://localhost:3000
   ```
3. Abra `http://localhost:3000` no navegador (o backend serve o frontend).

## Testes

```bash
cd backend
npm test
```

Roda os testes com relatório de cobertura. O Jest falha se a cobertura ficar abaixo de **70%**. A IA é simulada (mock), então os testes não usam chave nem rede.

## Variáveis de ambiente

| Variável         | Descrição                                      |
|------------------|------------------------------------------------|
| `GEMINI_API_KEY` | Chave da API do Gemini (**obrigatória**)       |
| `GEMINI_MODEL`   | Modelo usado (padrão: `gemini-3.8-flash`)      |
| `PORT`           | Porta do servidor (padrão: `3000`)             |

O arquivo `.env` está no `.gitignore`; apenas o `.env.example` vai para o repositório.

## Deploy no Render

1. Em https://render.com, escolha **New → Blueprint** e conecte este repositório (o `render.yaml` configura tudo).
2. Informe o valor de `GEMINI_API_KEY` no painel do Render.
3. Após o deploy, copie a URL pública e atualize o link no topo deste README.

## Pipeline CI/CD

A cada push ou pull request na `main`, o GitHub Actions instala as dependências e roda `npm test`. O Render faz o deploy automático a cada push na `main`.
