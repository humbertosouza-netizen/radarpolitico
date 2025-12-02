-- Criar enum para roles (se não existir)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'usuario');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'usuario' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar se o usuário é admin (bypassa RLS)
CREATE OR REPLACE FUNCTION public.agentevigilante_is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Remover políticas existentes se houverem
DROP POLICY IF EXISTS "agentevigilante_users_view_own" ON public.users;
DROP POLICY IF EXISTS "agentevigilante_users_update_own" ON public.users;
DROP POLICY IF EXISTS "agentevigilante_admins_view_all" ON public.users;
DROP POLICY IF EXISTS "agentevigilante_admins_update_all" ON public.users;
DROP POLICY IF EXISTS "agentevigilante_allow_insert" ON public.users;

-- Política: Permitir inserção pelo trigger e usuários criarem seus próprios registros
CREATE POLICY "agentevigilante_allow_insert"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id OR true);

-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "agentevigilante_users_view_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "agentevigilante_users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: Admins podem ver todos os usuários
CREATE POLICY "agentevigilante_admins_view_all"
  ON public.users
  FOR SELECT
  USING (public.agentevigilante_is_admin(auth.uid()));

-- Política: Admins podem atualizar todos os usuários
CREATE POLICY "agentevigilante_admins_update_all"
  ON public.users
  FOR UPDATE
  USING (public.agentevigilante_is_admin(auth.uid()));

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.agentevigilante_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'nome', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'usuario')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para garantir que o usuário existe na tabela (pode ser chamada pelo cliente)
CREATE OR REPLACE FUNCTION public.agentevigilante_ensure_user()
RETURNS TABLE(id UUID, email TEXT, full_name TEXT, role user_role, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ) AS $$
DECLARE
  user_id UUID;
  user_email TEXT;
  user_full_name TEXT;
  user_role user_role;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  -- Verificar se o usuário já existe
  SELECT u.id, u.email, u.full_name, u.role INTO user_id, user_email, user_full_name, user_role
  FROM public.users u
  WHERE u.id = user_id;

  -- Se não existe, criar
  IF user_id IS NULL THEN
    SELECT au.id, au.email INTO user_id, user_email
    FROM auth.users au
    WHERE au.id = auth.uid();

    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
      user_id,
      user_email,
      NULL,
      'usuario'
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING users.id, users.email, users.full_name, users.role, users.created_at, users.updated_at
    INTO user_id, user_email, user_full_name, user_role;
  END IF;

  -- Retornar os dados do usuário
  RETURN QUERY
  SELECT u.id, u.email, u.full_name, u.role, u.created_at, u.updated_at
  FROM public.users u
  WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS agentevigilante_on_auth_user_created ON auth.users;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER agentevigilante_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.agentevigilante_handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.agentevigilante_handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS agentevigilante_on_users_updated ON public.users;

-- Trigger para atualizar updated_at
CREATE TRIGGER agentevigilante_on_users_updated
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.agentevigilante_handle_updated_at();

