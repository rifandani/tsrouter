import { Clock } from '#app/components/clock';
import { Button, type ButtonVariantProps } from '#app/components/ui/button';
import { useI18n } from '#app/hooks/use-i18n/use-i18n.hook';
import { useRafInterval } from '#app/hooks/use-raf-interval.hook';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { shuffle } from '@rifandani/nxact-yutiriti';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

const currentDate = new Date();

export function HomeClock() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const [parentRef] = useAutoAnimate();
  const [time, setTime] = useState(currentDate);
  const [showClock, setShowClock] = useState(true);
  const [buttons, setButtons] = useState([
    {
      id: 'sort',
      variant: 'default' as ButtonVariantProps['variant'],
      text: 'sortButtons',
    },
    {
      id: 'clock',
      variant: 'secondary' as ButtonVariantProps['variant'],
      text: 'toggleClock',
    },
    {
      id: 'start',
      variant: 'outline' as ButtonVariantProps['variant'],
      text: 'getStarted',
    },
  ] as const);

  // recalculate `seconds` every 1_000 ms
  useRafInterval(
    () => {
      if (showClock) setTime(new Date());
    },
    1_000,
    { immediate: true },
  );

  return (
    <>
      {showClock && (
        <section
          role="presentation"
          aria-label="clock ticking in svg"
          className="mt-8"
        >
          <Clock
            seconds={time.getSeconds()}
            minutes={time.getMinutes()}
            hours={time.getHours()}
          />
        </section>
      )}

      <section
        ref={parentRef}
        className="mt-8 grid grid-cols-1 gap-2 duration-300 sm:grid-cols-3"
      >
        {buttons.map((btn) => (
          <Button
            type="button"
            aria-label={`${btn.id} button`}
            id={btn.id}
            key={btn.id}
            variant={btn.variant}
            onPress={() => {
              if (btn.id === 'sort')
                setButtons((prev) => shuffle(prev) as unknown as typeof prev);
              else if (btn.id === 'clock') setShowClock((prev) => !prev);
              else navigate({ to: '/todos' });
            }}
          >
            {t(btn.text)}
          </Button>
        ))}
      </section>
    </>
  );
}
