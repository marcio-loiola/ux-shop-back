🛍️ API de Loja Online | Desafio UX Software

Olá, equipe UX Software! 👋

Este projeto é a minha solução para o desafio técnico de Desenvolvedor Back-End. Foquei em construir uma API robusta, pragmática e alinhada com os requisitos do desafio, demonstrando minha capacidade de transformar ideias em realidade através de código bem estruturado e boas práticas de desenvolvimento.

Grande parte do trabalho, mesmo que não visível na interface, está detalhado no código, incluindo migrations, autenticação JWT e estrutura modular com NestJS.

🚀 Jornada do Projeto & Decisões Técnicas
O projeto foi desenvolvido com foco em escalabilidade e manutenibilidade. Optei por NestJS devido à sua arquitetura modular e suporte nativo ao TypeScript, facilitando a criação de uma API RESTful eficiente. Para o banco de dados, utilizei PostgreSQL com TypeORM para gerenciar as entidades e migrations, garantindo consistência e versionamento adequado.

A autenticação foi implementada com JWT e Passport, permitindo controle de acesso seguro. O carrinho de compras foi persistido no banco, associado ao usuário autenticado. Para o cadastro de usuários, integrei um sistema de confirmação por e-mail (simulado via console para este desafio).

Diante dos requisitos não funcionais, priorizei o uso de Docker Compose para subir toda a aplicação, facilitando o desenvolvimento e deploy. As migrations foram criadas para gerenciar o schema do banco, e os commits seguem convenções semânticas para clareza.

Todos esses detalhes estão registrados no repositório, com documentação clara e testes básicos.

✅ O que foi entregue

- **Produtos**: Listagem pública com paginação e filtros; CRUD restrito a administradores.
- **Carrinho**: Adição e remoção de produtos, persistido no banco para usuários autenticados.
- **Autenticação**: Login via JWT; apenas usuários logados manipulam o carrinho.
- **Cadastro de Usuário**: Registro com envio de e-mail de confirmação (simulado no console).
- **Migrations**: Gerenciamento completo do banco via TypeORM.
- **Docker**: Configuração com docker-compose para subir app, banco e pgAdmin.
- **Documentação**: Endpoints documentados com Swagger (integrado ao NestJS).

🛠️ Tech Stack & Arquitetura

- **Backend**: Node.js, NestJS, TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT, Passport
- **DevOps**: Docker, Docker Compose
- **Outros**: Class Validator, Bcrypt para senhas, UUID para IDs

A arquitetura segue o padrão modular do NestJS, com separação clara entre módulos (auth, users, products, cart). As entidades estão bem definidas, e os DTOs garantem validação robusta.

▶️ Como rodar o projeto
A maneira mais fácil de validar o projeto é usando Docker Compose:

1. **Clone o repositório**:

   ```
   git clone <repository-url>
   cd nest-typeorm-api
   ```

2. **Inicie os serviços**:

   ```
   docker-compose up -d
   ```

   - Isso iniciará o app (porta 3333), banco PostgreSQL (porta 5432) e pgAdmin (porta 8000).

3. **Execute as migrations** (se necessário):

   ```
   docker-compose exec app npm run migration:run
   ```

4. **Acesse a aplicação**:
   - API: http://localhost:3333
   - Documentação Swagger: http://localhost:3333/api
   - pgAdmin: http://localhost:8000 (email: admin@admin.com, senha: admin)

💡 Alternativa sem Docker (Node.js + PostgreSQL local)
Caso o Docker apresente problemas:

1. Instale PostgreSQL e crie um banco `nestjs_typeorm_db`.
2. Configure as variáveis de ambiente (veja abaixo).
3. Instale dependências:
   ```
   npm install
   ```
4. Execute migrations:
   ```
   npm run migration:run
   ```
5. Inicie o servidor:
   ```
   npm run start:dev
   ```

🌐 Variáveis de Ambiente Necessárias
Crie um arquivo `.env` na raiz do projeto com:

```
NODE_ENV=development
PORT=3333
DB_HOST=localhost  # ou 'db' se usar Docker
DB_PORT=5432
DB_USER=postgres
DB_PASS=docker
DB_NAME=nestjs_typeorm_db
DB_SSL=false
JWT_SECRET=your-secret-key
```

📋 Endpoints Disponíveis
A API está documentada no Swagger. Principais endpoints:

- **Auth**:
  - `POST /auth/login`: Login (retorna JWT)
  - `POST /auth/register`: Cadastro de usuário (envia e-mail simulado)

- **Users**:
  - `GET /users`: Listar usuários (admin)
  - `POST /users`: Criar usuário (admin)

- **Products**:
  - `GET /products`: Listar produtos (público, com paginação/filtros)
  - `POST /products`: Criar produto (admin)
  - `PUT /products/:id`: Atualizar produto (admin)
  - `DELETE /products/:id`: Remover produto (admin)

- **Cart**:
  - `GET /cart`: Ver carrinho (autenticado)
  - `POST /cart/add`: Adicionar produto ao carrinho (autenticado)
  - `DELETE /cart/remove/:productId`: Remover produto do carrinho (autenticado)

Para testar, use ferramentas como Postman ou Insomnia. Inclua o token JWT no header `Authorization: Bearer <token>` para endpoints protegidos.

⚠️ Observação importante

- O envio de e-mail é simulado no console (ex: "E-mail enviado para user@example.com").
- Para deploy, utilize plataformas como Heroku, Railway ou AWS. O docker-compose facilita a transição.

⏰ Nota Final sobre o Prazo
Enfrentei desafios na configuração do ambiente Docker e na implementação das funcionalidades, mas foquei em entregar uma solução funcional e bem documentada. Acredito que este projeto evidencia minha paixão por desenvolvimento back-end, atenção aos detalhes e compromisso em entregar APIs seguras e eficientes.

Agradeço pela oportunidade e confiança! Espero que este projeto demonstre minha habilidade em criar soluções robustas com as tecnologias sugeridas. 🚀✨

Bora codar! 🔥🚀
