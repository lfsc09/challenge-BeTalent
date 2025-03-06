# challenge-BeTalent

## Sobre

Este teste prático foi desenvolvido com:

- [`Adonis.s`](https://docs.adonisjs.com/guides/preface/introduction) como framework para a API Rest.
- [`Lucid`](https://lucid.adonisjs.com/docs/introduction) como plugin ORM (interface com o DB e Migrations) disponível pelo próprio `Adonis.js`.
- [`VinJS`](https://vinejs.dev/docs/introduction) como plugin para validação disponível pelo próprio `Adonis.js`.
- [`Japa`](https://japa.dev/docs/introduction) como plugin de testes disponível pelo próprio `Adonis.js`.
- `Mysql` como banco de dados.
- `Docker` para geração da infra (DB e Gateways usadas).

### Rotas

| Rota                                                | Método   | Tipo    | Descrição                                                                 |
| --------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------- |
| `/login`                                            | `POST`   | pública | Realizar o login _(Para rotas administrativas)_                           |
| [`/purchase`](#purchase)                            | `POST`   | pública | Realizar uma compra de um cliente informando produtos                     |
| [`/gateways/:id/active`](#gateways-active-edit)     | `PUT`    | privada | Ativar/desativar um gateway                                               |
| [`/gateways/:id/priority`](#gateways-priority-edit) | `PUT`    | privada | Alterar a prioridade de um gateway                                        |
| [`/users`](#users-list)                             | `GET`    | privada | Listar todos os usuários                                                  |
| [`/users`](#users-new)                              | `POST`   | privada | Criar um usuário                                                          |
| [`/users/:id`](#users-edit)                         | `PUT`    | privada | Editar um usuário                                                         |
| [`/users/:id`](#users-delete)                       | `DELETE` | privada | Apagar um usuário                                                         |
| [`/products`](#products-list)                       | `GET`    | privada | Listar todos os produtos                                                  |
| [`/products`](#products-new)                        | `POST`   | privada | Criar um produto                                                          |
| [`/products/:id`](#products-edit)                   | `PUT`    | privada | Editar um produto                                                         |
| [`/products/:id`](#products-delete)                 | `DELETE` | privada | Apagar um produto                                                         |
| `/clients`                                          | `GET`    | privada | Listar todos os clientes                                                  |
| `/clients/:id?`                                     | `GET`    | privada | Detalhes do cliente e todas suas compras                                  |
| `/purchases`                                        | `GET`    | privada | Listar todas as compras                                                   |
| `/purchases/:id?`                                   | `GET`    | privada | Detalhes de uma compra                                                    |
| `/reimburse`                                        | `POST`   | privada | Realizar reembolso de uma compra junto ao gateway com validação por roles |

</br>

## Roadmap

- [x] Criar docker compose configurando as Gateways e o DB.
- [x] Implementar Controller, Validações, Models, Migration e Testes de usuários.
- [x] Implementar Controller, Validações, Models, Migration e Testes de produtos.
- [ ] Implementar Controller, Models, Migration e Testes de clientes.
- [x] Implementar Controller, Models, Migration e Testes de gateways.
- [ ] Implementar Controller, Models, Migration e Testes de transações.
- [ ] Gerar middleware the autenticação.
- [ ] Gerar middleware de autorização para as roles.

</br>

## Rodando o projeto

_Acesse o projeto em `127.0.0.1` se estiver usando WSL2._

### Testes

#### 1. Iniciar os Mocks das Gateways e Banco de Dados

_Container das Gateways não é utilizado nos testes, a conexão com elas é substituída._

```bash
docker compose -f ./docker/compose.yaml up --build --detach
```

```bash
docker compose -f ./docker/compose.yaml down
```

#### 2. Rodar a Migration & Seeds (Manualmente)

_Para os testes as seeds não são necessárias._

```bash
npm run migrations:fresh
```

#### 3. Rodar testes

```bash
npm run test
```

</br>

### Dev

#### 1. Iniciar os Mocks das Gateways e do Banco de Dados

```bash
docker compose -f ./docker/compose.yaml up --build --detach
```

```bash
docker compose -f ./docker/compose.yaml down
```

#### 2. Rodar a Migration & Seeds (Manualmente)

```bash
npm run migrations:fresh
```

#### 3. Rodar a API (Sem buildar)

_Rode as Migrations antes._

```bash
npm run dev
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

## Rotas detalhes

### purchase

##### HTTP Request

    Endpoint: /purchase
    Method: POST

    Response Codes:
     - 201: Sucesso
     - 404: Cliente ou Produto não encontrado
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "clientName": "Cliente",
  "clientEmail": "cliente@betalent.com",
  "products": [
    {
      "productId": "26256e4e-3dc9-4e1d-983e-7b059d1ae0b4",
      "quantity": 2
    },
    {
      "productId": "39ff6d1b-37da-4e05-9828-3ebd4b988336",
      "quantity": 1
    }
  ],
  "cardNumbers": "5569000000006063",
  "cardCvv": "010"
}
```

##### Implementação

A implementação desta rota é dividida em 2 partes (serviços).

Na primeira, de forma sincrona com a request, o serviço `create_purchase.ts` captura/cria o Cliente, captura os produtos na request, gera uma entidade `Transaction` que computa o valor total da compra, persiste essa entidade no banco e por fim invoca por meio de um `Emitter` do Adonis a segunda etapa.

_Optei por passar os dados do cartão na request e também por salvá-los encriptados na tabela `transaction`, para possibilitar que o serviço `process_payment.ts` pudesse ser totalmente independente._

O fim da primeira etapa ja retorna uma resposta com um dos status acima, de forma a prender os clients apenas para validação dos dados da request.

Na segunda, de forma assincrona, o serviço `process_payment.ts` executa. Ele restaura os dados de uma transação _(no caso a que veio da primeira etapa)_, altera o status da transação conforme o progresso, escolhe uma das gateways implementadas _(usando a prioridade)_ e conecta a ela fazendo o pagamento com os dados necessários.

Caso a gateway esteja indisponível haverá no máximo 3 retries até a gateway ser marcada como indisponível. Os retries são inalteráveis e seguem um backoff linear. A indisponibilidade da Gateway pode ser automaticamente revertida por tempo configurado pelas variáveis de ambiente `AUTO_RECOVER_GATEWAY_IN_MINUTES=2` e `AUTO_RECOVER_GATEWAY=true`. **(Por padrão as gateways se auto recuperam)**

A escolha das gateways são através da factory `payment_factory.ts`, que le do DB as gateways cadastradas, e baseada na escolhida retorna uma instacia da implementação da gateway. Dessa forma adicionar novas gateways requer apenas criar uma nova implemetação do contrato `payment_gateway.ts`, adicionar essa gateway ao DB e adicionar novas variáveis de ambiente para o `HOST` e `PORT` dela.

_O serviço `process_payment.ts` pode ser chamado a qualquer momento, com a unica restrição de ser passado o id da transação que irá ser processado._

</br>

### gateways active edit

##### HTTP Request

    Endpoint: /gateways/:id/active
    Method: PUT

    Response Codes:
     - 200: Sucesso
     - 404: Gateway não encontrado
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "isActive": true
}
```

</br>

### gateways priority edit

##### HTTP Request

    Endpoint: /gateways/:id/priority
    Method: PUT

    Response Codes:
     - 200: Sucesso
     - 404: Gateway não encontrado
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "priority": 4
}
```

</br>

### users list

##### HTTP Request

    Endpoint: /users
    Method: GET

    Response Codes:
     - 200: Sucesso

##### Response Payload (Exemplo)

```json
[
  {
    "id": "ae17635e-b683-4e35-aaae-396e2c29d723",
    "email": "admin@betalent.com",
    "role": "ADMIN",
    "createdAt": "2025-03-06T06:17:19.000+00:00",
    "updatedAt": "2025-03-06T06:17:19.000+00:00"
  }
]
```

</br>

### users new

##### HTTP Request

    Endpoint: /users
    Method: POST

    Response Codes:
     - 201: Sucesso
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "email": "admin@betalent.com",
  "password": "12345678",
  "role": "ADMIN"
}
```

</br>

### users edit

##### HTTP Request

    Endpoint: /users/:id
    Method: PUT

    Response Codes:
     - 200: Sucesso
     - 404: Usuário não encontrado
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "email": "admin@betalent.com", // Opcional
  "password": "12345678", // Opcional
  "role": "ADMIN" // Opcional
}
```

</br>

### users delete

##### HTTP Request

    Endpoint: /users/:id
    Method: DELETE

    Response Codes:
     - 200: Sucesso
     - 404: Usuário não encontrado

</br>

### products list

##### HTTP Request

    Endpoint: /products
    Method: GET

    Response Codes:
     - 200: Sucesso

##### Response Payload (Exemplo)

```json
[
  {
    "id": "ae17635e-b683-4e35-aaae-396e2c29d723",
    "name": "produto 1",
    "amount": 10.5,
    "createdAt": "2025-03-06T06:17:19.000+00:00",
    "updatedAt": "2025-03-06T06:17:19.000+00:00"
  }
]
```

</br>

### products new

##### HTTP Request

    Endpoint: /products
    Method: POST

    Response Codes:
     - 201: Sucesso
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "name": "produto 1",
  "amount": 40.25
}
```

</br>

### products edit

##### HTTP Request

    Endpoint: /products/:id
    Method: PUT

    Response Codes:
     - 200: Sucesso
     - 404: Produto não encontrado
     - 422: Payload passada inválida

##### Request Payload (Exemplo)

```json
{
  "name": "produto 2", // Opcional
  "amount": 27.78 // Opcional
}
```

</br>

### products delete

##### HTTP Request

    Endpoint: /products/:id
    Method: DELETE

    Response Codes:
     - 200: Sucesso
     - 404: Produto não encontrado

</br>

## Dificuldades

- Decidir se nos testes dos endpoints usava um Faker em memória dos serviços `*_database.ts`, ou se dava hit no database. Como o Model do `adonis` lida automaticamente retornando `404` nos `findOrFail` usar o serviço com database ficava mais simples nos testes. Porém usando o database requeri que o `docker compose` seja rodado antes de executar testes, consumindo mais recursos.
