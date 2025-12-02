# Como Corrigir o Erro: "column user_id does not exist"

## 🔍 Passo 1: Verificar a Estrutura da Tabela

Execute este SQL no Supabase SQL Editor para ver as colunas reais:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'palavras_chaves'
ORDER BY ordinal_position;
```

## 🔧 Passo 2: Identificar o Nome da Coluna de Usuário

Procure por uma coluna que seja:
- Tipo `uuid`
- Que referencie o usuário (pode ter nomes como: `id_usuario`, `usuario_id`, `user_id`, `id_user`, `created_by`, `owner_id`)

## ✅ Solução Rápida: Script Automático

Execute o arquivo `supabase/palavras_chaves_schema_auto.sql` que tenta detectar automaticamente o nome da coluna.

## 🔨 Solução Manual: Ajustar o Código

Se o script automático não funcionar, você precisa ajustar o código:

### Opção A: Renomear a coluna no banco (Recomendado)

Se sua coluna se chama `id_usuario` (ou outro nome), renomeie para `user_id`:

```sql
ALTER TABLE public.palavras_chaves 
RENAME COLUMN id_usuario TO user_id;

-- Ou se for outro nome:
-- ALTER TABLE public.palavras_chaves RENAME COLUMN nome_atual TO user_id;
```

### Opção B: Ajustar o código TypeScript

Se preferir manter o nome original da coluna, ajuste estes arquivos:

1. **`types/database.types.ts`**: Altere `user_id` para o nome real
2. **`app/dashboard/keywords/keywords-client.tsx`**: Altere todas as referências de `user_id` para o nome real
3. **`supabase/palavras_chaves_schema.sql`**: Altere `user_id` para o nome real nas políticas RLS

### Exemplo se a coluna se chama `id_usuario`:

**types/database.types.ts:**
```typescript
palavras_chaves: {
  Row: {
    id: string
    palavra: string
    categoria: string
    ativo: boolean
    id_usuario: string  // ← Alterado
    created_at: string
    updated_at: string
  }
  // ...
}
```

**keywords-client.tsx:**
```typescript
.eq('id_usuario', user.id)  // ← Alterado
// ...
.insert({
  palavra: newKeyword.trim(),
  categoria: selectedCategory,
  ativo: true,
  id_usuario: user.id,  // ← Alterado
})
```

**palavras_chaves_schema.sql:**
```sql
USING (auth.uid() = id_usuario);  // ← Alterado
```

## 📋 Nomes Comuns de Colunas

Se sua tabela usa um destes nomes, ajuste conforme:

- `id_usuario` → Use `id_usuario` no código
- `usuario_id` → Use `usuario_id` no código  
- `user_id` → Já está correto
- `id_user` → Use `id_user` no código
- `created_by` → Use `created_by` no código
- `owner_id` → Use `owner_id` no código

## ⚠️ Se a Coluna Não Existir

Se não houver nenhuma coluna de usuário, você precisa criar:

```sql
ALTER TABLE public.palavras_chaves 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Atualizar registros existentes (ajuste conforme necessário)
UPDATE public.palavras_chaves 
SET user_id = (SELECT id FROM auth.users LIMIT 1)  -- Ajuste conforme sua lógica
WHERE user_id IS NULL;
```

Depois execute o schema SQL original.

