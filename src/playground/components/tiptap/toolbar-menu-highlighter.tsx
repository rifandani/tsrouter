import { Button } from '#app/components/ui/button';
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  SliderTrack,
} from '#app/components/ui/color';
import { Dialog, DialogTrigger } from '#app/components/ui/dialog';
import { Input } from '#app/components/ui/input';
import { Label } from '#app/components/ui/label';
import { Popover } from '#app/components/ui/popover';
import { Icon } from '@iconify/react';
import type React from 'react';
import {
  FieldError,
  parseColor,
  type Color,
  type PressEvent,
} from 'react-aria-components';

export function ToolbarMenuHighlighter({
  children,
  color,
  onChange,
  onReset,
}: React.PropsWithChildren<{
  color: string;
  onChange: (color: Color) => void;
  onReset: (evt: PressEvent) => void;
}>) {
  return (
    <ColorPicker value={parseColor(color)} onChange={onChange}>
      <DialogTrigger>
        {children}

        <Popover placement="bottom start" className="w-fit">
          <Dialog className="outline-none flex flex-col gap-4">
            <div>
              <ColorArea
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                className="border-b-0 rounded-b-none h-[164px]"
              >
                <ColorThumb className="z-50" />
              </ColorArea>
              <ColorSlider colorSpace="hsb" channel="hue">
                <SliderTrack className="rounded-t-none border-t-0">
                  <ColorThumb className="top-1/2" />
                </SliderTrack>
              </ColorSlider>
            </div>

            <ColorField colorSpace="hsb" className="w-[192px]">
              <Label>Hex</Label>
              <Input className="" />
              <FieldError />
            </ColorField>

            <ColorSwatchPicker className="w-[192px]">
              <ColorSwatchPickerItem color="#F00">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#F90">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#0F0">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#08F">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#00F">
                <ColorSwatch />
              </ColorSwatchPickerItem>
            </ColorSwatchPicker>

            <Button
              className="w-full gap-2"
              size="sm"
              variant="outline"
              onPress={onReset}
            >
              <Icon icon="lucide:undo-2" />
              Reset
            </Button>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </ColorPicker>
  );
}
