import { Navbar } from '#app/components/navbar/navbar';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '#app/utils/checker.util';
import { HomeClock } from '#home/components/home-clock';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/')({
  beforeLoad: ({ location }) => {
    const authed = checkAuthUser();

    if (!authed) {
      // redirect unauthorized user to login
      toast.error('Unauthorized');
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  component: Component,
});

function Component() {
  const [t] = useI18n();
  const [parentRef] = useAutoAnimate();

  return (
    <>
      <Navbar />

      <div
        ref={parentRef}
        className="container mx-auto flex flex-col items-center py-24 duration-300"
      >
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>

        <HomeClock />
      </div>
    </>
  );
}
