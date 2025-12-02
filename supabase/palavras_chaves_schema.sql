-- Schema para tabela palavras_chaves
-- Execute este SQL no Supabase SQL Editor se a tabela ainda não tiver RLS configurado

-- Habilitar RLS na tabela palavras_chaves (se ainda não estiver habilitado)
ALTER TABLE IF EXISTS public.palavras_chaves ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houverem
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_select_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_insert_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_update_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_delete_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_admins_all" ON public.palavras_chaves;

-- Política: Usuários podem ver suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_select_own"
  ON public.palavras_chaves
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_insert_own"
  ON public.palavras_chaves
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_update_own"
  ON public.palavras_chaves
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_delete_own"
  ON public.palavras_chaves
  FOR DELETE
  USING (auth.uid() = user_id);

-- Política: Admins podem ver todas as palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_admins_all"
  ON public.palavras_chaves
  FOR ALL
  USING (public.agentevigilante_is_admin(auth.uid()));

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.agentevigilante_handle_palavras_chaves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS agentevigilante_on_palavras_chaves_updated ON public.palavras_chaves;

-- Trigger para atualizar updated_at
CREATE TRIGGER agentevigilante_on_palavras_chaves_updated
  BEFORE UPDATE ON public.palavras_chaves
  FOR EACH ROW EXECUTE FUNCTION public.agentevigilante_handle_palavras_chaves_updated_at();

