-- Script para verificar a estrutura da tabela investigador_mencoes
-- Execute este script primeiro para ver quais colunas existem

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'investigador_mencoes'
ORDER BY ordinal_position;

