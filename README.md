# challenge-BeTalent

## Sobre

Este teste prático foi desenvolvido com:

- `Adonis.js` como framework para a API Rest.
- `Lucid` como plugin ORM (interface com o DB e Migrations) disponível pelo próprio `Adonis.js`.
- `VinJS` como plugin para validação disponível pelo próprio `Adonis.js`.
- `Mysql` como banco de dados.
- `Docker` para geração da infra (DB e Gateways usadas).

### Rotas

| Rota | Método | Tipo | Descrição |
| ---- | ---- | --------- |
| `/login` | `POST` | pública | Realizar o login |
| `/purchase` | `POST` | pública | Realizar uma compra informando o produto |
| `/gateway/active` | `POST` | privada | Ativar/desativar um gateway |
| `/gateway/priority` | `POST` | privada | Alterar a prioridade de um gateway |
| `/user` | `GET` | privada | Listar todos os usuários |
| `/user` | `POST` | privada | Criar um usuário |
| `/user` | `PUT` | privada | Editar um usuário |
| `/user` | `DELETE` | privada | Apagar um usuário |
| `/product` | `GET` | privada | Listar todos os produtos |
| `/product` | `POST` | privada | Criar um produto |
| `/product` | `PUT` | privada | Editar um produto |
| `/product` | `DELETE` | privada | Apagar um produto |
| `/client/list` | `GET` | privada | Listar todos os clientes |
| `/client/detail` | `GET` | privada | Detalhes do cliente e todas suas compras |
| `/purchase/list` | `GET` | privada | Listar todas as compras |
| `/purchase/detail` | `GET` | privada | Detalhes de uma compra |
| `/reimburse` | `POST` | privada | Realizar reembolso de uma compra junto ao gateway com validação por roles |

</br>

## Roadmap

- [ ] Criar docker compose configurando as Gateways e o DB.
- [ ] Implementar Controller, Models, Migration e Testes de usuários.
- [ ] Implementar Controller, Models, Migration e Testes de produtos.
- [ ] Implementar Controller, Models, Migration e Testes de clientes.
- [ ] Implementar Controller, Models, Migration e Testes de gateways.
- [ ] Implementar Controller, Models, Migration e Testes de transações.

</br>

## Rodando o projeto

### Dev

Rodando o projeto para desenvolver.

#### Iniciar os Mocks das Gateways e do Banco de Dados

As Gateways serão disponíveis em `http://localhost:3001` e `http://localhost:3002`.

```bash
docker compose -f ./docker/compose.yaml up --build --detach
```

```bash
docker compose -f ./docker/compose.yaml down
```

#### Rodar a API

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


