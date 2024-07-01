import { Navbar } from '#app/components/navbar/navbar';
import { Button } from '#app/components/ui/button';
import { Checkbox } from '#app/components/ui/checkbox';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '#app/components/ui/dialog';
import { Input } from '#app/components/ui/input';
import { Label } from '#app/components/ui/label';
import { Link } from '#app/components/ui/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from '#app/components/ui/select';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import { resourceListRequestSchema } from '#app/schemas/api.schema';
import { checkAuthUser } from '#app/utils/checker.util';
import { useUserStore } from '#auth/hooks/use-user-store.hook';
import {
  todoKeys,
  todoRepositories,
  todoSchema,
  type TodoSchema,
} from '#todo/apis/todo.api';
import { todosDefaults } from '#todo/constants/todos.constant';
import { useTodoCreateOptimistic } from '#todo/hooks/use-todo-create.hook';
import { useTodoDeleteOptimistic } from '#todo/hooks/use-todo-delete.hook';
import { useTodoList } from '#todo/hooks/use-todo-list.hook';
import { useTodoUpdateOptimistic } from '#todo/hooks/use-todo-update.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { random } from '@rifandani/nxact-yutiriti';
import { createFileRoute, redirect, useBlocker } from '@tanstack/react-router';
import { GridList, GridListItem } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { twJoin } from 'tailwind-merge';
import { match } from 'ts-pattern';
import { z } from 'zod';

/**
 * to avoid showing an error to the user because we use `catch` if a search parameter is malformed
 */
const searchParamsSchema = resourceListRequestSchema
  .pick({ select: true })
  .extend({
    limit: z
      .number()
      .optional()
      .default(todosDefaults.limit)
      .catch(Number(todosDefaults.limit)),
    skip: z
      .number()
      .optional()
      .default(todosDefaults.skip)
      .catch(todosDefaults.skip),
  });

export const Route = createFileRoute('/todos/')({
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
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search }, context: { queryClient } }) => {
    const todos = await queryClient.ensureQueryData({
      queryKey: todoKeys.list(search),
      queryFn: () => todoRepositories.list(search),
      staleTime: 1_000 * 60 * 1, // 1 min
    });

    return todos;
  },
  component: Component,
});

function Component() {
  const [t] = useI18n();

  return (
    <>
      <Navbar />

      <div className="container mx-auto flex flex-col py-5 duration-300">
        <h1 className="text-3xl font-medium sm:text-4xl">
          {t('xList', { feature: 'Todo' })}
        </h1>

        <section className="w-full pt-5">
          <TodosCreate />
          <TodosFilter />
          <TodosList />
        </section>
      </div>
    </>
  );
}

function TodosCreate() {
  const [t] = useI18n();
  const { user } = useUserStore();
  const searchParams = Route.useSearch();
  const todoCreateOptimistic = useTodoCreateOptimistic(searchParams, {
    onSettled: () => {
      // reset form
      form.reset();
    },
  });

  const form = useForm<TodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      id: 1, // we override it later on `onSubmit`
      todo: '',
      userId: 1,
      completed: false,
    },
  });

  // block navigating when input has been entered, but not submitted
  const blocker = useBlocker({
    condition: form.watch('todo') !== '',
  });

  return (
    <>
      <DialogTrigger isOpen={blocker.status === 'blocked'}>
        <DialogOverlay isDismissable={false}>
          <DialogContent
            role="alertdialog"
            closeButton={false}
            isDismissable={false}
          >
            <DialogHeader>
              <DialogTitle>{t('attention')}</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              {t('unsavedChanges')}
            </p>

            <DialogFooter>
              <Button
                variant="outline"
                className="mt-2 sm:mt-0"
                autoFocus
                onPress={blocker.reset}
              >
                {t('cancel')}
              </Button>
              <Button variant="destructive" onPress={blocker.proceed}>
                {t('continue')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <form
        className="mb-3 flex w-full flex-col duration-300 lg:flex-row"
        onSubmit={form.handleSubmit((values) => {
          const payload = {
            ...values,
            userId: user?.id ?? 1,
            id: random(11, 999_999), // generate different id everytime
          };

          todoCreateOptimistic.mutate(payload);
        })}
      >
        <Input
          type="text"
          className="w-full lg:w-10/12"
          placeholder={t('todoPlaceholder')}
          {...form.register('todo', { required: true, minLength: 3 })}
        />

        <Button
          type="submit"
          className="ml-0 mt-2 w-full normal-case lg:ml-2 lg:mt-0 lg:w-2/12"
          isDisabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {t('add')}
        </Button>
      </form>
    </>
  );
}

