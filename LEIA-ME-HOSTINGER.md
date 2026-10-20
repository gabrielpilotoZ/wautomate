# Instalação na Hostinger — aplicativo Node.js

Este pacote contém o site em português e as configurações de atraso e “digitando” das respostas automáticas. É uma instalação nova: não inclui o banco local, senhas, conversas, arquivos recebidos ou sessões do WhatsApp.

## 1. Prepare o banco e o domínio

No painel da Hostinger, crie um banco MySQL e um usuário com acesso a esse banco. Anote o endereço do servidor, nome do banco, usuário e senha. Use um banco vazio exclusivo deste aplicativo. Configure o domínio e HTTPS.

## 2. Envie o ZIP

Em Sites, escolha criar/adicionar site → aplicativo web Node.js → upload de arquivos. Envie `wa-akg-hostinger.zip`. Não extraia em `public_html`: este aplicativo precisa executar um servidor Node.js.

Confira as configurações antes de publicar:

| Campo | Valor |
| --- | --- |
| Versão Node.js | 22 |
| Tipo/framework | Other / personalizado, com servidor próprio |
| Diretório raiz | raiz do ZIP, onde está package.json |
| Instalação, se solicitado | npm ci |
| Build | npm run build |
| Inicialização | npm start |
| Arquivo de entrada, se solicitado | server.cjs |

O comando `npm run build` gera o cliente Prisma e compila com Webpack, evitando o Turbopack que apresentou falha na hospedagem. Mantenha esse comando no painel.

O build gera `.next-production`. A execução também precisa de `server.cjs`, `src`, `prisma`, `public`, `package.json` e das dependências instaladas. Se o painel pedir diretório de saída, use `.next-production`, mas confira que a implantação preserva o restante do projeto para o servidor personalizado. Não publique somente essa pasta como arquivos estáticos.

Não use `next start`: ele não inicia o serviço de WhatsApp e o agendador deste projeto. Se o painel detectar Next.js automaticamente, ajuste para a inicialização personalizada acima.

## 3. Configure as variáveis antes do build

O arquivo `HOSTINGER-ENV.example` é um modelo sem credenciais reais. Cadastre os valores no painel de variáveis do aplicativo, sem as aspas externas.

- `DATABASE_URL`: conexão MySQL no formato `mysql://USUARIO:SENHA@HOST:3306/BANCO`. Use os dados da Hostinger. Caracteres especiais do usuário/senha devem ser codificados para URL; por exemplo, `@` vira `%40`. Não use o endereço do banco do seu computador.
- `AUTH_SECRET`: segredo aleatório exclusivo de pelo menos 32 caracteres. Mantenha o mesmo em novos uploads. Pode gerar com `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` em um computador com Node.js.
- `BASE_URL`, `AUTH_URL`, `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL`: endereço HTTPS do seu site, sem barra no final.
- `NEXT_PUBLIC_API_URL`: endereço HTTPS do site seguido de `/api`.
- `ADMIN_EMAIL`: seu e-mail para o primeiro administrador.
- `ADMIN_PASSWORD`: senha exclusiva de pelo menos 12 caracteres.
- `INIT_DATABASE=true`: somente na primeira implantação, para criar as tabelas. O processo não solicita apagar dados nem aceitar mudanças destrutivas.

As demais variáveis estão preenchidas no modelo. Não crie variáveis públicas (`NEXT_PUBLIC_...`) com senhas ou segredos. A porta é fornecida pela hospedagem; não sobrescreva `PORT` sem orientação do painel.

## 4. Primeiro acesso

Após concluir o build e a inicialização, abra o domínio e entre com `ADMIN_EMAIL` e `ADMIN_PASSWORD`. O administrador é criado apenas quando ainda não existe um SUPERADMIN; a senha de uma conta existente não é redefinida.

Confirme o acesso. Depois altere `INIT_DATABASE` para `false`, remova `ADMIN_PASSWORD` e `ADMIN_EMAIL` das variáveis e reinicie/reimplante. Novos cadastros públicos começam desativados nesta instalação.

Crie uma sessão e leia o QR Code. Para transferir o uso do mesmo número, desconecte a sessão do computador antes de conectar na hospedagem. Não mantenha duas instâncias deste projeto operando o mesmo número/banco simultaneamente.

## 5. Confira antes de usar continuamente

- Abra o painel, crie uma regra de teste e envie uma mensagem de outro número. Verifique atraso e “digitando”.
- Reinicie o aplicativo e confirme que a sessão reconecta e a regra permanece.
- Use uma única instância do aplicativo para evitar respostas e agendamentos duplicados.
- O banco guarda sessões e configurações; mídias ficam também em `data/media` e precisam de armazenamento persistente e backup. Confirme com a Hostinger a persistência dessa pasta entre novos uploads. Sem isso, mídias antigas podem deixar de abrir após a reimplantação.
- Confirme que o plano mantém o processo ativo e permite conexões contínuas do WhatsApp e Socket.IO. A disponibilidade 24 horas depende dessas condições da hospedagem.

## Problemas comuns

- **Falha de banco:** confira host, usuário, senha codificada, permissões e acesso do aplicativo Node.js ao MySQL. Na primeira instalação mantenha `INIT_DATABASE=true` até as tabelas serem criadas.
- **Site abre mas WhatsApp não responde:** confira que a inicialização executa `node server.cjs`, que a sessão está conectada e que o processo não foi suspenso.
- **Erro de login/origem:** confira o domínio HTTPS nas variáveis e mantenha `AUTH_TRUST_HOST=true`.
- **Erro de build:** veja o log no painel. O build deve terminar com sucesso antes de iniciar o servidor. As dependências são instaladas na Hostinger, não enviadas do Windows.

O projeto original contém um envio periódico de identificação da instalação ao domínio `api-wa-akg.aikeigroup.net`: endereço e nome do aplicativo, plataforma, versão do Node.js e consumo de memória. Esse comportamento continua no pacote; esta preparação não constitui uma auditoria completa de segurança do projeto.

A implantação na sua conta Hostinger ainda precisa ser validada após o upload. Referência do painel: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
