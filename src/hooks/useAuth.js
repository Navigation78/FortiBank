
// Clean hook to consume AuthContext.
// Import this in components instead of useAuthContext directly.

import { useAuthContext } from '@/contexts/AuthContext'

export function useAuth() {
  return useAuthContext()
}

export default useAuth