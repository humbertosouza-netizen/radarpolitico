# Integração da Timeline com investigador_mencoes

## ✅ O que foi implementado

1. **Schema SQL com RLS** (`supabase/investigador_mencoes_schema.sql`)
   - Políticas de segurança (RLS) configuradas
   - Usuários autenticados podem ver todas as menções
   - Opção para políticas por usuário (se houver coluna user_id)

2. **Tipos TypeScript** (`types/database.types.ts`)
   - Interface flexível para a tabela `investigador_mencoes`
   - Suporta diferentes estruturas de colunas

3. **Componente Conectado** (`app/dashboard/timeline/timeline-client.tsx`)
   - ✅ Carregar menções do Supabase
   - ✅ Exibir resumo do registro do problema
   - ✅ Loading states
   - ✅ Error handling
   - ✅ Notificações de erro
   - ✅ Conversão automática de dados para formato de timeline

## 📋 Estrutura Esperada da Tabela

A tabela `investigador_mencoes` pode ter diferentes estruturas. O código tenta detectar automaticamente:

**Colunas principais esperadas:**
- `id` (number ou string) - Identificador único
- `resumo` (text) - **Resumo do registro do problema** (principal)
- `descricao` (text) - Descrição alternativa
- `texto` (text) - Texto alternativo
- `created_at` (timestamp) - Data de criação
- `data` (timestamp) - Data alternativa
- `prioridade` (text) - 'alta', 'media', 'baixa' (para determinar severidade)
- `tipo` (text) - Tipo de menção
- `palavras_chave` (array ou string) - Palavras-chave relacionadas
- `grupo` (text) - Grupo/fonte da menção
- `fonte` (text) - Fonte alternativa
- `origem` (text) - Origem alternativa

## 🔄 Mapeamento de Dados

O código mapeia automaticamente os dados da tabela para o formato da timeline:

```typescript
// Resumo (prioridade: resumo > descricao > texto)
const resumo = mencao.resumo || mencao.descricao || mencao.texto || 'Menção detectada'

// Severidade (baseada em prioridade)
const severity = mencao.prioridade === 'alta' ? 'high' :
                 mencao.prioridade === 'media' ? 'medium' : 'low'

// Grupo/Fonte
const group = mencao.grupo || mencao.fonte || mencao.origem || 'Sistema'
```

## 🚀 Como Configurar

### 1. Verificar a Estrutura da Tabela

Execute no Supabase SQL Editor:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'investigador_mencoes'
ORDER BY ordinal_position;
```

### 2. Ajustar o Código (se necessário)

Se sua tabela usar nomes de colunas diferentes, ajuste em `timeline-client.tsx`:

```typescript
// Linha ~50-70: Ajuste o mapeamento conforme necessário
const resumo = mencao.sua_coluna_resumo || mencao.outra_coluna || 'Menção detectada'
```

### 3. Execute o Schema SQL

Execute `supabase/investigador_mencoes_schema.sql` no Supabase SQL Editor para configurar RLS.

## 🎨 Interface

A timeline exibe:
- **Hora** - Extraída de `created_at` ou `data`
- **Resumo** - Texto principal do problema
- **Severidade** - Baseada em `prioridade` (alta=high, media=medium, baixa=low)
- **Grupo/Fonte** - Origem da menção
- **Palavras-chave** - Tags relacionadas (se disponível)

## ⚠️ Troubleshooting

### Erro: "relation investigador_mencoes does not exist"
- A tabela não existe. Crie-a primeiro no Supabase.

### Erro: "column X does not exist"
- Verifique os nomes das colunas reais
- Ajuste o mapeamento em `timeline-client.tsx`

### Dados não aparecem
- Verifique se há dados na tabela
- Verifique as políticas RLS
- Verifique o console do navegador para erros

### Resumo não aparece
- Verifique se a coluna `resumo` existe
- Ajuste o código para usar outra coluna (ex: `descricao`, `texto`)

## 📝 Personalização

### Adicionar mais campos

Para exibir mais informações na timeline, ajuste o JSX em `timeline-client.tsx`:

```typescript
// Adicionar campo adicional
<p className="text-[#9CAABA] text-sm mb-2">
  Autor: <span className="text-[#E8F0F2]">{event.raw.autor || 'Sistema'}</span>
</p>
```

### Filtrar por data

Para filtrar menções por período:

```typescript
const { data, error } = await supabase
  .from('investigador_mencoes')
  .select('*')
  .gte('created_at', '2024-01-01') // A partir de
  .lte('created_at', '2024-12-31') // Até
  .order('created_at', { ascending: false })
```

### Paginação

Para adicionar paginação:

```typescript
const [page, setPage] = useState(0)
const pageSize = 20

const { data, error } = await supabase
  .from('investigador_mencoes')
  .select('*')
  .order('created_at', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1)
```

