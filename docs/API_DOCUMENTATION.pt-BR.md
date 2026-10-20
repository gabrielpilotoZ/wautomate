# Documentação da API WA-AKG

Esta referência descreve as rotas disponíveis nesta instalação. Os nomes de campos, métodos HTTP e exemplos de código mantêm seus identificadores originais para preservar a compatibilidade das integrações.

## Autenticação

No painel, acesse **Webhooks e API** para gerar sua chave. Envie-a no cabeçalho `X-API-Key`. Proteja essa chave: ela autoriza acesso às sessões da sua conta.

```http
GET /api/sessions
X-API-Key: SUA_CHAVE
```

## Sessões e conexão

Crie uma sessão em **Sessões / QR**, abra **Gerenciar** e escaneie o QR Code pelo WhatsApp do celular, em **Aparelhos conectados**. Selecione a sessão na barra superior antes de usar respostas automáticas, agendamentos e outras ferramentas.

## Respostas automáticas

Crie uma regra com palavra-chave, tipo de correspondência e público. Você pode enviar texto, mídia ou ambos. A sessão precisa estar conectada para responder às mensagens recebidas.

## Agendamentos

Informe o destinatário, a mensagem e o horário. Confira o fuso nas configurações do sistema. O servidor precisa permanecer ligado no horário previsto.

## Webhooks

Cadastre uma URL que receba requisições HTTP e selecione os eventos desejados. O botão **Testar** faz uma requisição para o endereço informado. Consulte os registros para verificar respostas e falhas.

## Referência de endpoints

Os trechos entre colchetes nas rotas devem ser substituídos pelos identificadores correspondentes. Rotas marcadas como obsoletas existem para compatibilidade; prefira as rotas que incluem a sessão no endereço.

