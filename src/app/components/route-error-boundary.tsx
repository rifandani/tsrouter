import { Button } from '#app/components/ui/button';

export function RouteErrorBoundary() {
  // the response json is automatically parsed to `error.data`, we also have access to the status
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-3">Something went wrong</h1>

      <Button
        type="button"
        onPress={() => {
          window.location.assign(window.location.href);
        }}
      >
        Reload Page
      </Button>

      {/* <pre>{JSON.stringify(error, null, 2)}</pre> */}
    </main>
  );
}
