# 🎤 Sistema de gerenciamento de palestras - Ifsp-DesenvWebII2026-I-LectureAppProject

Sistema Web completo desenvolvido com **Angular + Node.js + Express + MySQL** para gerenciamento de palestras e inscrições em eventos.

Projeto desenvolvido com base no material:<br>
**Projeto Prático com Angular – Cadastro em Palestras**<br>
<a href="https://adrianabelon.pro.br/">Profa. Adriana Belon</a><br>
Curso de Pós-Graduação Lato Sensu (Desenvolvimento para Internet II): Desenvolvimento de Sistemas Web e Aplicativos Móveis do Instituto Federal de São Paulo, Câmpus Capivari

# 📋 Funcionalidades

## Usuários

- Cadastro de usuários
- Login
- Criptografia de senhas com bcrypt
- Controle de sessão via LocalStorage
- Perfil Administrador

---

## Eventos

- Cadastro de palestras
- Listagem de palestras
- Edição de palestras
- Exclusão de palestras
- Contagem de inscritos
- Validação de data futura

---

## Inscrições

- Inscrição em palestras
- Cancelamento de inscrição
- Bloqueio de inscrições duplicadas
- Consulta de inscrições por usuário

---

## Segurança

- Senhas criptografadas utilizando bcrypt
- Validação de campos obrigatórios
- Validação de e-mail
- Controle de acesso administrativo

---

# 🏗 Arquitetura

```text
Angular
   ↓
HTTP REST
   ↓
Node.js + Express
   ↓
MySQL
```

---

# 📁 Estrutura do Projeto

```text
Ifsp-DesenvWebII2026-I-MultiRealEstateProject/

├── backend/
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── palestra.controller.js
│   │   └── inscricao.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── palestra.routes.js
│   │   └── inscricao.routes.js
│   │
│   ├── middleware/
│   │   └── admin.middleware.js
│   │
│   ├── database/
│   │   └── conexao.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── sistema-palestras/           (frontend)
    │
    ├── src/app/
    │
    ├── services/
    ├── models/
    ├── guards/
    ├── cadastro/
    ├── login/
    ├── home/
    ├── cadastrar-evento/
    └── editar-evento/
```

---

# 🚀 Tecnologias Utilizadas

## Frontend

- Angular 20
- TypeScript
- Bootstrap 5
- Reactive Forms
- HttpClient

## Backend

- Node.js
- Express
- MySQL2
- bcrypt
- dotenv
- cors

## Banco de Dados

- MySQL 8

---

# ⚙️ Instalação

## 0 - Instalar uma distribuição do Apache

<a href="https://www.apachefriends.org/pt_br/download.html">XAMPP 8.2.12 (64 bit) (Windows ou Linux)</a><br>

## 1 - Clonar Repositório

```bash
git clone  https://github.com/seuusuario/Ifsp-DesenvWebII2026-I-LectureAppProject.git

cd Ifsp-DesenvWebII2026-I-MultiRealEstateProject
```

---

# 🗄 Configuração do Banco de Dados

Criar banco:

```sql
CREATE DATABASE palestras
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Selecionar banco:

```sql
USE palestras;
```

---

## Tabela Usuários

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Tabela Palestra

```sql
CREATE TABLE palestra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    nomePalestrante VARCHAR(255) NOT NULL,
    localEvento VARCHAR(255) NOT NULL,
    dataEvento DATETIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Tabela Inscrições

```sql
CREATE TABLE inscricoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idPalestra INT NOT NULL,
    FOREIGN KEY (idUsuario)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
    FOREIGN KEY (idPalestra)
        REFERENCES palestra(id)
        ON DELETE CASCADE,
    UNIQUE(idUsuario,idPalestra)
);
```

---

# 🔧 Configuração Backend

Entrar na pasta:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

---

## Arquivo .env

Criar:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=palestras
```

---

## Executar Backend

```bash
npm run dev
```

ou

```bash
node server.js
```

Servidor:

```text
http://localhost:3000
```

---

# 🎨 Configuração Frontend

Entrar na pasta:

```bash
cd sistema-palestras
```

Instalar dependências:

```bash
npm install
```

Instalar Bootstrap:

```bash
npm install bootstrap
```

---

## Angular

Executar:

```bash
ng serve
```

Aplicação:

```text
http://localhost:4200
```

---

# 🔌 Endpoints da API

## Usuários

### Cadastro

```http
POST /api/cadastro
```

Body:

```json
{
  "nome": "Fabio",
  "email": "fabio@email.com",
  "senha": "12345678"
}
```

---

### Login

```http
POST /api/login
```

Body:

```json
{
  "email": "fabio@email.com",
  "senha": "12345678"
}
```

---

## Eventos

### Criar Evento

```http
POST /api/admin
```

### Listar Eventos

```http
GET /api/palestras
```

### Buscar Evento

```http
GET /api/eventos/:id
```

### Atualizar Evento

```http
PUT /api/eventos/:id
```

### Excluir Evento

```http
DELETE /api/eventos/:id
```

---

## Inscrições

### Realizar Inscrição

```http
POST /api/inscricao
```

### Cancelar Inscrição

```http
DELETE /api/inscricao/:idUsuario/:idPalestra
```

### Listar Inscrições

```http
GET /api/inscricoes/:idUsuario
```

### Verificar Inscrição

```http
GET /api/inscricao/verificar/:idUsuario/:idPalestra
```

---

# 🧪 Testes

## Fluxo Usuário

- Cadastro
- Login
- Visualização de palestras
- Inscrição
- Cancelamento

---

## Fluxo Administrador

- Login Admin
- Criar palestra
- Editar palestra
- Excluir palestra

---

# 🔒 Segurança

- bcrypt para armazenamento de senhas
- Validação de e-mail
- Validação de senha
- Controle de acesso administrativo
- Proteção contra inscrições duplicadas

---

# 📸 Telas

## Login

- Autenticação de usuários

## Cadastro

- Registro de usuários

## Home

- Lista de palestras

## Nova Palestra

- Cadastro de eventos

## Editar Palestra

- Atualização de eventos

---

# 📈 Melhorias Implementadas

- Interface Bootstrap
- Contador de inscritos
- Cancelamento de inscrições
- CRUD completo de palestras
- Controle administrativo
- bcrypt
- Reactive Forms
- Angular Standalone Components

---

# 👨‍💻 Autor

Projeto acadêmico inspirado e desenvolvido para aplicação dos conceitos de:

- Angular
- Node.js
- Express
- REST API
- MySQL
- Integração Frontend + Backend

<a href="https://adrianabelon.pro.br/">Profa. Adriana Belon</a><br>

---

# 📲 Contato / Contact

<a href="https://www.linkedin.com/in/f%C3%A1bio-lu%C3%ADs-guia-da-concei%C3%A7%C3%A3o-77784741/"><img src="https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>

---

<h5 align="center">
  &copy;06/2026 - <a href="https://github.com/Flgc/">Fábio Luis</a>
</h5>
