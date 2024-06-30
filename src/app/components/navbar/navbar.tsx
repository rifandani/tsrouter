import { SvgIcon } from '#app/components/svg-icon';
import { Avatar, AvatarFallback } from '#app/components/ui/avatar';
import { Button } from '#app/components/ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTrigger,
} from '#app/components/ui/dialog';
import {
  Menu,
  MenuHeader,
  MenuItem,
  MenuPopover,
  MenuRadioItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from '#app/components/ui/menu';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import type { LocaleDictLanguage } from '#app/providers/i18n/context';
import { useUserStore } from '#auth/hooks/use-user-store.hook';
import { Icon } from '@iconify/react';
import { useNavigate } from '@tanstack/react-router';
import { Link, useLocale, type Selection } from 'react-aria-components';
import { NavbarMenuTheme } from './navbar-menu-theme';

function NavbarMenuLanguage() {
  const { locale } = useLocale();
  const [t, { changeLocale }] = useI18n();

  return (
    <MenuTrigger>
      <Button size="icon" variant="outline">
        <Icon
          icon={locale === 'en-US' ? 'flag:us-1x1' : 'flag:id-1x1'}
          className="size-6"
        />
      </Button>

      <MenuPopover>
        <Menu
          selectionMode="single"
          selectedKeys={new Set([locale])}
          onSelectionChange={(_selection) => {
            const selection = _selection as Exclude<Selection, 'all'> & {
              currentKey: LocaleDictLanguage;
            };
            changeLocale(selection.currentKey);
          }}
        >
          <MenuSection>
            <MenuHeader separator>{t('language')}</MenuHeader>

            <MenuRadioItem id="en-US">English</MenuRadioItem>
            <MenuRadioItem id="id-ID">Indonesia</MenuRadioItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}

function NavbarMenuProfile() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  return (
    <MenuTrigger>
      <Button size="icon" variant="ghost" className="rounded-full">
        <Avatar>
          <AvatarFallback>
            {user?.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Button>

      <MenuPopover>
        <Menu
          selectionMode="single"
          onSelectionChange={(_selection) => {
            const selection = _selection as Exclude<Selection, 'all'> & {
              currentKey: 'profile' | 'settings' | 'logout';
            };

            if (selection.currentKey === 'logout') {
              clearUser(); // clear user store
              navigate({ to: '/login' }); // back to login page
            }
          }}
        >
          <MenuSection>
            <MenuHeader separator>{t('account')}</MenuHeader>

            <MenuItem id="profile" className="gap-x-2">
              <Icon icon="lucide:user" />
              <span>{t('profile')}</span>
            </MenuItem>
            <MenuItem id="settings" className="gap-x-2">
              <Icon icon="lucide:settings" />
              <span>{t('settings')}</span>
            </MenuItem>
          </MenuSection>

          <MenuSeparator />

          <MenuSection>
            <MenuItem id="logout" className="gap-x-2">
              <Icon icon="lucide:log-out" />
              <p>{t('logout')}</p>
            </MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  );
}

export function Navbar() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  return (
    <nav className="flex items-center justify-between border-b p-2.5 shadow-sm">
      <Link href="/" className="flex items-center">
        <SvgIcon id="icon-reactjs" className="size-6" />
        <span className="ml-2 text-2xl font-semibold">{t('appName')}</span>
      </Link>

      <section className="hidden items-center gap-x-2 sm:flex">
        <NavbarMenuLanguage />
        <NavbarMenuTheme />
        <NavbarMenuProfile />
      </section>

      {/* sidebar on mobile viewport */}
      <DialogTrigger>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Icon icon="lucide:menu" className="size-6" />
        </Button>

        <DialogOverlay>
          <DialogContent
            side="left"
            className="flex w-[400px] flex-col justify-between"
            dialogClassName="flex flex-col justify-between"
          >
            <DialogHeader className="text-left">
              <SvgIcon id="icon-reactjs" className="mb-6 size-6" />

              <Link href="/">Home</Link>
              <Link href="/todos">Todos</Link>
              <Link href="/playground">Playground</Link>
            </DialogHeader>

            <DialogFooter>
              <Button
                className="gap-x-2"
                onPress={() => {
                  clearUser(); // reset `user` store
                  navigate({ to: '/login' }); // back to login
                }}
              >
                <Icon icon="lucide:log-out" />
                {t('logout')} ({user?.username ?? 'Unknown'})
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </nav>
  );
}
