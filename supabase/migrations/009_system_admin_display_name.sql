--
-- 009_system_admin_display_name.sql
-- Replace the generic auth placeholder name for system administrators.
--

UPDATE public.users u
SET full_name = 'System Admin'
FROM public.user_roles ur
JOIN public.roles r ON r.id = ur.role_id
WHERE ur.user_id = u.id
  AND r.name = 'system_admin'
  AND (u.full_name IS NULL OR u.full_name = '' OR u.full_name = 'New User');
