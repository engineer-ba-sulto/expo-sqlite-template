import { formatDateToYMD } from "@/lib/date";
import { CalendarProps } from "@/types/calendar";
import { View } from "react-native";
import {
  Calendar as RNCalendar,
  CalendarProps as RNCalendarProps,
} from "react-native-calendars";

/**
 * 汎用的なカレンダーコンポーネント
 *
 * このコンポーネントはTODOに依存せず、任意のデータソースから日付マーキング情報を受け取って表示できます。
 * 他のアプリでも再利用可能な設計になっています。
 *
 * @example
 * ```tsx
 * const markedDates = {
 *   '2024-01-15': { marked: true, markedColor: '#50cebb' },
 *   '2024-01-20': { marked: true, selected: true, selectedColor: '#00adf5' }
 * };
 *
 * <Calendar
 *   markedDates={markedDates}
 *   onDayPress={(date) => console.log('Selected:', date)}
 *   selectedDate={new Date('2024-01-20')}
 * />
 * ```
 */
export default function Calendar({
  markedDates,
  onDayPress,
  selectedDate,
  className,
  current,
  minDate,
  maxDate,
  ...restProps
}: CalendarProps & Omit<RNCalendarProps, "markedDates" | "onDayPress">) {
  // 選択された日付をYYYY-MM-DD形式に変換してmarkedDatesに追加
  const enrichedMarkedDates = { ...markedDates };

  if (selectedDate) {
    const selectedDateKey = formatDateToYMD(selectedDate);
    enrichedMarkedDates[selectedDateKey] = {
      ...enrichedMarkedDates[selectedDateKey],
      selected: true,
      selectedColor:
        enrichedMarkedDates[selectedDateKey]?.selectedColor || "#00adf5",
    };
  }

  // react-native-calendarsのonDayPressに合わせてDateオブジェクトに変換
  const handleDayPress = (day: { dateString: string }) => {
    if (onDayPress) {
      const date = new Date(day.dateString);
      onDayPress(date);
    }
  };

  return (
    <View className={className}>
      <RNCalendar
        markedDates={enrichedMarkedDates as any}
        onDayPress={handleDayPress}
        current={current}
        minDate={minDate}
        maxDate={maxDate}
        // 日本語ロケールの設定
        monthFormat="yyyy年MM月"
        theme={{
          // NativeWindと調和するカラーテーマ
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#00adf5",
          selectedDotColor: "#ffffff",
          arrowColor: "#00adf5",
          monthTextColor: "#2d4150",
          indicatorColor: "#00adf5",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        {...restProps}
      />
    </View>
  );
}
