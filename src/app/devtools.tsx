import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { router } from './providers/router/client';

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    );

export function Devtools(
  props: React.ComponentProps<typeof ReactQueryDevtools> = {
    buttonPosition: 'bottom-right',
    initialIsOpen: false,
  },
) {
  const [showRqDevtools, setShowRqDevtools] = React.useState(false);

  React.useEffect(() => {
    window.toggleRqDevtools = () => setShowRqDevtools((prev) => !prev);
  }, []);

  return (
    <>
      <React.Suspense>
        <TanStackRouterDevtools router={router} />
      </React.Suspense>

      {/* this will only be rendered in development */}
      <ReactQueryDevtools {...props} />

      {showRqDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </>
  );
}
