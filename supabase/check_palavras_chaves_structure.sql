-- Script para verificar a estrutura da tabela palavras_chaves
-- Execute este script primeiro para ver quais colunas existem

-- Ver todas as colunas da tabela palavras_chaves
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'palavras_chaves'
ORDER BY ordinal_position;

