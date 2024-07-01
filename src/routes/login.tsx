import { Button } from '#app/components/ui/button';
import { Input } from '#app/components/ui/input';
import { Label } from '#app/components/ui/label';
import { Link } from '#app/components/ui/link';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import { checkAuthUser } from '#app/utils/checker.util';
import reactjs from '#assets/images/reactjs.svg';
import {
  authLoginRequestSchema,
  type AuthLoginRequestSchema,
} from '#auth/apis/auth.api';
import { useAuthLogin } from '#auth/hooks/use-auth-login.hook';
import { useUserStore } from '#auth/hooks/use-user-store.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { FieldError, TextField } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ location }) => {
    const authed = checkAuthUser();

    if (authed) {
      // redirect authorized user to login
      toast.info('Already Logged In');
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

  return (
    <div className="min-h-screen w-full flex">
      {/* form */}
      <section className="min-h-screen w-full flex flex-col justify-center px-10 xl:px-20 md:w-1/2">
        <h1 className="text-center text-3xl text-primary">{t('welcome')}</h1>

        <LoginForm />

        <p className="py-12 text-center">
          {t('noAccount')}{' '}
          <Link
            aria-label={t('registerHere')}
            className="hover:underline"
            href="/"
            variant="link"
          >
            {t('registerHere')}
          </Link>
        </p>
      </section>

      {/* image */}
      <section className="hidden md:block w-1/2 shadow-2xl">
        <span className="relative h-screen w-full md:flex md:items-center md:justify-center">
          <img
            src={reactjs}
            alt="cool react logo with rainbow shadow"
            loading="lazy"
            className="h-full object-cover"
            aria-label="cool react logo"
          />
        </span>
      </section>
    </div>
  );
}

function LoginForm() {
  const [t] = useI18n();
  const navigate = Route.useNavigate();
  const { setUser } = useUserStore();

  const form = useForm<AuthLoginRequestSchema>({
    mode: 'onChange',
    resolver: zodResolver(authLoginRequestSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const loginMutation = useAuthLogin(undefined, {
    onSuccess: async (user) => {
      setUser(user);
      await navigate({ to: '/' });
    },
  });

  return (
    <form
      className="flex flex-col pt-3 md:pt-8"
      onSubmit={form.handleSubmit(async (values) => {
        loginMutation.mutate(values);
      })}
    >
      <Controller
        name="username"
        control={form.control}
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextField
            className="group/username pt-4"
            // let RHF handle validation instead of the browser.
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label>{t('username')}</Label>
            <Input placeholder={t('usernamePlaceholder')} ref={ref} />
            <FieldError className="text-destructive">
              {error?.message}
            </FieldError>
          </TextField>
        )}
      />

      {/* password */}
      <Controller
        name="password"
        control={form.control}
        render={({
          field: { name, value, onChange, onBlur, ref },
          fieldState: { invalid, error },
        }) => (
          <TextField
            className="group/password pt-4"
            // Let React Hook Form handle validation instead of the browser.
            validationBehavior="aria"
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={invalid}
            isRequired
          >
            <Label>{t('password')}</Label>
            <Input
              type="password"
              placeholder={t('passwordPlaceholder')}
              ref={ref}
            />
            <FieldError className="text-destructive">
              {error?.message}
            </FieldError>
          </TextField>
        )}
      />

      <Button
        type="submit"
        className="mt-8"
        isDisabled={loginMutation.isPending || !form.formState.isValid}
      >
        {t(loginMutation.isPending ? 'loginLoading' : 'login')} (emilyspass)
      </Button>
    </form>
  );
}
