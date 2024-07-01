import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import { useMount } from '#app/hooks/use-mount.hook';
import { useUserStore } from '#auth/hooks/use-user-store.hook';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { P, match } from 'ts-pattern';

/**
 * Hooks to check the authentication of your user, wheter they're logged in or not
 *
 * @example
 *
 * ```tsx
 * useAuthChecker()
 * ```
 */
export function useAuthChecker() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();

  useMount(() => {
    match([!!user, location.pathname.includes('login')])
      .with([false, true], () => {})
      .with([false, P.any], () => {
        navigate({ to: '/login' });
        toast.error(t('unauthorized'));
      })
      .with([true, true], () => {
        navigate({ to: '/' });
        toast.info(t('authorized'));
      })
      .otherwise(() => {});
  });
}
