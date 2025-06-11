📄 Modelo completo de README.md para seu projeto Help Desk

# 📞 Help Desk API

API REST para gerenciamento de chamados técnicos com autenticação, controle de perfis de usuários, comentários, categorias, estatísticas e um chat simples.

---

## 🚀 Tecnologias Usadas

- Node.js + Express
- MongoDB + Mongoose
- JWT (Autenticação)
- bcrypt (Criptografia de senhas)
- dotenv (Configuração de ambiente)
- Postman (para testes)

---

## 🛠️ Como Rodar o Projeto

1. Clone o repositório:

```bash
git clone <URL_DO_REPO>
cd Help\ desk

 Instale as dependências:

npm install
Crie um arquivo .env na raiz com as variáveis:

MONGO_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=sua_chave_secreta
PORT=5000

Popule o banco com dados de exemplo:
node seed.js

Inicie o servidor:
npm start

👥 Usuários criados pelo seed

Nome	Email	Senha	Role
Admin	admin@example.com	admin123	admin
Técnico	tecnico@example.com	tecnico123	tecnico
Cliente	cliente@example.com	cliente123	cliente

📦 Estrutura de Pastas

Help desk/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
├── seed.js
├── server.js

🔐 Autenticação
POST /api/auth/register

Cria novo usuário (por padrão como cliente)

Exemplo de JSON:

{
  "name": "Lucas",
  "email": "lucas@email.com",
  "password": "123456"
}

POST /api/auth/login

Retorna token JWT

{
  "email": "admin@example.com",
  "password": "admin123"
}

📋 Endpoints de Chamados
Método	Rota	Acesso	Descrição
GET	/api/tickets	autenticado	Lista todos os chamados
POST	/api/tickets	autenticado	Cria novo chamado
GET	/api/tickets/:id	autenticado	Busca chamado por ID
PUT	/api/tickets/:id	autenticado	Atualiza um chamado
PUT	/api/tickets/:id/status	técnico / admin	Atualiza status do chamado
📊 Estatísticas
Rota	Descrição
GET /api/tickets/stats	Estatísticas globais (admin/técnico)
GET /api/tickets/stats/user	Estatísticas do cliente logado
🗂️ Categorias
Método	Rota	Acesso	Descrição
GET	/api/categorias	autenticado	Lista categorias
POST	/api/categorias	admin	Cria nova categoria
💬 Comentários
Método	Rota	Descrição
POST	/api/comentarios/:ticketId	Adiciona comentário
GET	/api/comentarios/:ticketId	Lista comentários do chamado
💬 Chat Simples (Extra)
Método	Rota	Descrição
POST	/api/chat/:ticketId	Envia uma mensagem
GET	/api/chat/:ticketId	Lista todas as mensagens
📧 Notificação de Status

Ao atualizar o status de um chamado, uma mensagem simulando o envio de e-mail aparece no console:

📧 E-mail enviado: O chamado "Título" foi atualizado para "em_andamento"

🧪 Testes com Postman

    Faça login com qualquer usuário

    Copie o token JWT retornado

    Nas próximas requisições, adicione um header:

Authorization: Bearer SEU_TOKEN_AQUI

    Teste todos os endpoints seguindo a documentação acima

✅ Pronto!

O back-end está finalizado e pronto para:

    Integração com o front-end (React)

    Deploy no Render (API) e Vercel (front)

    Entrega e apresentação final
```
