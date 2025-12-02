-- Schema para tabela palavras_chaves (estrutura real)
-- Estrutura da tabela:
-- - id (bigint)
-- - termo (text)
-- - categoria (text)
-- - created_at (timestamp)

-- Habilitar RLS na tabela palavras_chaves
ALTER TABLE IF EXISTS public.palavras_chaves ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houverem
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_select_all" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_insert_all" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_update_all" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_delete_all" ON public.palavras_chaves;

-- NOTA: Como a tabela não possui coluna user_id, 
-- todas as políticas permitem acesso a usuários autenticados.
-- Se precisar de segurança por usuário, adicione a coluna user_id primeiro.

-- Política: Usuários autenticados podem ver todas as palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_select_all"
  ON public.palavras_chaves
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem inserir palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_insert_all"
  ON public.palavras_chaves
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem atualizar palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_update_all"
  ON public.palavras_chaves
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem deletar palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_delete_all"
  ON public.palavras_chaves
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- OPCIONAL: Se quiser adicionar segurança por usuário
-- ============================================
-- Execute este SQL para adicionar a coluna user_id:
/*
ALTER TABLE public.palavras_chaves 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Atualizar registros existentes (ajuste conforme necessário)
UPDATE public.palavras_chaves 
SET user_id = auth.uid() 
WHERE user_id IS NULL AND auth.uid() IS NOT NULL;

-- Depois, recrie as políticas usando user_id:
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_select_all" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_insert_all" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_update_all" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_delete_all" ON public.palavras_chaves;

CREATE POLICY "agentevigilante_palavras_chaves_select_own"
  ON public.palavras_chaves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "agentevigilante_palavras_chaves_insert_own"
  ON public.palavras_chaves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agentevigilante_palavras_chaves_update_own"
  ON public.palavras_chaves FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agentevigilante_palavras_chaves_delete_own"
  ON public.palavras_chaves FOR DELETE
  USING (auth.uid() = user_id);
*/

