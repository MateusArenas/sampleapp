import { addMonths, format, formatDate, parseISO, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { Modal, TextStyle, View } from "react-native";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import { CalendarListImperativeMethods } from "react-native-calendars/src/calendar-list";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { Button, Divider, IconButton, MD3Theme, Text, useTheme } from "react-native-paper";
import * as Haptics from 'expo-haptics'
import { event } from '../../services/event';

LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
  today: 'Hoje'
};

LocaleConfig.defaultLocale = 'pt';

export interface CalendarConfig {
  onSelected?: (date: string) => void;
  selectedDate?: string;
} 

export interface CalendarEvent {
  type: string; 
  config?: CalendarConfig;
}

interface CalendarMethods {
  open(config: CalendarConfig): () => void;
  close(): void;
  on(type: string, fn: (event: CalendarEvent) => void): () => void
  formatToLongDate: (dateStr: string) => string;
}

interface CalendarProps {
  bottomInset: number;
  theme: MD3Theme;
}

export const CalendarHandler = React.forwardRef<CalendarMethods, CalendarProps>(({
  bottomInset,
  theme,
}, ref) => {
  const calendarListRef = React.useRef<CalendarListImperativeMethods>(null);
  
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<CalendarConfig | undefined>(undefined);

  const [selected, setSelected] = React.useState<string>();
  const [currentMonth, setCurrentMonth] = React.useState<string>();

  const methods = React.useMemo(() => ({
    open (config?: CalendarConfig) {
      setVisible(true);

      setConfig(config);

      if (config?.selectedDate) {
        setSelected(config.selectedDate);
        setCurrentMonth(config.selectedDate);
      }
      
      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Rigid
      );
      
      return () => this.close();
    },
    close () {
      setVisible(false);

      setConfig(undefined);

      setSelected(undefined);

      setCurrentMonth(undefined);

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Soft
      );
    },
    on(type: string, fn: (event: any) => void) {
      event.on(`calendar:${type}`, fn);
  
      return () => {
        event.off(`calendar:${type}`, fn);
      };
    },
    formatToLongDate
  }), [])

  React.useImperativeHandle(ref, () => methods, [methods]);

  const onInputSheetEvent = React.useCallback((event: CalendarEvent) => {
    switch (event.type) {
      case 'open':
        methods.open(event?.config);
        break;
      case 'close':
        methods.close();
        break;
      default:
        break;
    }
  }, [methods])

  React.useEffect(() => {
    const unsubscribe = methods.on('root', onInputSheetEvent);

    return () => {
      unsubscribe();
    };
  }, [onInputSheetEvent, methods]);

  const currentDateStr = React.useMemo(() => {
    return selected ?? nowDateStr();
  }, [selected])

  const markedDates: (MarkedDates | undefined) = React.useMemo(() => {
    if (selected) {
      return {
        [selected]: { selected: true, disableTouchEvent: true }
      }
    }

    return undefined;
  }, [selected]);

  const onDayPress = React.useCallback((dateData: DateData) => {
    config?.onSelected?.(dateData.dateString);

    setSelected(dateData.dateString);
  }, [config]);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <View style={[{ flexDirection: "column", gap: 8, padding: 20 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <IconButton style={{ margin: 0 }}
              icon="close"
              onPress={() => {
                setVisible(false);
              }}
            />

            <Button style={{ margin: 0 }}
              onPress={() => {
                setVisible(false);
              }}
            >
              SELECIONAR
            </Button>
          </View>
          <View style={[{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }]}>
              <View>
                <Text style={[{ color: theme.colors.onSurfaceDisabled }]}
                  variant="labelSmall"
                >
                  SELECIONE A DATA
                </Text>

                {!!selected && (
                  <Text style={[{ color: theme.colors.onSurface }]}
                    variant="headlineSmall"
                    onPress={() => {
                      calendarListRef.current?.scrollToDay(selected, 0, true);
                    }}
                  >
                    {formatToLongDate(selected)}
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <IconButton style={{ margin: 0 }}
                  icon="chevron-left"
                  disabled={!currentMonth}
                  onPress={() => {
                    const prevMonth = decreaseMonth(currentMonth!);
                    calendarListRef.current?.scrollToMonth(prevMonth);
                  }}
                />
                <IconButton style={{ margin: 0 }}
                  icon="chevron-right"
                  disabled={!currentMonth}
                  onPress={() => {
                    const nextMonth = increaseMonth(currentMonth!);
                    calendarListRef.current?.scrollToMonth(nextMonth);
                  }}
                />
              </View>
          </View>
        </View>
        <Divider />
        <CalendarList
          ref={calendarListRef}
          renderHeader={renderCustomHeader}
          current={currentDateStr}
          onDayPress={onDayPress}
          markedDates={markedDates}
          onVisibleMonthsChange={(months) => {
            const current = months[0];
            setCurrentMonth(current.dateString);
          }}
          theme={{
            backgroundColor: theme.colors.background,
            calendarBackground: theme.colors.surface,
            textSectionTitleColor: theme.colors.onSurfaceVariant,
            selectedDayBackgroundColor: theme.colors.primary,

            selectedDayTextColor: theme.colors.onPrimary,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.onSurface,
            textDisabledColor: '#d9e',
            monthTextColor: theme.colors.onSurfaceDisabled,
          }}
          // minDate='2024-08-04'
          // maxDate='2024-09-05'
        />
      </View>
    </Modal>
  )
});

const nowDateStr = () => {
  return formatDate(new Date(), 'yyyy-MM-dd');
};

const dateStr = (date?: Date) => {
  return formatDate(date ?? new Date(), 'yyyy-MM-dd');
};

const increaseMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  const newDate = addMonths(date, 1);
  return formatDate(newDate, 'yyyy-MM-dd');
};

const decreaseMonth = (dateStr: string) => {
  const date = new Date(dateStr);
  const newDate = subMonths(date, 1);
  return formatDate(newDate, 'yyyy-MM-dd');
};

const formatToLongDate = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, 'dd MMMM \'de\' yyyy', { locale: ptBR });
};

function renderCustomHeader(date: any) {
  const theme = useTheme();

  const header = date.toString('MMMM yyyy');
  const [month, year] = header.split(' ');
  const textStyle: TextStyle = {
    fontSize: 18,
    fontWeight: '700',
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.colors.onSurfaceVariant,
    paddingRight: 5
  };

  return (
    <View>
      <View style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
      }}>
        <Text style={[{}, textStyle]}>{`${month}`}</Text>
        <Text style={[{}, textStyle]}>{year}</Text>
      </View>
      <Divider />
    </View>
  );
}

export const Calendar: CalendarMethods = {
  open(config: CalendarConfig) {
    event.emit('calendar:root', { type: 'open', config });
    return () => this.close();
  },
  close() {
    event.emit('calendar:root', { type: 'close' });
  },
  on(type: string, fn: (event: CalendarEvent) => void): () => void {
    event.on(`calendar:${type}`, fn);

    return () => {
      event.off(`calendar:${type}`, fn);
    };
  },
  formatToLongDate,
}