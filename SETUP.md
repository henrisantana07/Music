# 🚀 Guia de Setup Detalhado - Ember Music

Este guia detalha todos os passos necessários para configurar e rodar o Ember Music.

## Pré-requisitos

- Node.js 18.17 ou superior
- npm, yarn ou bun
- Git
- Contas em:
  - [Supabase](https://supabase.com) (gratuito)
  - [Google Cloud Console](https://console.cloud.google.com) (para OAuth)
  - [Jamendo Developer](https://developer.jamendo.com) (para a API)

## 1️⃣ Instalação Local

### 1.1 Clonar e instalar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ember-music.git
cd ember-music

# Instale as dependências
npm install
```

### 1.2 Criar arquivo `.env.local`

```bash
cp .env.example .env.local
```

## 2️⃣ Configurar Supabase

### 2.1 Criar projeto Supabase

1. Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Configure:
   - **Project name:** `ember-music` (ou similar)
   - **Database password:** Use uma senha forte
   - **Region:** Escolha o mais próximo de você
4. Clique em **"Create new project"**
5. Aguarde o projeto ser criado (pode levar alguns minutos)

### 2.2 Copiar credenciais

Na página do seu projeto Supabase:

1. Vá para **"Settings"** > **"API"**
2. Em **Project Settings**, copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Adicione essas variáveis ao seu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2.3 Configurar Google OAuth no Supabase

1. Na dashboard do Supabase, vá para **Authentication** > **Providers**
2. Clique em **Google**
3. Deixe em branco por enquanto (você vai preencher com credenciais do Google Cloud)
4. Copie o **Redirect URI** (você vai precisar disso)

## 3️⃣ Configurar Google OAuth (Google Cloud Console)

### 3.1 Criar projeto no Google Cloud

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique em **"Select a Project"** no topo
3. Clique em **"NEW PROJECT"**
4. Nomeie como **"Ember Music"** e clique **"Create"**

### 3.2 Habilitar Google+ API

1. Na barra de busca, procure por **"Google+ API"**
2. Clique em **"Google+ API"** nos resultados
3. Clique em **"ENABLE"**

### 3.3 Criar Credenciais OAuth

1. Vá para **"APIs & Services"** > **"Credentials"**
2. Clique em **"Create Credentials"** > **"OAuth 2.0 Client IDs"**
3. Pode aparecer uma mensagem sobre "Configure OAuth consent screen":
   - Clique em **"Configure Consent Screen"**
   - Escolha **User type: External**
   - Preencha os dados básicos e clique **"Save and Continue"**
4. Depois clique em **"Create Credentials"** novamente
5. Escolha **Application Type: Web application**
6. Nomeie como **"Ember Music Local"**

### 3.4 Configurar URIs de Redirect

Em **Authorized redirect URIs**, adicione:

```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback/
```

Para produção (depois do deploy), adicione também:

```
https://seu-dominio.vercel.app/auth/callback
https://seu-dominio.vercel.app/auth/callback/
```

Clique em **"Create"**.

### 3.5 Copiar credenciais

Na tabela de credenciais, você verá **"Ember Music Local"**:

1. Clique para abrir
2. Copie:
   - **Client ID** → `NEXT_PUBLIC_GOOGLE_CLIENT_ID` no `.env.local`
   - **Client Secret** → **NÃO copie agora** (usaremos só o Client ID)

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abc123xyz.apps.googleusercontent.com
```

### 3.6 Voltar ao Supabase e preencher Google Provider

1. Volte para Supabase Dashboard
2. Vá para **Authentication** > **Providers** > **Google**
3. Preencha:
   - **Client ID:** Cole o Client ID do Google Cloud
   - **Client Secret:** Cole o Client Secret (você pode clicar no olho no Google Cloud para ver)
4. Clique em **"Save"**

## 4️⃣ Configurar Jamendo API

### 4.1 Registrar no Jamendo Developer

1. Acesse [developer.jamendo.com](https://developer.jamendo.com)
2. Clique em **"Sign Up"** ou **"Log In"**
3. Preencha os dados de registro

### 4.2 Criar aplicação

1. Vá para **"My apps"** ou **"Dashboard"**
2. Clique em **"Create new app"**
3. Nomeie como **"Ember Music"**
4. Aceite os termos
5. Você receberá um **Client ID**

### 4.3 Adicionar ao `.env.local`

```env
NEXT_PUBLIC_JAMENDO_API_KEY=seu_client_id_aqui
```

## 5️⃣ Rodar script de setup do Supabase

O script vai criar automaticamente as tabelas, buckets e políticas de segurança:

```bash
npm run setup:supabase
```

Durante a execução, pode ser que o script peça por:

1. **URL do Supabase** - Cole a que você copiou
2. **Service Role Key** - Vá em Supabase > Settings > API > service_role (com cuidado!)

Após concluir, você receberá um arquivo `.env.local` atualizado.

### ⚠️ Se o script falhar

Você pode criar as tabelas manualmente:

1. Na dashboard do Supabase, vá para **SQL Editor**
2. Clique em **"New Query"**
3. Cole o SQL das tabelas (veja no script)
4. Execute

## 6️⃣ Configurar outras variáveis

Adicione ao `.env.local`:

```env
# Autenticação
NEXTAUTH_SECRET=seu_secret_aleatorio_aqui
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_NAME=Ember Music
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Para gerar um secret seguro:

```bash
# MacOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 -InputObject (33..126) | % {[char]$_}) -join ''))
```

## 7️⃣ Iniciar desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 8️⃣ Testar fluxo de login

1. Clique em **"Entrar com Google"**
2. Você será redirecionado para o Google
3. Após autorizar, voltará para o app
4. Você deve estar logado!

## 📋 Verificação

Após setup, verifique:

- ✅ Você consegue fazer login com Google
- ✅ Avatar e nome aparecem no perfil
- ✅ Musicas carregam na Home
- ✅ Busca funciona
- ✅ Pode adicionar às favoritos
- ✅ Pode reproduzir músicas
- ✅ Download funciona

## 🚀 Deploy no Vercel

### 8.1 Preparar repository

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 8.2 Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New"** > **"Project"**
3. Selecione seu repositório GitHub
4. Clique em **"Import"**

### 8.3 Adicionar variáveis de ambiente

Na aba **"Environment Variables"**:

Adicione todas as variáveis de `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_JAMENDO_API_KEY=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://seu-dominio.vercel.app
```

### 8.4 Deploy

Clique em **"Deploy"**. Após alguns minutos, seu app estará ao vivo!

### 8.5 Atualizar Google OAuth

No Google Cloud Console:

1. Vá para **Credentials** > **Ember Music Local**
2. Adicione na **Authorized redirect URIs**:
   ```
   https://seu-dominio.vercel.app/auth/callback
   ```
3. Clique em **"Save"**

## 🆘 Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL is not set"

- Verifique se `.env.local` existe
- Verifique se as variáveis estão definidas
- Reinicie: `npm run dev`

### Google login redireciona errado

- Certifique-se que a URL de redirect está registrada no Google Cloud
- Verifique se está usando exatamente `http://localhost:3000` em dev
- Limpe cookies e tente novamente

### API do Jamendo retorna erro

- Verifique se o Client ID está correto
- Teste em [developer.jamendo.com/playground](https://developer.jamendo.com/playground)

### Música não toca

- Abra DevTools (F12) > Console
- Procure por erros de CORS
- Teste a URL do áudio no navegador

### Avatar não faz upload

- Verifique se o bucket "avatars" existe no Supabase
- Confira as políticas de acesso do bucket
- Arquivo deve ter < 5MB

## 📞 Suporte

Se tiver problemas:

1. Confira este guia novamente
2. Procure nos issues do GitHub
3. Abra um novo issue com logs de erro
4. Consulte a documentação oficial:
   - [Supabase Docs](https://supabase.com/docs)
   - [Jamendo API Docs](https://developer.jamendo.com/documentation)
   - [Next.js Docs](https://nextjs.org/docs)

---

**Pronto para rodar! 🔥**
