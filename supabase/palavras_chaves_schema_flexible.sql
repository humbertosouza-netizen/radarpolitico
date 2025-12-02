-- Schema FLEXÍVEL para tabela palavras_chaves
-- Este script tenta diferentes nomes de colunas comuns
-- Execute o script check_palavras_chaves_structure.sql primeiro para ver a estrutura real

-- IMPORTANTE: Substitua 'COLUNA_USUARIO' pelo nome real da coluna que referencia o usuário
-- Nomes comuns: user_id, id_usuario, usuario_id, id_user, created_by, owner_id

-- ============================================
-- PASSO 1: Verifique a estrutura da tabela
-- ============================================
-- Execute primeiro: check_palavras_chaves_structure.sql
-- Identifique qual é o nome da coluna que referencia o usuário

-- ============================================
-- PASSO 2: Ajuste o nome da coluna abaixo
-- ============================================
-- Substitua 'COLUNA_USUARIO' pelo nome real (ex: id_usuario, usuario_id, etc.)

-- Exemplo se a coluna se chama 'id_usuario':
-- USING (auth.uid() = id_usuario);

-- Habilitar RLS na tabela palavras_chaves (se ainda não estiver habilitado)
ALTER TABLE IF EXISTS public.palavras_chaves ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houverem
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_select_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_insert_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_update_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_delete_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_admins_all" ON public.palavras_chaves;

-- ============================================
-- AJUSTE AQUI: Substitua 'COLUNA_USUARIO' pelo nome real
-- ============================================
-- Política: Usuários podem ver suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_select_own"
  ON public.palavras_chaves
  FOR SELECT
  USING (auth.uid() = COLUNA_USUARIO);

-- Política: Usuários podem inserir suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_insert_own"
  ON public.palavras_chaves
  FOR INSERT
  WITH CHECK (auth.uid() = COLUNA_USUARIO);

-- Política: Usuários podem atualizar suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_update_own"
  ON public.palavras_chaves
  FOR UPDATE
  USING (auth.uid() = COLUNA_USUARIO)
  WITH CHECK (auth.uid() = COLUNA_USUARIO);

-- Política: Usuários podem deletar suas próprias palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_delete_own"
  ON public.palavras_chaves
  FOR DELETE
  USING (auth.uid() = COLUNA_USUARIO);

-- Política: Admins podem ver todas as palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_admins_all"
  ON public.palavras_chaves
  FOR ALL
  USING (public.agentevigilante_is_admin(auth.uid()));

-- Função para atualizar updated_at automaticamente (se a coluna existir)
CREATE OR REPLACE FUNCTION public.agentevigilante_handle_palavras_chaves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Ajuste o nome da coluna se necessário (updated_at, data_atualizacao, etc.)
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS agentevigilante_on_palavras_chaves_updated ON public.palavras_chaves;

-- Trigger para atualizar updated_at (se a coluna existir)
CREATE TRIGGER agentevigilante_on_palavras_chaves_updated
  BEFORE UPDATE ON public.palavras_chaves
  FOR EACH ROW 
  WHEN (NEW.updated_at IS DISTINCT FROM OLD.updated_at OR NEW.updated_at IS NULL)
  EXECUTE FUNCTION public.agentevigilante_handle_palavras_chaves_updated_at();

