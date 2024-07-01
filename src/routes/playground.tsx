import { NavbarMenuTheme } from '#app/components/navbar/navbar-menu-theme';
import { Tab, TabList, TabPanel, Tabs } from '#app/components/ui/tabs';
import { DemoContainer } from '#playground/components/demo';
import { createFileRoute } from '@tanstack/react-router';
import type { ComponentPropsWithoutRef } from 'react';
import { twJoin } from 'tailwind-merge';

const tabClassName: ComponentPropsWithoutRef<typeof Tab>['className'] = ({
  isSelected,
  isDisabled,
}) => twJoin('tab', isSelected && 'tab-active', isDisabled && 'tab-disabled');

export const Route = createFileRoute('/playground')({
  component: () => (
    <Tabs
      defaultSelectedKey="designer"
      className="flex flex-col min-h-screen w-full"
    >
      <div className="flex justify-between p-5">
        <TabList aria-label="Playground">
          <Tab id="demo" className={tabClassName}>
            Demo
          </Tab>

          <Tab id="playground" className={tabClassName}>
            Playground
          </Tab>
        </TabList>

        <NavbarMenuTheme />
      </div>

      <TabPanel id="demo" className="size-full">
        <DemoContainer />
      </TabPanel>

      <TabPanel id="playground" className="size-full">
        Playground
      </TabPanel>
    </Tabs>
  ),
});
