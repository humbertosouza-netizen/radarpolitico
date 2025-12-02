# Guia de Deploy - Radar Político

## Configuração de Variáveis de Ambiente

Para fazer o deploy da aplicação, é necessário configurar as variáveis de ambiente no seu provedor de hospedagem (Vercel, Netlify, etc.).

### Variáveis Necessárias

Configure as seguintes variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://fhnsjvypxnvhqipgqghp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobnNqdnlweG52aHFpcGdxZ2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQ2MTUsImV4cCI6MjA2NjI4MDYxNX0.EzrR2srkL1XLlVMjY2wf4R4CokfQdM7hm9e641SliHg
```

### Configuração no Vercel

1. Acesse o painel do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://fhnsjvypxnvhqipgqghp.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobnNqdnlweG52aHFpcGdxZ2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQ2MTUsImV4cCI6MjA2NjI4MDYxNX0.EzrR2srkL1XLlVMjY2wf4R4CokfQdM7hm9e641SliHg`
4. Selecione os ambientes: **Production**, **Preview**, e **Development**
5. Clique em **Save**
6. Faça um novo deploy para aplicar as mudanças

### Configuração Local

Para desenvolvimento local:

1. Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Preencha as variáveis no arquivo `.env.local` com suas credenciais reais

3. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Importante

- ⚠️ **NUNCA** commite o arquivo `.env.local` no Git
- O arquivo `.env.local` já está no `.gitignore` e será ignorado automaticamente
- As variáveis de ambiente devem ser configuradas diretamente no painel do seu provedor de hospedagem

