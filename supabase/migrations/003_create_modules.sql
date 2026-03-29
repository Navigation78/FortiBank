-- 
-- 003_create_modules.sql
-- Training modules, content, and user progress
-- 

CREATE TYPE public.content_type AS ENUM (
  'video',
  'pdf',
  'image',
  'text',
  'slides'
);

CREATE TYPE public.module_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- Training modules
CREATE TABLE public.modules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  thumbnail_url TEXT,
  status        public.module_status NOT NULL DEFAULT 'draft',
  order_index   INT  NOT NULL DEFAULT 0,        -- display ordering
  duration_mins INT,                            -- estimated completion time
  created_by    UUID REFERENCES public.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Which roles can access which modules
CREATE TABLE public.module_role_access (
  id        SERIAL PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  role_id   INT  NOT NULL REFERENCES public.roles(id)   ON DELETE CASCADE,
  UNIQUE(module_id, role_id)
);

-- Individual content blocks within a module
CREATE TABLE public.module_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id     UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content_type  public.content_type NOT NULL,
  content_url   TEXT,                           -- Supabase Storage URL for files
  content_body  TEXT,                           -- inline text/HTML content
  order_index   INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User progress per module
CREATE TYPE public.progress_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);

CREATE TABLE public.user_module_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id)   ON DELETE CASCADE,
  module_id       UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  status          public.progress_status NOT NULL DEFAULT 'not_started',
  progress_pct    INT NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE TRIGGER user_module_progress_updated_at
  BEFORE UPDATE ON public.user_module_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

  