### Sessões

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/sessions` | Listar todas as sessões | `-` |
| POST | `/api/sessions` | Criar nova sessão | `Body: { name, sessionId }` |
| GET | `/api/sessions/[sessionId]` | Consultar detalhes da sessão | `Path: sessionId` |
| GET | `/api/sessions/[sessionId]/qr` | Consultar QR Code | `Path: sessionId` |
| GET | `/api/sessions/[sessionId]/bot-config` | Consultar configuração do robô | `Path: sessionId` |
| POST | `/api/sessions/[sessionId]/bot-config` | Atualizar configuração do robô | `Path: sessionId, Body: { enabled, botMode, ... }` |
| PATCH | `/api/sessions/[sessionId]/settings` | Atualizar configurações | `Path: sessionId, Body: { config }` |
| DELETE | `/api/sessions/[sessionId]/settings` | Excluir sessão | `Path: sessionId` |
| POST | `/api/sessions/[sessionId]/[action]` | Controlar sessão | `Path: sessionId, action (start&#124;stop&#124;restart&#124;logout)` |

### Grupos

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/groups/[sessionId]` | Listar grupos | `Path: sessionId` |
| POST | `/api/groups/[sessionId]/create` | Criar grupo | `Path: sessionId, Body: { subject, participants }` |
| POST | `/api/groups/[sessionId]/invite/accept` | Aceitar convite | `Path: sessionId, Body: { code }` |
| PUT | `/api/groups/[sessionId]/[jid]/picture` | Atualizar foto do grupo | `Path: sessionId, jid, Body: { file } (multipart/form-data)` |
| DELETE | `/api/groups/[sessionId]/[jid]/picture` | Remover foto do grupo | `Path: sessionId, jid` |
| PUT | `/api/groups/[sessionId]/[jid]/subject` | Atualizar nome do grupo | `Path: sessionId, jid, Body: { subject }` |
| PUT | `/api/groups/[sessionId]/[jid]/description` | Atualizar descrição | `Path: sessionId, jid, Body: { description }` |
| GET | `/api/groups/[sessionId]/[jid]/invite` | Consultar código de convite | `Path: sessionId, jid` |
| PUT | `/api/groups/[sessionId]/[jid]/invite/revoke` | Revogar convite | `Path: sessionId, jid` |
| PUT | `/api/groups/[sessionId]/[jid]/members` | Gerenciar participantes | `Path: sessionId, jid, Body: { action, participants }` |
| PUT | `/api/groups/[sessionId]/[jid]/settings` | Atualizar configurações | `Path: sessionId, jid, Body: { settings }` |
| PUT | `/api/groups/[sessionId]/[jid]/ephemeral` | Alternar mensagens temporárias | `Path: sessionId, jid, Body: { ephemeral }` |
| POST | `/api/groups/[sessionId]/[jid]/leave` | Sair do grupo | `Path: sessionId, jid` |
| GET | `/api/groups` | Listar grupos [OBSOLETO] | `Query: sessionId` |
| POST | `/api/groups/create` | Criar grupo [OBSOLETO] | `Body: { sessionId, subject, participants }` |
| POST | `/api/groups/invite/accept` | Aceitar convite [OBSOLETO] | `Body: { sessionId, code }` |

### Perfil

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/profile/[sessionId]` | Consultar próprio perfil | `Path: sessionId` |
| PUT | `/api/profile/[sessionId]/name` | Atualizar nome | `Path: sessionId, Body: { name }` |
| PUT | `/api/profile/[sessionId]/status` | Atualizar status | `Path: sessionId, Body: { status }` |
| PUT | `/api/profile/[sessionId]/picture` | Atualizar foto | `Path: sessionId, Body: { image } (multipart/form-data)` |
| DELETE | `/api/profile/[sessionId]/picture` | Remover foto | `Path: sessionId` |
| GET | `/api/profile` | Consultar perfil [OBSOLETO] | `Query: sessionId` |
| PUT | `/api/profile/name` | Atualizar nome [OBSOLETO] | `Body: { sessionId, name }` |
| PUT | `/api/profile/picture` | Atualizar foto [OBSOLETO] | `Body: { sessionId, image }` |
| DELETE | `/api/profile/picture` | Remover foto [OBSOLETO] | `Body: { sessionId }` |
| PUT | `/api/profile/status` | Atualizar status [OBSOLETO] | `Body: { sessionId, status }` |

### Mensagens

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| POST | `/api/messages/[sessionId]/[jid]/send` | Enviar mensagem | `Path: sessionId, jid, Body: { message }` |
| POST | `/api/messages/[sessionId]/[jid]/list` | Enviar mensagem em lista | `Path: sessionId, jid, Body: { ... }` |
| POST | `/api/messages/[sessionId]/[jid]/location` | Enviar localização | `Path: sessionId, jid, Body: { location }` |
| POST | `/api/messages/[sessionId]/[jid]/poll` | Enviar enquete | `Path: sessionId, jid, Body: { poll }` |
| POST | `/api/messages/[sessionId]/[jid]/spam` | Denunciar spam | `Path: sessionId, jid` |
| POST | `/api/messages/[sessionId]/[jid]/sticker` | Enviar figurinha | `Path: sessionId, jid, Body: { file, pack, author, type, quality } (multipart/form-data)` |
| POST | `/api/messages/[sessionId]/[jid]/[messageId]/react` | Enviar reação | `Path: sessionId, jid, messageId` |
| POST | `/api/messages/[sessionId]/[jid]/contact` | Enviar contato | `Path: sessionId, jid, Body: { vcard }` |
| POST | `/api/messages/[sessionId]/[jid]/forward` | Encaminhar mensagem | `Path: sessionId, jid, Body: { messageId }` |
| POST | `/api/messages/[sessionId]/broadcast` | Transmitir mensagem | `Path: sessionId, Body: { recipients[], message, delay }` |
| GET | `/api/messages/[sessionId]/broadcast/history` | Consultar histórico de transmissões | `Path: sessionId, Query: limit, offset` |
| GET | `/api/messages/[sessionId]/broadcast/history/[logId]` | Consultar detalhes da transmissão | `Path: sessionId, logId` |
| DELETE | `/api/messages/[sessionId]/[jid]/[messageId]` | Excluir mensagem | `Path: sessionId, jid, messageId` |
| GET | `/api/messages/[sessionId]/download/[messageId]/media` | Baixar mídia | `Path: sessionId, messageId` |
| GET | `/api/media/[filename]` | Disponibilizar arquivo de mídia | `Path: filename` |
| POST | `/api/messages/broadcast` | Transmitir mensagem [OBSOLETO] | `Body: { sessionId, jids[], message }` |
| POST | `/api/messages/contact` | Enviar contato [OBSOLETO] | `Body: { sessionId, jid, vcard }` |
| DELETE | `/api/messages/delete` | Excluir mensagem [OBSOLETO] | `Body: { sessionId, jid, messageId }` |
| POST | `/api/messages/forward` | Encaminhar mensagem [OBSOLETO] | `Body: { sessionId, jid, messageId }` |
| POST | `/api/messages/list` | Enviar mensagem em lista [OBSOLETO] | `Body: { sessionId, jid, ... }` |
| POST | `/api/messages/location` | Enviar localização [OBSOLETO] | `Body: { sessionId, jid, location }` |
| POST | `/api/messages/poll` | Enviar enquete [OBSOLETO] | `Body: { sessionId, jid, poll }` |
| POST | `/api/messages/react` | Enviar reação [OBSOLETO] | `Body: { sessionId, jid, reaction }` |
| POST | `/api/messages/spam` | Denunciar spam [OBSOLETO] | `Body: { sessionId, jid }` |
| POST | `/api/messages/sticker` | Enviar figurinha [OBSOLETO] | `Body: { sessionId, jid, sticker }` |

### Conversas

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/chat/[sessionId]` | Consultar conversas | `Path: sessionId, Query: page, limit` |
| GET | `/api/chat/[sessionId]/[jid]` | Consultar conversa específica | `Path: sessionId, jid, Query: limit` |
| POST | `/api/chat/[sessionId]/check` | Verificar números do WhatsApp | `Path: sessionId, Body: { phones[] }` |
| PUT | `/api/chat/[sessionId]/[jid]/read` | Marcar como lida | `Path: sessionId, jid` |
| POST | `/api/chat/[sessionId]/[jid]/archive` | Arquivar conversa | `Path: sessionId, jid, Body: { archive }` |
| POST | `/api/chat/[sessionId]/[jid]/presence` | Enviar presença | `Path: sessionId, jid, Body: { presence }` |
| POST | `/api/chat/[sessionId]/[jid]/profile-picture` | Consultar foto do perfil | `Path: sessionId, jid` |
| PUT | `/api/chat/[sessionId]/[jid]/mute` | Silenciar conversa | `Path: sessionId, jid, Body: { mute }` |
| PUT | `/api/chat/[sessionId]/[jid]/pin` | Fixar conversa | `Path: sessionId, jid, Body: { pin }` |
| GET | `/api/chats/[sessionId]/by-label/[labelId]` | Filtrar por etiqueta | `Path: sessionId, labelId` |
| POST | `/api/chat/[sessionId]/send` | Enviar mensagem [OBSOLETO] | `Path: sessionId, Body: { jid, message }` |
| PUT | `/api/chat/archive` | Arquivar conversa [OBSOLETO] | `Body: { sessionId, jid, archive }` |
| POST | `/api/chat/check` | Verificar números do WhatsApp [OBSOLETO] | `Body: { sessionId, phones[] }` |
| PUT | `/api/chat/mute` | Silenciar conversa [OBSOLETO] | `Body: { sessionId, jid, mute }` |
| PUT | `/api/chat/pin` | Fixar conversa [OBSOLETO] | `Body: { sessionId, jid, pin }` |
| POST | `/api/chat/presence` | Enviar presença [OBSOLETO] | `Body: { sessionId, jid, presence }` |
| POST | `/api/chat/profile-picture` | Consultar foto do perfil [OBSOLETO] | `Body: { sessionId, jid }` |
| PUT | `/api/chat/read` | Marcar como lida [OBSOLETO] | `Body: { sessionId, jid }` |
| POST | `/api/chat/send` | Enviar mensagem [OBSOLETO] | `Body: { sessionId, jid, message }` |
| GET | `/api/chats/by-label/[labelId]` | Filtrar por etiqueta [OBSOLETO] | `Path: labelId, Query: sessionId` |

### Contatos

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/contacts/[sessionId]` | Listar contatos | `Path: sessionId, Query: search` |
| POST | `/api/contacts/[sessionId]/[jid]/block` | Bloquear contato | `Path: sessionId, jid` |
| POST | `/api/contacts/[sessionId]/[jid]/unblock` | Desbloquear contato | `Path: sessionId, jid` |
| GET | `/api/contacts` | Listar contatos [OBSOLETO] | `Query: search` |
| POST | `/api/contacts/block` | Bloquear contato [OBSOLETO] | `Body: { sessionId, jid }` |
| POST | `/api/contacts/unblock` | Desbloquear contato [OBSOLETO] | `Body: { sessionId, jid }` |

### Etiquetas

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/labels/[sessionId]` | Listar etiquetas | `Path: sessionId` |
| POST | `/api/labels/[sessionId]` | Criar etiqueta | `Path: sessionId, Body: { name, color }` |
| PUT | `/api/labels/[sessionId]/[id]` | Atualizar etiqueta | `Path: sessionId, id, Body: { name, color }` |
| DELETE | `/api/labels/[sessionId]/[id]` | Excluir etiqueta | `Path: sessionId, id` |
| GET | `/api/labels/[sessionId]/chat-labels/[jid]` | Consultar etiquetas da conversa | `Path: sessionId, jid` |
| PUT | `/api/labels/[sessionId]/chat-labels/[jid]` | Adicionar/remover etiquetas | `Path: sessionId, jid, Body: { labelIds[], action }` |
| GET | `/api/labels` | Listar etiquetas [OBSOLETO] | `Query: sessionId` |
| POST | `/api/labels` | Criar etiqueta [OBSOLETO] | `Body: { sessionId, name, color }` |
| GET | `/api/labels/chat-labels` | Consultar etiquetas da conversa [OBSOLETO] | `Query: sessionId, jid` |
| PUT | `/api/labels/chat-labels` | Atualizar etiquetas da conversa [OBSOLETO] | `Body: { sessionId, jid, labelIds[], action }` |

### Respostas automáticas

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/autoreplies/[sessionId]` | Listar respostas automáticas | `Path: sessionId` |
| POST | `/api/autoreplies/[sessionId]` | Criar resposta automática | `Path: sessionId, Body: { keyword, response, matchType }` |
| GET | `/api/autoreplies/[sessionId]/[id]` | Consultar resposta automática | `Path: sessionId, id` |
| PUT | `/api/autoreplies/[sessionId]/[id]` | Atualizar resposta automática | `Path: sessionId, id, Body: { ... }` |
| DELETE | `/api/autoreplies/[sessionId]/[id]` | Excluir resposta automática | `Path: sessionId, id` |
| GET | `/api/autoreplies` | Listar respostas automáticas [OBSOLETO] | `Query: sessionId` |
| POST | `/api/autoreplies` | Criar resposta automática [OBSOLETO] | `Body: { sessionId, keyword, ... }` |

### Agendamentos

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/scheduler/[sessionId]` | Listar agendamento | `Path: sessionId` |
| POST | `/api/scheduler/[sessionId]` | Criar agendamento | `Path: sessionId, Body: { jid, content, sendAt }` |
| GET | `/api/scheduler/[sessionId]/[id]` | Consultar agendamento | `Path: sessionId, id` |
| PUT | `/api/scheduler/[sessionId]/[id]` | Atualizar agendamento | `Path: sessionId, id, Body: { ... }` |
| DELETE | `/api/scheduler/[sessionId]/[id]` | Excluir agendamento | `Path: sessionId, id` |
| GET | `/api/scheduler` | Listar agendamento [OBSOLETO] | `Query: sessionId` |
| POST | `/api/scheduler` | Criar agendamento [OBSOLETO] | `Body: { sessionId, content, ... }` |

### Webhooks

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/webhooks/[sessionId]` | Listar webhooks | `Path: sessionId` |
| POST | `/api/webhooks/[sessionId]` | Criar webhook | `Path: sessionId, Body: { name, url, events[] }` |
| PUT | `/api/webhooks/[sessionId]/[id]` | Atualizar webhook | `Path: sessionId, id, Body: { ... }` |
| DELETE | `/api/webhooks/[sessionId]/[id]` | Excluir webhook | `Path: sessionId, id` |
| GET | `/api/webhooks` | Listar webhooks [OBSOLETO] | `Query: sessionId` |
| POST | `/api/webhooks` | Criar webhook [OBSOLETO] | `Body: { sessionId, url, ... }` |

### Notificações

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/notifications` | Listar notificações | `-` |
| POST | `/api/notifications` | Criar notificação | `Body: { title, message, ... }` |
| PATCH | `/api/notifications/read` | Marcar como lida | `Body: { ids[] }` |
| DELETE | `/api/notifications/delete` | Excluir notificações | `Query: id` |

### Usuários

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/users` | Listar usuários | `-` |
| POST | `/api/users` | Criar usuário | `Body: { name, email, password }` |
| GET | `/api/users/[id]` | Consultar usuário | `Path: id` |
| PATCH | `/api/users/[id]` | Atualizar usuário | `Path: id, Body: { ... }` |
| DELETE | `/api/users/[id]` | Excluir usuário | `Path: id` |
| GET | `/api/user/api-key` | Consultar chave da API | `-` |
| POST | `/api/user/api-key` | Gerar chave da API | `-` |
| DELETE | `/api/user/api-key` | Revogar chave da API | `-` |

### Sistema

| Método | Rota | Descrição | Parâmetros |
| --- | --- | --- | --- |
| GET | `/api/settings/system` | Consultar configurações do sistema | `-` |
| POST | `/api/settings/system` | Atualizar configurações do sistema | `Body: { appName, logoUrl, timezone }` |
| POST | `/api/status/[sessionId]/update` | Atualizar status | `Path: sessionId, Body: { status }` |
| GET | `/api/system/check-updates` | Verificar atualizações | `-` |

## Erros e diagnóstico

- **400:** confira os campos obrigatórios e o formato dos dados.
- **401:** entre na conta ou confira a chave da API.
- **403:** sua conta não tem acesso ao recurso.
- **404:** confira os identificadores e a rota.
- **429:** aguarde antes de fazer novas solicitações.
- **500:** consulte os registros do servidor.

O código-fonte e a documentação técnica original estão no [repositório do projeto](https://github.com/mrifqidaffaaditya/WA-AKG).
