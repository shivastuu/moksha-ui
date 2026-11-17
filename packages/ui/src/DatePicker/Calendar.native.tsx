import { useState } from 'react';
import { Text, View } from 'react-native';
import { buttonDepth } from '../Button/Button.shared';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { Motion } from '../motion/Motion.native';
import { Press } from '../motion/Press.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { addMonths, dayText, inRange, monthGrid, monthIndex, monthNames, sameDay, spokenDay, weekdayNames, type Day } from './DatePicker.shared';

interface CalendarProps {
  selected?: Day;
  start: Day;
  today: Day;
  min?: Day;
  max?: Day;
  weekStartsOn: 0 | 1;
  onPick: (day: Day) => void;
}

const size = 40;

/** A month grid of day buttons, with month arrows */
export function Calendar({ selected, start, today, min, max, weekStartsOn, onPick }: CalendarProps) {
  const theme = useTheme();
  const { colors, space, radius, opacity } = theme;
  const depth = buttonDepth(colors);
  const [month, setMonth] = useState(start);
  const days = monthGrid(month.year, month.month, weekStartsOn);
  const weekdays = Array.from({ length: 7 }, (_, index) => weekdayNames[(index + weekStartsOn) % 7]!);
  const nav = (label: string, direction: 'left' | 'right', disabled: boolean, step: number) => (
    <Press
      object
      ink={colors.text}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => setMonth(addMonths(month, step))}
      style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radius.full, opacity: disabled ? opacity.disabled : 1 }}
    >
      <ChevronIcon direction={direction} color={colors.text} />
    </Press>
  );

  return (
    <View style={{ gap: space.sm, alignSelf: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {nav('Previous month', 'left', !!min && monthIndex(month) <= monthIndex(min), -1)}
        <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={[textStyleFor(theme, 'body'), fontFor(theme, 'semibold'), { color: colors.text }]}>
          {monthNames[month.month - 1]} {month.year}
        </Text>
        {nav('Next month', 'right', !!max && monthIndex(month) >= monthIndex(max), 1)}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {weekdays.map((name) => (
          <Text key={name} accessibilityLabel={name} style={[textStyleFor(theme, 'caption'), fontFor(theme, 'medium'), { width: size + 2, textAlign: 'center', color: colors.textMuted }]}>
            {name.slice(0, 2)}
          </Text>
        ))}
      </View>
      {/* Keyed by month so each new month fades in */}
      <Motion key={dayText({ ...month, day: 1 })} preset="fade">
        {Array.from({ length: 6 }, (_, week) => (
          <View key={week} style={{ flexDirection: 'row' }}>
            {days.slice(week * 7, week * 7 + 7).map((day) => {
              const enabled = inRange(day, min, max);
              const chosen = sameDay(day, selected);
              const isToday = sameDay(day, today);
              return (
                <Press
                  key={dayText(day)}
                  object
                  ink={chosen ? colors.textOnPrimary : colors.text}
                  fill={chosen ? colors.primary : undefined}
                  accessibilityRole="button"
                  accessibilityLabel={isToday ? `${spokenDay(day)}, today` : spokenDay(day)}
                  accessibilityState={{ selected: chosen, disabled: !enabled }}
                  disabled={!enabled}
                  onPress={() => onPick(day)}
                  style={{
                    width: size,
                    height: size,
                    margin: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: size / 2,
                    backgroundImage: chosen ? depth.primaryFill : undefined,
                    boxShadow: chosen ? depth.primaryShadow : undefined,
                    opacity: enabled ? 1 : 0.35,
                  }}
                >
                  <Text
                    style={[
                      textStyleFor(theme, 'bodySmall'),
                      chosen || isToday ? fontFor(theme, 'semibold') : null,
                      {
                        color: chosen ? colors.textOnPrimary : isToday ? textTones(colors).primary : day.month === month.month ? colors.text : colors.textMuted,
                        fontVariant: ['tabular-nums'],
                        textDecorationLine: enabled ? 'none' : 'line-through',
                      },
                    ]}
                  >
                    {day.day}
                  </Text>
                </Press>
              );
            })}
          </View>
        ))}
      </Motion>
    </View>
  );
}
