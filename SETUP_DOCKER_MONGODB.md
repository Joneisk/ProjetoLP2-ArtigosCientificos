# 🚀 Setup do Projeto com Docker + MongoDB

## 📋 Configuração do Banco de Dados

### 1. **Verificar se o Docker está rodando**

Seu Docker já está mapeado para a porta `27018` do host → `27017` do MongoDB

```bash
# Verificar containers rodando
docker ps

# Se o MongoDB não estiver rodando, inicie:
docker start nome_do_container
```

### 2. **Conectar ao MongoDB**

A URI de conexão está configurada em `.env`:
```
MONGODB_URI=mongodb://localhost:27018/artigos
```

- **Host:** localhost
- **Porta:** 27018 (mapeada do Docker)
- **Banco de dados:** `artigos` (criado automaticamente)

### 3. **Visualizar o MongoDB (Opcional)**

Se você tiver o MongoDB Compass instalado:
- Abra o MongoDB Compass
- Conexão: `mongodb://localhost:27018`
- Você verá o banco `xhopii` com as coleções

---

## 🌱 Criar Categorias no Banco

### **Opção 1: Usar o Script de Seed (Recomendado)**

```bash
cd backend
npm install        # Se não tiver instalado
npm run seed       # Cria as categorias padrão
```

**Categorias criadas:**
- Medicina
- Física
- Biologia
- Engenharia
- Neurociência
- Computação

**Output esperado:**
```
✅ 6 categorias criadas com sucesso!
   - Medicina (ID: 65a1b2c3d4e5f6g7h8i9j0k1)
   - Física (ID: 65a1b2c3d4e5f6g7h8i9j0k2)
   ... etc
```

### **Opção 2: Criar via API (Frontend)**

1. Inicie o backend: `npm run dev`
2. Abra o frontend: `npm run dev`
3. Use o formulário para criar categorias (se houver permissão)

### **Opção 3: Usar MongoDB Compass (Manual)**

1. Abra MongoDB Compass
2. Conecte em `mongodb://localhost:27018`
3. Crie banco `xhopii`
4. Crie coleção `categorias`
5. Insira documentos:

```json
{
  "nome": "Medicina",
  "descricao": "Pesquisas e artigos sobre medicina",
  "criadoEm": new Date()
}
```

---

## 🔧 Rodar o Projeto

### **Backend**
```bash
cd backend
npm install      # Primeira vez
npm run dev      # Desenvolvimento
# ou
npm start        # Produção
```

Deve mostrar:
```
Conectado ao MongoDB
Servidor rodando em http://localhost:3000
```

### **Frontend**
```bash
cd frontend
npm install      # Primeira vez
npm run dev      # Desenvolvimento
```

Deve mostrar:
```
Local: http://localhost:5173
```

---

## 📊 Estrutura do Banco

```
xhopii (banco)
├── logins (usuários)
│   ├── nome
│   ├── email
│   ├── senha (hash)
│   └── instituicao
│
├── categorias (categorias de artigos)
│   ├── nome (único)
│   └── descricao
│
└── artigos (artigos científicos)
    ├── titulo
    ├── categoria (ref)
    ├── resumo
    ├── conteudo
    ├── autores
    ├── palavrasChave
    ├── autorId (ref login)
    ├── autorNome
    ├── curtidas
    ├── descurtidas
    └── dataPublicacao
```

---

## ❓ Troubleshooting

### **"Connection refused na porta 27018"**
- Docker não está rodando
- Verifique: `docker ps`
- Se não aparecer, execute: `docker start seu_container_mongodb`

### **"Banco 'xhopii' não aparece no Compass"**
- Insira um documento na coleção primeiro
- MongoDB só cria banco quando há dados

### **"Seed não funcionou"**
```bash
# Verifique a conexão
npm run seed

# Se falhar, veja o erro e reinicie o Docker
docker restart seu_container_mongodb
npm run seed
```

---

## ✅ Verificar Integração

1. **Backend conectado ao MongoDB:**
   ```
   npm run dev
   # Deve mostrar: Conectado ao MongoDB
   ```

2. **Categorias criadas:**
   ```
   npm run seed
   # Deve mostrar: ✅ 6 categorias criadas com sucesso!
   ```

3. **Frontend consegue listar:**
   - Abra http://localhost:5173
   - Veja se os artigos aparecem (pode estar vazio, mas sem erros)

---

## 🎯 Próximos Passos

1. ✅ Docker + MongoDB rodando na porta 27018
2. ✅ Banco `xhopii` criado
3. ✅ Categorias inseridas
4. ⏳ Criar usuário de teste
5. ⏳ Publicar primeiro artigo

Para qualquer dúvida, rode `npm run seed` novamente!
