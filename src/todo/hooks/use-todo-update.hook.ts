import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import type { ErrorResponseSchema } from '#app/schemas/api.schema';
import type {
  TodoListResponseSchema,
  TodoUpdateRequestSchema,
  TodoUpdateResponseSchema,
} from '#todo/apis/todo.api';
import { todoKeys, todoRepositories } from '#todo/apis/todo.api';
import {
  useMutation,
  useMutationState,
  useQueryClient,
  type MutationState,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import type { Except } from 'type-fest';
import type { ZodError } from 'zod';

type Params = Parameters<typeof todoKeys.update>[0];
type Success = Awaited<ReturnType<typeof todoRepositories.update>>;
type Error = ErrorResponseSchema | HTTPError | ZodError;

/**
 * @url PUT ${env.apiBaseUrl}/todos
 * @note includes error handling & `todoKeys.all` key invalidation for convenience
 */
export function useTodoUpdate(
  params: Params,
  mutationOptions?: Except<
    UseMutationOptions<Success, Error, Exclude<Params, undefined>>,
    'mutationKey' | 'mutationFn'
  >,
) {
  const { onSuccess, onError, ..._mutationOptions } = mutationOptions ?? {};
  const queryClient = useQueryClient();
  const [t] = useI18n();

  return useMutation<Success, Error, Exclude<Params, undefined>>({
    mutationKey: todoKeys.update(params),
    mutationFn: (params) => todoRepositories.update(params),
    onSuccess: async (data, variables, context) => {
      // invalidate only change the status to inactive, the cache is still there
      // `await` is the lever
      await queryClient.invalidateQueries({
        queryKey: todoKeys.all,
      });
      toast.success(t('xUpdateSuccess', { feature: 'Todo' }));

      onSuccess?.(data, variables, context);
    },
    onError: async (error, variables, context) => {
      if (error instanceof HTTPError) {
        const json = (await error.response.json()) as ErrorResponseSchema;
        toast.error(json.message);
      } else {
        toast.error(error.message);
      }

      onError?.(error, variables, context);
    },
    ..._mutationOptions,
  });
}

/**
 * get mutation state based on the mutation key.
 *
 * @url PUT ${env.apiBaseUrl}/todos
 */
export function useTodoUpdateState(params: Params) {
  return useMutationState<
    MutationState<Success, Error, Exclude<Params, undefined>>
  >({
    filters: {
      mutationKey: todoKeys.update(params),
    },
  });
}

/**
 * optimistic update
 *
 * @url PUT ${env.apiBaseUrl}/todos
 * @note includes error handling in "effect" for convenience
 */
export function useTodoUpdateOptimistic(
  params: Parameters<typeof todoKeys.list>[0],
) {
  const [t] = useI18n();
  const queryClient = useQueryClient();
  const queryKey = todoKeys.list(params);

  return useMutation<
    TodoUpdateResponseSchema,
    ErrorResponseSchema,
    TodoUpdateRequestSchema,
    { previousTodosQueryResponse: TodoListResponseSchema }
  >({
    // Called before `mutationFn`:
    onMutate: async ({ id, ...body }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousTodosQueryResponse =
        queryClient.getQueryData<TodoListResponseSchema>(queryKey) ?? {
          limit: Number(params?.limit ?? 10),
          todos: [],
          skip: 0,
          total: 0,
        };

      // Optimistically update to the new value
      queryClient.setQueryData<TodoListResponseSchema>(queryKey, {
        ...previousTodosQueryResponse,
        todos: previousTodosQueryResponse.todos.map((_todo) =>
          _todo.id === id ? { ..._todo, ...body } : _todo,
        ),
      });

      // Return a context object with the snapshotted value
      return { previousTodosQueryResponse };
    },
    mutationFn: (updateTodo) => todoRepositories.update(updateTodo),
    onSettled: (_updateTodo, error, _variables, context) => {
      toast[error ? 'error' : 'success'](
        t(error ? 'xUpdateError' : 'xUpdateSuccess', {
          feature: 'Todo',
        }),
      );

      // If the mutation fails, use the context returned from `onMutate` to roll back
      if (error)
        queryClient.setQueryData<TodoListResponseSchema>(
          queryKey,
          context?.previousTodosQueryResponse,
        );

      // if we want to refetch after error or success:
      // await queryClient.invalidateQueries({ queryKey });
    },
  });
}
