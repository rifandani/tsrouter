import { Link } from '#app/components/ui/link';
import { useColorMode } from '#app/hooks/use-color-mode.hook';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import { useUserStore } from '#auth/hooks/use-user-store.hook';
import type { QueryClient } from '@tanstack/react-query';
import {
  ErrorComponent,
  Outlet,
  createRootRouteWithContext,
  useRouter,
  type NavigateOptions,
  type RegisteredRouter,
  type ToPathOption,
} from '@tanstack/react-router';
import { RouterProvider as RACRouterProvider } from 'react-aria-components';

declare module 'react-aria-components' {
  interface RouterConfig {
    href: ToPathOption<RegisteredRouter, '/', '/'> | ({} & string);
    routerOptions: Omit<NavigateOptions, 'to' | 'from'>;
  }
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  // RAC such as Link, Menu, Tabs, Table, and many others support rendering elements as links that perform navigation when the user interacts with them.
  // It needs to be wrapped by RAC RouterProvider component.
  component: () => {
    const router = useRouter();

    return (
      <RACRouterProvider
        navigate={(to, options) =>
          router.navigate({
            ...options,
            to: to as ToPathOption<RegisteredRouter, '/', '/'>,
          })
        }
        useHref={(to) => router.buildLocation({ to }).href}
      >
        <Outlet />
      </RACRouterProvider>
    );
  },
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    const userStore = useUserStore();
    const [t] = useI18n();
    useColorMode({});

    return (
      <div className="font-mono flex min-h-screen flex-col items-center justify-center opacity-80 bg-[radial-gradient(hsl(var(--primary))_0.5px_,transparent_0.5px),radial-gradient(hsl(var(--primary))_0.5px_,hsl(var(--background))_0.5px)] bg-[0_0_,10px_10px] bg-[length:20px_20px]">
        <h1 className="text-8xl font-bold tracking-wider text-primary">404</h1>
        <h2 className="my-3 text-2xl font-semibold">{t('notFound')}</h2>
        <p className="text-md">{t('gone')}</p>

        <Link
          href={userStore.user ? '/' : '/login'}
          className="mt-10 duration-300 transition hover:skew-x-12"
        >
          {t('backTo', { target: userStore.user ? 'home' : 'login' })}
        </Link>
      </div>
    );
  },
});
