# Investigador - Sistema de Inteligência Política

Dashboard premium de inteligência política que monitora grupos de WhatsApp usando IA, com identidade visual cyber-intelligence futurista.

## Funcionalidades

- ✅ **Autenticação Completa**: Login e Cadastro com Supabase
- ✅ **Banco de Dados**: Usuários com hierarquia Admin/Usuário
- ✅ **Dashboard Premium**: Interface cyber-intelligence com identidade visual única
- ✅ **Monitoramento em Tempo Real**: Widgets radar com estatísticas
- ✅ **Gerenciamento de Palavras-chave**: Configuração de triggers de monitoramento
- ✅ **Timeline de Eventos**: Histórico completo de ocorrências
- ✅ **PWA (Progressive Web App)**: Instalável como app mobile/desktop
- ✅ **Design Responsivo**: Otimizado para mobile e desktop
- ✅ **Proteção de Rotas**: Middleware de autenticação

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

As variáveis de ambiente já estão configuradas no código, mas certifique-se de que o arquivo `.env.local` existe com:

```
NEXT_PUBLIC_SUPABASE_URL=https://fhnsjvypxnvhqipgqghp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobnNqdnlweG52aHFpcGdxZ2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQ2MTUsImV4cCI6MjA2NjI4MDYxNX0.EzrR2srkL1XLlVMjY2wf4R4CokfQdM7hm9e641SliHg
```

### 3. Configurar o banco de dados no Supabase

Execute o SQL do arquivo `supabase/schema.sql` no SQL Editor do Supabase:

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em SQL Editor
3. Cole o conteúdo de `supabase/schema.sql`
4. Execute o script

Este script irá:
- Criar a tabela `users` com hierarquia de roles
- Configurar Row Level Security (RLS)
- Criar triggers para criar perfis automaticamente
- Configurar políticas de acesso

### 4. Executar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
├── app/
│   ├── dashboard/          # Dashboard principal
│   │   ├── dashboard-client.tsx  # Tela de monitoramento
│   │   ├── keywords/       # Gerenciamento de palavras-chave
│   │   ├── timeline/       # Timeline de eventos
│   │   └── settings/       # Configurações
│   ├── login/              # Página de login (design cyber-intelligence)
│   ├── signup/             # Página de cadastro (design cyber-intelligence)
│   ├── layout.tsx          # Layout principal com PWA
│   ├── page.tsx            # Página inicial (redireciona)
│   └── globals.css         # Estilos globais cyber-intelligence
├── components/
│   ├── ui/                 # Componentes base (Button, Input, Card, etc.)
│   └── layout/             # Topbar, Sidebar, MobileMenu
├── lib/
│   ├── supabase.ts         # Cliente Supabase (client-side)
│   └── supabase-server.ts  # Cliente Supabase (server-side)
├── supabase/
│   └── schema.sql          # Schema do banco de dados
├── public/
│   ├── manifest.json       # Manifest PWA
│   └── sw.js              # Service Worker
└── middleware.ts           # Middleware de autenticação
```

## Hierarquia de Usuários

- **Admin**: Acesso completo, pode ver e gerenciar todos os usuários
- **Usuário**: Acesso padrão, pode ver apenas seu próprio perfil

Para tornar um usuário admin, você pode:
1. Atualizar diretamente no banco de dados Supabase
2. Criar o usuário com role 'admin' no metadata durante o signup (requer modificação do código)

## Identidade Visual

O sistema utiliza uma identidade visual **cyber-intelligence** premium:

- **Paleta de Cores**: Grafite azul profundo (#050B16) com neon verde (#4CFF85) e ciano (#29F1FF)
- **Logo**: Olho digital com radar circular, anéis concêntricos e crosshair
- **Estilo**: Futurista, limpo, profissional e tecnológico
- **Efeitos**: Glow neon, animações de radar, blur sutil

## PWA (Progressive Web App)

O sistema é configurado como PWA e pode ser instalado:

1. **No Mobile**: Abra no navegador e selecione "Adicionar à tela inicial"
2. **No Desktop**: Use o menu do navegador para instalar
3. **Funcionalidades PWA**:
   - Funciona offline (com cache)
   - Interface nativa
   - Notificações push (futuro)
   - Atualizações automáticas

## Responsividade

- **Desktop**: Sidebar fixa + conteúdo principal
- **Mobile**: Menu flutuante inferior + layout adaptativo
- **Tablet**: Layout híbrido otimizado

## Próximos Passos

- Integração com API de WhatsApp
- Sistema de notificações push
- Exportação de relatórios
- Dashboard analítico avançado
- Integração com mais fontes de dados

