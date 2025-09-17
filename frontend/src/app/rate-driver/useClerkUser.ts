import { useUser } from '@clerk/nextjs';

export function useClerkUserId() {
  const { user } = useUser();
  return user?.id || '';
}
