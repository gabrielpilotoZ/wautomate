# wautomate

Gerenciador de WhatsApp baseado no [WA-AKG](https://github.com/mrifqidaffaaditya/WA-AKG), com interface em português e configurações de atraso e indicação de digitação nas respostas automáticas.

## Execução

Use Node.js 22 e um banco MySQL. Configure as variáveis usando `HOSTINGER-ENV.example` como referência, com valores próprios. Nunca envie credenciais ao repositório.

```sh
npm ci
npm run build
npm start
```

A inicialização executa `server.cjs`. Não substitua por `next start`: o servidor próprio inicia a integração com WhatsApp. Na primeira instalação, `INIT_DATABASE=true` prepara o banco, e `ADMIN_EMAIL` e `ADMIN_PASSWORD` criam o administrador quando ainda não existe um. Após confirmar o acesso, desative `INIT_DATABASE` e remova as variáveis do primeiro administrador. Alterar essas variáveis não redefine contas existentes.

## Render

Crie um Web Service ligado a este repositório. Use `npm ci && npm run build` como comando de build e `node server.cjs` como comando de inicialização. Configure as URLs com o domínio real do serviço. `DATABASE_URL` precisa apontar para um MySQL acessível pelo Render; `localhost` não representa o banco da Hostinger.

O plano gratuito pode suspender a aplicação por inatividade e não oferece disco persistente. Ele serve para testes, sem garantia de automações contínuas. Mídias em `data/media` podem ser perdidas em reinícios. A implantação no Render ainda não foi validada.

## Dados e limitações

Este repositório não contém banco, sessões de WhatsApp, conversas nem credenciais da instalação local. O consumo de memória e processos precisa ser medido no ambiente de destino. O projeto original envia periodicamente identificação da instalação ao serviço de monitoramento do autor; esse comportamento permanece.

Licença MIT; veja `LICENSE`. Instruções anteriores da Hostinger estão em `LEIA-ME-HOSTINGER.md`.
