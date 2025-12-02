# ⚡ Solução Rápida: Erro "column user_id does not exist"

## 🔍 Passo 1: Descobrir o Nome Real da Coluna

Execute no Supabase SQL Editor:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'palavras_chaves'
ORDER BY ordinal_position;
```

Procure por uma coluna do tipo `uuid` que não seja `id`. Anote o nome (ex: `id_usuario`, `usuario_id`, etc.)

## ✅ Solução A: Usar Script Automático (Recomendado)

Execute o arquivo `supabase/palavras_chaves_schema_auto.sql` no Supabase SQL Editor.

Este script tenta detectar automaticamente o nome da coluna.

## ✅ Solução B: Ajustar o Código Manualmente

### 1. Ajustar o código TypeScript

Abra `app/dashboard/keywords/keywords-client.tsx` e na linha 18, altere:

```typescript
const USER_ID_COLUMN = 'user_id' // ← Altere para o nome real (ex: 'id_usuario')
```

### 2. Ajustar o Schema SQL

Abra `supabase/palavras_chaves_schema.sql` e substitua todas as ocorrências de `user_id` pelo nome real da coluna.

### 3. Executar o Schema SQL

Execute o arquivo ajustado no Supabase SQL Editor.

## ✅ Solução C: Renomear a Coluna no Banco (Mais Simples)

Se preferir, renomeie a coluna no banco para `user_id`:

```sql
ALTER TABLE public.palavras_chaves 
RENAME COLUMN nome_atual TO user_id;
```

Substitua `nome_atual` pelo nome real da coluna.

Depois execute `supabase/palavras_chaves_schema.sql` normalmente.

## 📝 Exemplo

Se sua coluna se chama `id_usuario`:

1. **No código** (`keywords-client.tsx` linha 18):
   ```typescript
   const USER_ID_COLUMN = 'id_usuario'
   ```

2. **No schema SQL** (`palavras_chaves_schema.sql`):
   ```sql
   USING (auth.uid() = id_usuario);
   ```

3. Execute o schema SQL ajustado.

---

**Qual solução usar?**
- Se não souber o nome: Use **Solução A** (script automático)
- Se souber o nome e quiser ajustar: Use **Solução B**
- Se quiser padronizar: Use **Solução C** (renomear)