function TodosFilter() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const [t] = useI18n();

  const items = todosDefaults.limits.map((limit) => ({ id: limit }));

  return (
    <form className="pb-3 w-full">
      <Select
        aria-label="todo list limit selection"
        selectedKey={(searchParams.limit as number).toString()}
        onSelectionChange={(selected) => {
          navigate({
            search: (prev) => ({
              ...prev,
              limit: Number(selected),
            }),
          });
        }}
      >
        <Label>{t('limit')}</Label>

        <SelectTrigger className="mt-2 w-[160px]">
          <SelectValue>{({ selectedText }) => selectedText}</SelectValue>
        </SelectTrigger>

        <SelectPopover>
          <SelectContent aria-label="limits" items={items}>
            {({ id }) => <SelectItem textValue={id}>{id}</SelectItem>}
          </SelectContent>
        </SelectPopover>
      </Select>
    </form>
  );
}

function TodosList() {
  const [t] = useI18n();
  const searchParams = Route.useSearch();
  const loaderData = Route.useLoaderData();
  const todoListQuery = useTodoList(searchParams, { initialData: loaderData });

  return (
    <>
      {match(todoListQuery)
        .with({ isFetching: true }, { isLoading: true }, () => (
          <div
            aria-label="Todo list query loading spinner"
            className="flex items-center justify-center py-5"
          >
            <Icon
              icon="svg-spinners:3-dots-fade"
              height="5em"
              className="text-primary"
            />
          </div>
        ))
        .with({ isError: true }, ({ error }) => (
          <div
            role="alert"
            aria-label="Todo list query error"
            className="mt-2 bg-destructive p-2 rounded-md flex items-center gap-x-3 shadow-md w-full"
          >
            <Icon icon="lucide:alert-circle" />

            <span className="flex flex-col">
              <p className="">{t('error', { module: 'Todos' })}:</p>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </span>
          </div>
        ))
        .with({ isSuccess: true }, ({ data }) => (
          <GridList
            aria-label="Todo grid list with multiple checkbox selection and toggle behavior"
            selectionMode="multiple"
            selectionBehavior="toggle"
            items={data.todos}
            renderEmptyState={() => (
              <h2 className="flex items-center justify-center py-5">
                {t('empty')}
              </h2>
            )}
          >
            {(todo) => <TodosListItem todo={todo} />}
          </GridList>
        ))
        .otherwise(() => null)}
    </>
  );
}

function TodosListItem({ todo }: { todo: TodoSchema }) {
  const { user } = useUserStore();
  const searchParams = Route.useSearch();
  const todoUpdateOptimistic = useTodoUpdateOptimistic(searchParams);
  const todoDeleteOptimistic = useTodoDeleteOptimistic(searchParams);

  return (
    <GridListItem
      className="mb-2 flex items-center justify-between duration-300 ease-in-out animate-in slide-in-from-left-5"
      textValue={todo.todo}
    >
      <Checkbox
        slot="selection"
        id={`todo-${todo.id}-checkbox`}
        name={`todo-${todo.id}-checkbox`}
        isSelected={todo.completed}
        onChange={() => {
          todoUpdateOptimistic.mutate({ ...todo, completed: !todo.completed });
        }}
      />

      <Link
        href="/todos/$todoId"
        routerOptions={{
          params: { todoId: todo.id.toString() },
        }}
        className={twJoin(
          'w-full justify-start text-lg text-current hover:font-bold',
          todo.completed && 'line-through hover:line-through',
        )}
        variant="link"
      >
        {todo.todo}
      </Link>

      {user?.id === todo.userId && (
        <Button
          data-testid="todo-delete"
          type="submit"
          size="xs"
          variant="destructive"
          onPress={() => {
            todoDeleteOptimistic.mutate(todo.id);
          }}
        >
          <Icon icon="lucide:trash-2" />
        </Button>
      )}
    </GridListItem>
  );
}
