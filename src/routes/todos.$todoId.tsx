import { Navbar } from '#app/components/navbar/navbar';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from '#app/components/ui/breadcrumbs';
import { Button } from '#app/components/ui/button';
import { Input } from '#app/components/ui/input';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '#app/schemas/api.schema';
import { checkAuthUser } from '#app/utils/checker.util';
import { useUserStore } from '#auth/hooks/use-user-store.hook';
import {
  todoKeys,
  todoRepositories,
  todoUpdateRequestSchema,
  type TodoUpdateRequestSchema,
} from '#todo/apis/todo.api';
import { todosDefaults } from '#todo/constants/todos.constant';
import { useTodoDetail } from '#todo/hooks/use-todo-detail.hook';
import { useTodoUpdate } from '#todo/hooks/use-todo-update.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { HTTPError } from 'ky';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { match } from 'ts-pattern';

export const Route = createFileRoute('/todos/$todoId')({
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
  loader: async ({ params, context }) => {
    const todoId = Number(params.todoId);
    try {
      const todoDetail = await context.queryClient.ensureQueryData({
        queryKey: todoKeys.detail(todoId),
        queryFn: () => todoRepositories.detail(todoId),
        staleTime: 1_000 * 60 * 1, // 1 min
      });

      return todoDetail;
    } catch (error) {
      if (error instanceof HTTPError) {
        const response = (await error.response.json()) as ErrorResponseSchema;

        throw notFound({ data: response });
      }
    }
  },
  component: Component,
  notFoundComponent: () => {
    const [t] = useI18n();

    return (
      <Template todoId="???">
        <div className="font-mono flex min-h- flex-col items-center justify-center opacity-80 bg-[radial-gradient(hsl(var(--primary))_0.5px_,transparent_0.5px),radial-gradient(hsl(var(--primary))_0.5px_,hsl(var(--background))_0.5px)] bg-[0_0_,10px_10px] bg-[length:20px_20px]">
          <h1 className="text-8xl font-bold tracking-wider text-primary">
            404
          </h1>
          <h2 className="my-3 text-2xl font-semibold">{t('notFound')}</h2>
        </div>
      </Template>
    );
  },
});

function Component() {
  const [t] = useI18n();
  const { todoId } = Route.useParams();
  const navigate = Route.useNavigate();
  const { user } = useUserStore();
  // already populated in loader
  const todoDetailQuery = useTodoDetail(Number(todoId));

  const form = useForm<TodoUpdateRequestSchema>({
    resolver: zodResolver(todoUpdateRequestSchema),
    defaultValues: {
      id: todoDetailQuery.data?.id,
      completed: todoDetailQuery.data?.completed,
      todo: todoDetailQuery.data?.todo,
    },
  });

  const todoUpdateMutation = useTodoUpdate(undefined, {
    onSuccess: async () => {
      await navigate({
        to: '/todos',
        search: {
          limit: todosDefaults.limit,
          skip: todosDefaults.skip,
        },
      });
    },
  });

  return (
    <Template todoId={todoId}>
      <form
        className="w-full flex items-center gap-x-2"
        onSubmit={form.handleSubmit((values) => {
          // prohibit unauthorized user submit (e.g. when clicking Enter in input)
          if (todoDetailQuery.data?.userId !== user?.id) return;

          todoUpdateMutation.mutate(values);
        })}
      >
        {match(todoDetailQuery)
          .with({ isSuccess: true }, ({ data }) => (
            <>
              <Input
                type="text"
                className="w-10/12"
                aria-label="todo detail input"
                {...form.register('todo', { required: true })}
              />

              {user?.id === data.userId && (
                <Button
                  type="submit"
                  className="w-2/12"
                  isDisabled={form.formState.isSubmitting}
                >
                  {t('update')}
                </Button>
              )}
            </>
          ))
          .otherwise(() => null)}
      </form>
    </Template>
  );
}

function Template({
  children,
  todoId,
}: React.PropsWithChildren<{ todoId: string }>) {
  const [t] = useI18n();

  return (
    <>
      <Navbar />

      <div className="container mx-auto flex flex-col items-center py-5 duration-300">
        <section className="mb-10 flex w-full flex-col space-y-2">
          <Breadcrumbs>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/todos">Todos</BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>{todoId}</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumbs>

          <h1 className="text-3xl font-medium sm:text-4xl">
            {t('xDetail', { feature: 'Todo' })}
          </h1>
        </section>

        {children}
      </div>
    </>
  );
}
