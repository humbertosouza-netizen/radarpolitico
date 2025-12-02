-- Schema para tabela investigador_mencoes
-- Execute este SQL no Supabase SQL Editor para configurar RLS

-- Habilitar RLS na tabela investigador_mencoes (se ainda não estiver habilitado)
ALTER TABLE IF EXISTS public.investigador_mencoes ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houverem
DROP POLICY IF EXISTS "agentevigilante_mencoes_select_all" ON public.investigador_mencoes;
DROP POLICY IF EXISTS "agentevigilante_mencoes_insert_all" ON public.investigador_mencoes;
DROP POLICY IF EXISTS "agentevigilante_mencoes_update_all" ON public.investigador_mencoes;
DROP POLICY IF EXISTS "agentevigilante_mencoes_delete_all" ON public.investigador_mencoes;

-- NOTA: Ajuste as políticas conforme necessário
-- Se a tabela tiver coluna user_id, use políticas por usuário
-- Se não tiver, use políticas para usuários autenticados

-- Política: Usuários autenticados podem ver todas as menções
CREATE POLICY "agentevigilante_mencoes_select_all"
  ON public.investigador_mencoes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem inserir menções
CREATE POLICY "agentevigilante_mencoes_insert_all"
  ON public.investigador_mencoes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem atualizar menções
CREATE POLICY "agentevigilante_mencoes_update_all"
  ON public.investigador_mencoes
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem deletar menções
CREATE POLICY "agentevigilante_mencoes_delete_all"
  ON public.investigador_mencoes
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- OPCIONAL: Se a tabela tiver coluna user_id
-- ============================================
-- Descomente e ajuste se necessário:
/*
DROP POLICY IF EXISTS "agentevigilante_mencoes_select_all" ON public.investigador_mencoes;
DROP POLICY IF EXISTS "agentevigilante_mencoes_insert_all" ON public.investigador_mencoes;
DROP POLICY IF EXISTS "agentevigilante_mencoes_update_all" ON public.investigador_mencoes;
DROP POLICY IF EXISTS "agentevigilante_mencoes_delete_all" ON public.investigador_mencoes;

CREATE POLICY "agentevigilante_mencoes_select_own"
  ON public.investigador_mencoes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "agentevigilante_mencoes_insert_own"
  ON public.investigador_mencoes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agentevigilante_mencoes_update_own"
  ON public.investigador_mencoes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "agentevigilante_mencoes_delete_own"
  ON public.investigador_mencoes FOR DELETE
  USING (auth.uid() = user_id);
*/

