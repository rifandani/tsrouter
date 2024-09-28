import { NavbarMenuTheme } from '#app/components/navbar/navbar-menu-theme';
import { Tab, TabList, TabPanel, Tabs } from '#app/components/ui/tabs';
import { Editor } from '#playground/components/tiptap/editor';
// import { DemoContainer } from '#playground/components/demo';
import { createFileRoute } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef } from 'react';
import { twJoin } from 'tailwind-merge';
import { z } from 'zod';

const tabClassName: ComponentPropsWithoutRef<typeof Tab>['className'] = ({
  isSelected,
  isDisabled,
}) => twJoin('tab', isSelected && 'tab-active', isDisabled && 'tab-disabled');

const searchParams = z.object({
  tab: z.enum(['demo', 'tiptap']).default('demo').catch('demo'),
});

export const Route = createFileRoute('/playground')({
  validateSearch: searchParams,
  component: Component,
});

function Component() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <Tabs
      className="flex flex-col min-h-screen w-full"
      selectedKey={search.tab}
      onSelectionChange={(selected) => {
        navigate({
          search: {
            tab: selected.toString() as 'demo' | 'tiptap',
          },
        });
      }}
    >
      <div className="flex justify-between p-5">
        <TabList aria-label="Playground">
          <Tab id="demo" className={tabClassName}>
            Demo
          </Tab>

          <Tab id="tiptap" className={tabClassName}>
            Tiptap
          </Tab>
        </TabList>

        <NavbarMenuTheme />
      </div>

      <TabPanel id="demo" className="size-full">
        {/* <DemoContainer /> */}
      </TabPanel>

      <TabPanel id="tiptap" className="size-full px-5">
        <Editor value="" onValueChange={(value) => {}} />
      </TabPanel>
    </Tabs>
  );
}
