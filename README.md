# Pinguim API - NestJS

## Tecnologias

- Node/Typescript
- NestJs (Framework)
- Docker (Docker)
- TypeORM (Query builder e migrations)

## Como rodar a aplicação local

### 1 - Pré-requisitos

- Docker instalado na máquina
- Node (versão 14 ou acima)
- Yarn

### 2 - Clonar o projeto do GitHub e instalar dependências

```bash
git clone git@github.com:lubysoftware/PINGUIM.NEST.git
yarn install # ou npm install
```

### 3 - Abra o terminal no diretório do projeto e rodar o docker-compose

```bash
docker-componse up

# Esse comando levantará o banco de dados e a API NEST em Docker
# Logo em seguida, ele aplicará as migrations/seeds do banco e depois dará watch nos arquivos,
# iniciando assim a api no endereço http://localhost:3333
```

## Documentação

- A documentação da api foi construída em cima do Swagger, uma aplicação web para uso de API's REST.
- Para acessar, entre no endereço http://localhost:3333/api
