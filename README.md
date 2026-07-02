# Triage App

Cliente de triagem (emissão de senhas) do NovoSGA. Aplicativo standalone (Vue 2 + Electron) que fala com um NovoSGA já instalado através da API REST/OAuth2 — não depende de rodar dentro do app principal.

## Sobre este fork

Este repositório é um fork de [novosga/triage-app](https://github.com/novosga/triage-app), com as seguintes adições:

- **Restrição de horário de emissão de senhas**: configurável na tela de Configurações → aba "Horário". A configuração fica salva **localmente** (`localStorage` do totem), permitindo travar a emissão em um totem específico sem afetar os demais. A checagem acontece no cliente, antes de qualquer chamada à API.
- **Seletor de cores visual**: todos os campos de cor (globais, por serviço e por departamento) agora têm um seletor de cor nativo (`input type="color"`) ao lado do campo de texto, em vez de exigir digitar o código hexadecimal manualmente. Ver `src/renderer/components/ColorField.vue`.
- **Ajustes visuais**: botões arredondados, sombras sutis e tipografia mais moderna, sobre o mesmo Bulma já usado no projeto original — sem mudança de estrutura das telas.

O remote `upstream` (não `origin`) aponta para o repositório original, caso precise acompanhar atualizações de lá:

```bash
git remote add upstream https://github.com/novosga/triage-app.git
git fetch upstream
```

## Aviso sobre o toolchain

Este projeto foi gerado com [electron-vue](https://github.com/SimulatedGREG/electron-vue) em 2018 (Vue 2, webpack 4, Electron 2, `node-sass` 4). O `.travis.yml` original usa **Node 7**. Em máquinas com Node moderno (16+), `npm install` falha por causa dos binários nativos do `node-sass` e do `electron` (que não têm mais prebuilds para essas versões).

**O que funciona hoje**: instalar e buildar com **Node 10**, via Docker, sem precisar instalar essa versão antiga na máquina:

```bash
# instalar dependências (gera node_modules/ na própria pasta do projeto)
docker run --rm -it -v "$PWD:/app" -w /app node:10 npm install

# lint
docker run --rm -it -v "$PWD:/app" -w /app node:10 npm run lint

# build web (gera dist/web/) — é o modo usado para servir via nginx/navegador
docker run --rm -it -v "$PWD:/app" -w /app node:10 npm run build:web

# build Electron (gera dist/electron/ + empacota com electron-builder)
docker run --rm -it -v "$PWD:/app" -w /app node:10 npm run build
```

Depois de rodar `npm install` uma vez, o `package-lock.json` pode ser regenerado com pequenas diferenças de resolução (ruído, não relacionado ao código) — evite commitar essas mudanças de lockfile a menos que esteja atualizando dependências de propósito.

## Rodando o build web localmente (Docker)

Depois de gerar `dist/web/` (comando acima), sirva com qualquer servidor estático. Exemplo com nginx:

```bash
docker run -d --name triage-app \
  -p 8082:80 \
  -v "$PWD/dist/web:/usr/share/nginx/html:ro" \
  nginx:alpine
```

Acesse `http://localhost:8082`.

> A imagem oficial `novosga/triage-app` no Docker Hub também é só um nginx servindo um `dist/web` pré-buildado — não tem lógica de servidor nenhuma.

## Configuração (conectando a um NovoSGA)

Na primeira execução, o app pede pra configurar o servidor em **Configurações → Servidor**:

| Campo | Onde conseguir |
|---|---|
| Servidor | URL base do NovoSGA (ex: `http://localhost:8080`) |
| Usuário / Senha | Credenciais de um usuário do NovoSGA |
| Client ID / Client Secret | Um client OAuth2 cadastrado no NovoSGA (grant `password`) |

Para criar o client OAuth2 no NovoSGA (rodar dentro do container/app do NovoSGA):

```bash
php bin/console league:oauth2-server:create-client "Triage App" triage-app SEU_SECRET \
  --grant-type password --grant-type refresh_token --scope default
```

Depois de salvar, o app busca automaticamente unidades, serviços, prioridades e departamentos via API (`/api/unidades`, `/api/unidades/{id}/servicos`, `/api/prioridades`, `/api/departamentos`) e emite senhas via `/api/distribui` / `/api/print/{id}`.

## Funcionalidades

### Horário de emissão de senhas

Em **Configurações → Horário**:

- Ative "Restringir emissão de senhas por horário".
- Adicione uma ou mais janelas (ex: 07:00–11:00 e 13:00–16:00).
- Fora de todas as janelas, o totem recusa emitir a senha e mostra uma mensagem informando quando a emissão volta (ou que está encerrada por hoje, se não houver mais janelas).
- Como é salvo no `localStorage`, cada totem tem sua própria configuração — dá pra travar só um totem específico sem afetar os outros.

Lógica em `src/renderer/util/functions.js` (`isDentroHorario`, `proximaAbertura`), usada em `src/renderer/pages/Home.vue` (método `ticket`).

### Cores

`src/renderer/components/ColorField.vue` é usado em **Configurações → Interface** (cores globais) e nas tabelas de **Serviços**/**Departamentos** (cor por item). Aceita tanto o seletor visual quanto o código hexadecimal digitado diretamente.
