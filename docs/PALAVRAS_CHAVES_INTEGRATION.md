# Integração da Tabela palavras_chaves

## ✅ O que foi implementado

1. **Schema SQL com RLS** (`supabase/palavras_chaves_schema.sql`)
   - Políticas de segurança (RLS) configuradas
   - Usuários podem gerenciar apenas suas próprias palavras-chave
   - Admins têm acesso completo
   - Trigger para atualizar `updated_at` automaticamente

2. **Tipos TypeScript** (`types/database.types.ts`)
   - Interface completa para a tabela `palavras_chaves`
   - Tipos para Insert, Update e Row

3. **Componente Conectado** (`app/dashboard/keywords/keywords-client.tsx`)
   - ✅ Carregar palavras-chave do Supabase
   - ✅ Adicionar nova palavra-chave
   - ✅ Ativar/Desativar palavra-chave
   - ✅ Remover palavra-chave
   - ✅ Loading states
   - ✅ Error handling
   - ✅ Notificações de sucesso/erro

## 📋 Estrutura Esperada da Tabela

A tabela `palavras_chaves` deve ter a seguinte estrutura:

```sql
CREATE TABLE IF NOT EXISTS public.palavras_chaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palavra TEXT NOT NULL,
  categoria TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## 🚀 Como Configurar

### 1. Execute o Schema SQL

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Cole o conteúdo de `supabase/palavras_chaves_schema.sql`
4. Execute o script

Este script irá:
- Habilitar RLS na tabela
- Criar políticas de segurança
- Criar trigger para `updated_at`

### 2. Verifique a Estrutura da Tabela

Se sua tabela tiver nomes de colunas diferentes, você pode precisar ajustar:

**Nomes esperados:**
- `id` (UUID)
- `palavra` (TEXT) - a palavra-chave
- `categoria` (TEXT) - categoria (ex: "Política", "Economia")
- `ativo` (BOOLEAN) - se está ativa
- `user_id` (UUID) - referência ao usuário
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Se sua tabela usar nomes diferentes**, você pode:
1. Renomear as colunas no banco, OU
2. Ajustar o código em `keywords-client.tsx` para usar os nomes corretos

## 🔒 Segurança (RLS)

As políticas criadas garantem que:
- ✅ Cada usuário vê apenas suas próprias palavras-chave
- ✅ Cada usuário pode criar, editar e deletar apenas suas palavras-chave
- ✅ Admins podem ver e gerenciar todas as palavras-chave
- ✅ Todas as operações requerem autenticação

## 🧪 Testando

1. Faça login no sistema
2. Acesse `/dashboard/keywords`
3. Adicione uma nova palavra-chave
4. Teste ativar/desativar
5. Teste remover uma palavra-chave

## ⚠️ Troubleshooting

### Erro: "relation palavras_chaves does not exist"
- A tabela não existe. Crie-a primeiro no Supabase.

### Erro: "new row violates row-level security policy"
- Execute o schema SQL para criar as políticas RLS.

### Erro: "column X does not exist"
- Verifique se os nomes das colunas correspondem ao esperado.
- Ajuste o código ou renomeie as colunas no banco.

### Dados não aparecem
- Verifique se há dados na tabela
- Verifique se o `user_id` corresponde ao usuário logado
- Verifique as políticas RLS no Supabase Dashboard

## 📝 Próximos Passos

- [ ] Adicionar filtros por categoria
- [ ] Adicionar busca de palavras-chave
- [ ] Adicionar paginação para muitas palavras-chave
- [ ] Adicionar exportação de palavras-chave
- [ ] Adicionar importação em lote

