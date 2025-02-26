# challenge-BeTalent

## Sobre

Este teste prático foi desenvolvido com:

- (`Adonis.js`)[https://docs.adonisjs.com/guides/preface/introduction] como framework para a API Rest.
- (`Lucid`)[https://lucid.adonisjs.com/docs/introduction] como plugin ORM (interface com o DB e Migrations) disponível pelo próprio `Adonis.js`.
- (`VinJS`)[https://vinejs.dev/docs/introduction] como plugin para validação disponível pelo próprio `Adonis.js`.
- (`Japa`)[https://japa.dev/docs/introduction] como plugin de testes disponível pelo próprio `Adonis.js`.
- `Mysql` como banco de dados.
- `Docker` para geração da infra (DB e Gateways usadas).

### Rotas

| Rota                | Método   | Tipo    | Descrição                                                                 |
| ------------------- | -------- | ------- | ------------------------------------------------------------------------- |
| `/login`            | `POST`   | pública | Realizar o login                                                          |
| `/purchase`         | `POST`   | pública | Realizar uma compra informando o produto                                  |
| `/gateway/active`   | `POST`   | privada | Ativar/desativar um gateway                                               |
| `/gateway/priority` | `POST`   | privada | Alterar a prioridade de um gateway                                        |
| `/users`            | `GET`    | privada | Listar todos os usuários                                                  |
| `/users`            | `POST`   | privada | Criar um usuário                                                          |
| `/users/:id`        | `PUT`    | privada | Editar um usuário                                                         |
| `/users/:id`        | `DELETE` | privada | Apagar um usuário                                                         |
| `/products`         | `GET`    | privada | Listar todos os produtos                                                  |
| `/products`         | `POST`   | privada | Criar um produto                                                          |
| `/products/:id`     | `PUT`    | privada | Editar um produto                                                         |
| `/products/:id`     | `DELETE` | privada | Apagar um produto                                                         |
| `/clients`          | `GET`    | privada | Listar todos os clientes                                                  |
| `/clients/:id?`     | `GET`    | privada | Detalhes do cliente e todas suas compras                                  |
| `/purchases`        | `GET`    | privada | Listar todas as compras                                                   |
| `/purchases/:id?`   | `GET`    | privada | Detalhes de uma compra                                                    |
| `/reimburse`        | `POST`   | privada | Realizar reembolso de uma compra junto ao gateway com validação por roles |

</br>

## Roadmap

- [x] Criar docker compose configurando as Gateways e o DB.
- [ ] Implementar Controller, Validações, Models, Migration e Testes de usuários.
- [ ] Implementar Controller, Validações, Models, Migration e Testes de produtos.
- [ ] Implementar Controller, Models, Migration e Testes de clientes.
- [ ] Implementar Controller, Models, Migration e Testes de gateways.
- [ ] Implementar Controller, Models, Migration e Testes de transações.
- [ ] Gerar middleware the autenticação.
- [ ] Gerar middleware de autorização para as roles.

</br>

## Rodando o projeto

_Acesse o projeto em `127.0.0.1` se estiver usando WSL2._

### Dev

#### Iniciar os Mocks das Gateways e do Banco de Dados

As Gateways serão disponíveis em `http://localhost:3001` e `http://localhost:3002`.

```bash
docker compose -f ./docker/compose.yaml up --build --detach
```

```bash
docker compose -f ./docker/compose.yaml down
```

#### Rodar a Migration & Seeds (Manualmente)

```bash
npm run migrations:fresh
```

#### Rodar a API (Sem buildar)

_Rode as Migrations antes._

```bash
npm run dev
```

#### Rodar testes

```bash
npm run test
```

</br>

### Prod

Rodar o projeto fazendo build.

```bash
docker compose -f ./docker/compose.yaml --profile production up --build --detach
```

```bash
docker compose -f ./docker/compose.yaml --profile production down
```

</br>

## Dificuldades
