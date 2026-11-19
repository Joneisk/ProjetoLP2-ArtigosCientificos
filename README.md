# 📚 Artigos Científicos com IA

Plataforma full stack para cadastrar, categorizar e consultar artigos científicos. O **Google Gemini** gera automaticamente um resumo e recomendações de leitura para cada artigo.

## Funcionalidades
- Cadastro e login de usuários (senhas com bcrypt)
- CRUD de artigos e categorias, com upload de arquivos
- **Resumo automático com IA** (Gemini 2.5 Flash) e retry com backoff exponencial
- Interface SPA responsiva com notificações

## Stack

| Camada | Tecnologias |
|---|---|
| Frontend | Vue 3 · TypeScript · Vite · Pinia · Vue Router · Tailwind CSS |
| Backend | Node.js · Express 5 · Mongoose · Multer · bcrypt |
| Banco | MongoDB (Docker) |
| IA | Google Gemini (`@google/genai`) |

## Como rodar

```bash
docker compose up -d            # MongoDB na porta 27018

cd backend
cp .env.example .env            # PORT, MONGODB_URI, GEMINI_API_KEY
npm install && node seed.js && node index.js

cd ../frontend
npm install && npm run dev
```
