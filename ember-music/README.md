# 🔥 Ember Music

Uma plataforma de streaming de música moderna com conteúdo licenciado sob Creative Commons. Construída com Next.js, Supabase e integração com a API do Jamendo.

## 🎯 Features

- ✨ **Streaming de Música CC** - Acesso a musicas independentes com licença Creative Commons
- 🔐 **Autenticação Google OAuth** - Login seguro com Google
- ❤️ **Favoritos** - Salve suas músicas favoritas
- 🎵 **Recomendações** - Descobra musicas baseado no gênero preferido
- 🎧 **Player Premium** - Controles avançados de reprodução
- 📱 **Responsivo** - Funciona em mobile, tablet e desktop
- 🎨 **Design Moderno** - Identidade visual elegante e intuitiva
- 📜 **Informações de Licença** - Exibe as licenças CC de cada música

## 🛠️ Stack Técnico

- **Frontend:** Next.js 15+ (App Router), React 19+, TypeScript
- **Estilização:** Tailwind CSS + CSS Variables
- **Backend/Dados:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** Zustand
- **API de Música:** Jamendo
- **Deploy:** Vercel

## 📋 Pré-requisitos

- Node.js 18.17+ e npm/yarn/bun
- Conta no Supabase (gratuita)
- Chave API do Jamendo
- Credenciais do Google OAuth

## 🚀 Quick Start

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/ember-music.git
cd ember-music
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Supabase

#### 3.1 Criar projeto no Supabase

- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Copie a URL do projeto e a chave Anon
- Configure o Google OAuth:
  - Vá para `Authentication > Providers > Google`
  - Adicione suas credenciais do Google

#### 3.2 Rodar o script de setup

```bash
npm run setup:supabase
```

Este script vai:
- Criar as tabelas necessárias (profiles, favorites, playlists, etc)
- Configurar Row Level Security (RLS)
- Criar o bucket de storage para avatares
- Gerar o arquivo `.env.local`

### 4. Configurar API do Jamendo

- Acesse [developer.jamendo.com](https://developer.jamendo.com)
- Registre-se e crie uma aplicação
- Copie seu `client_id`
- Adicione ao `.env.local`:

```bash
NEXT_PUBLIC_JAMENDO_API_KEY=seu_client_id
```

### 5. Configurar Google OAuth

- Acesse [Google Cloud Console](https://console.cloud.google.com)
- Crie um novo projeto
- Habilite Google+ API
- Crie credenciais (OAuth 2.0 Client ID)
- Configure redirect URIs:
  - `http://localhost:3000/auth/callback`
  - `https://seu-dominio.vercel.app/auth/callback` (para produção)
- Copie o Client ID e adicione ao `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Estrutura de Pastas

```
ember-music/
├── app/
│   ├── layout.tsx           # Layout root
│   ├── page.tsx             # Home
│   ├── login/
│   ├── search/              # Busca com filtros
│   ├── favorites/           # Favoritos do usuário
│   └── profile/             # Perfil do usuário
├── components/
│   ├── layout/              # Sidebar, TopBar
│   ├── player/              # Player de reprodução
│   ├── tracks/              # Card de faixa
│   ├── modals/              # Modal de licença CC
│   └── ui/                  # Componentes reutilizáveis
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   ├── jamendo.ts           # Client da API Jamendo
│   └── player-store.ts      # Store Zustand do player
├── types/
│   └── index.ts             # Tipos TypeScript
├── scripts/
│   └── setup-supabase.ts    # Script de setup
├── public/                  # Assets
├── middleware.ts            # Middleware de auth
├── .env.example             # Template de env
└── package.json
```

## 🎨 Paleta de Cores

- **Fundo Base:** `#0A0908`
- **Fundo Surface:** `#161311`
- **Fundo Elevated:** `#211C18`
- **Acento:** Gradiente de `#FF6A00` a `#FFC400`
- **Texto Principal:** `#F5F1ED`
- **Texto Secundário:** `#A39B92`

## 🗄️ Estrutura do Banco de Dados

### Tabelas principais:

- **profiles** - Dados do usuário
- **favorites** - Músicas favoritadas
- **playlists** - Playlists criadas
- **playlist_tracks** - Faixas das playlists
- **listening_history** - Histórico de reprodução

Todas com Row Level Security (RLS) habilitado para proteger dados do usuário.

## 🌐 Deploy no Vercel

### 1. Push para GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Conectar ao Vercel

- Acesse [vercel.com](https://vercel.com)
- Importe seu repositório do GitHub
- Configure as variáveis de ambiente

### 3. Deploy

```bash
vercel --prod
```

Ou através do dashboard do Vercel.

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Jamendo
NEXT_PUBLIC_JAMENDO_API_KEY=your_jamendo_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# App
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção localmente
npm run start

# Setup do Supabase
npm run setup:supabase

# Lint
npm run lint
```

## 🐛 Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL is not set"

- Verifique se o arquivo `.env.local` existe
- Certifique-se que as variáveis estão definidas corretamente
- Reinicie o servidor de desenvolvimento

### Google Login não funciona

- Verifique se o Google Client ID está correto
- Confira se o redirect URI está registrado no Google Cloud Console
- Certifique-se que Google+ API está habilitada

### Música não está tocando

- Confira se a URL da API do Jamendo está acessível
- Verifique se a chave API do Jamendo é válida
- Confira o console do navegador por erros CORS

### Upload de avatar falha

- Verifique se o bucket "avatars" foi criado no Supabase Storage
- Confira as políticas de RLS do bucket
- Certifique-se que o tamanho da imagem é menor que 5MB

## 📚 Documentação Útil

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Jamendo API](https://developer.jamendo.com/documentation)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

As músicas no Ember Music são licenciadas sob Creative Commons - consulte cada faixa para sua licença específica.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Next.js e paixão por música independente.

## 🙋 Suporte

Tem dúvidas ou encontrou um bug? Abra uma issue no GitHub!

---

**Aproveite o Ember Music! 🔥🎵**
