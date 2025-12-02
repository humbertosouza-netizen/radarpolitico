-- Schema AUTOMÁTICO para tabela palavras_chaves
-- Este script detecta automaticamente o nome da coluna de usuário
-- Execute este script no Supabase SQL Editor

-- Habilitar RLS na tabela palavras_chaves
ALTER TABLE IF EXISTS public.palavras_chaves ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houverem
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_select_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_insert_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_update_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_delete_own" ON public.palavras_chaves;
DROP POLICY IF EXISTS "agentevigilante_palavras_chaves_admins_all" ON public.palavras_chaves;

-- Função para detectar o nome da coluna de usuário
DO $$
DECLARE
  user_col_name TEXT;
BEGIN
  -- Tentar encontrar a coluna que referencia o usuário
  SELECT column_name INTO user_col_name
  FROM information_schema.columns
  WHERE table_schema = 'public' 
    AND table_name = 'palavras_chaves'
    AND (
      column_name LIKE '%user%' OR 
      column_name LIKE '%usuario%' OR 
      column_name LIKE '%owner%' OR
      column_name LIKE '%created_by%'
    )
  LIMIT 1;

  -- Se não encontrou, tentar outras opções comuns
  IF user_col_name IS NULL THEN
    SELECT column_name INTO user_col_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'palavras_chaves'
      AND data_type = 'uuid'
      AND column_name != 'id'
    LIMIT 1;
  END IF;

  -- Se ainda não encontrou, usar 'user_id' como padrão e criar a coluna se necessário
  IF user_col_name IS NULL THEN
    -- Tentar adicionar a coluna user_id se não existir
    BEGIN
      ALTER TABLE public.palavras_chaves 
      ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
      
      -- Atualizar registros existentes com o usuário atual (se houver sessão)
      -- Nota: Isso só funciona se executado por um usuário autenticado
      UPDATE public.palavras_chaves 
      SET user_id = auth.uid() 
      WHERE user_id IS NULL AND auth.uid() IS NOT NULL;
      
      user_col_name := 'user_id';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Não foi possível criar/adicionar coluna user_id. Verifique a estrutura da tabela.';
    END;
  END IF;

  -- Criar políticas usando o nome da coluna detectado
  IF user_col_name IS NOT NULL THEN
    EXECUTE format('
      CREATE POLICY "agentevigilante_palavras_chaves_select_own"
        ON public.palavras_chaves
        FOR SELECT
        USING (auth.uid() = %I);
    ', user_col_name);

    EXECUTE format('
      CREATE POLICY "agentevigilante_palavras_chaves_insert_own"
        ON public.palavras_chaves
        FOR INSERT
        WITH CHECK (auth.uid() = %I);
    ', user_col_name);

    EXECUTE format('
      CREATE POLICY "agentevigilante_palavras_chaves_update_own"
        ON public.palavras_chaves
        FOR UPDATE
        USING (auth.uid() = %I)
        WITH CHECK (auth.uid() = %I);
    ', user_col_name, user_col_name);

    EXECUTE format('
      CREATE POLICY "agentevigilante_palavras_chaves_delete_own"
        ON public.palavras_chaves
        FOR DELETE
        USING (auth.uid() = %I);
    ', user_col_name);

    RAISE NOTICE 'Políticas criadas usando a coluna: %', user_col_name;
  ELSE
    RAISE EXCEPTION 'Não foi possível detectar a coluna de usuário. Execute check_palavras_chaves_structure.sql para ver a estrutura.';
  END IF;
END $$;

-- Política: Admins podem ver todas as palavras-chave
CREATE POLICY "agentevigilante_palavras_chaves_admins_all"
  ON public.palavras_chaves
  FOR ALL
  USING (public.agentevigilante_is_admin(auth.uid()));

-- Função para atualizar updated_at automaticamente (se a coluna existir)
CREATE OR REPLACE FUNCTION public.agentevigilante_handle_palavras_chaves_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se a coluna updated_at existe antes de atualizar
  IF TG_TABLE_NAME = 'palavras_chaves' THEN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS agentevigilante_on_palavras_chaves_updated ON public.palavras_chaves;

-- Criar trigger apenas se a coluna updated_at existir
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'palavras_chaves' 
      AND column_name = 'updated_at'
  ) THEN
    CREATE TRIGGER agentevigilante_on_palavras_chaves_updated
      BEFORE UPDATE ON public.palavras_chaves
      FOR EACH ROW 
      EXECUTE FUNCTION public.agentevigilante_handle_palavras_chaves_updated_at();
  END IF;
END $$;

