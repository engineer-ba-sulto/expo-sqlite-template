import { formatDateToYMD, isSameDate, timestampToDate } from "@/lib/date";
import { MarkedDateConfig } from "@/types/calendar";
import { useMemo } from "react";

/**
 * TODOアイテムの型定義
 */
type TodoItem = {
  id: number;
  title: string;
  description: string;
  createdAt: Date | number;
};

/**
 * TODO用のカレンダーフックの戻り値の型
 */
export type UseCalendarTodosReturn = {
  /** カレンダーにマークする日付のマップ */
  markedDates: Record<string, MarkedDateConfig>;
  /** 選択された日付に基づいてフィルタリングされたTODOリスト */
  filteredTodos: TodoItem[];
};

/**
 * TODO配列からカレンダーの日付マーキングデータを生成し、
 * 選択された日付でTODOをフィルタリングするカスタムフック
 *
 * このフックはTODO固有のロジックのみを担当し、
 * 汎用的なCalendarコンポーネントとは独立しています。
 *
 * @param todos TODOアイテムの配列
 * @param selectedDate 選択された日付（オプション）
 * @returns マークされた日付のマップとフィルタリングされたTODOリスト
 *
 * @example
 * ```tsx
 * const { markedDates, filteredTodos } = useCalendarTodos(todos, selectedDate);
 *
 * <Calendar
 *   markedDates={markedDates}
 *   onDayPress={(date) => setSelectedDate(date)}
 *   selectedDate={selectedDate}
 * />
 * ```
 */
export default function useCalendarTodos(
  todos: TodoItem[],
  selectedDate?: Date
): UseCalendarTodosReturn {
  // TODO配列から日付マーキングデータを生成
  const markedDates = useMemo(() => {
    const marked: Record<string, MarkedDateConfig> = {};

    todos.forEach((todo) => {
      // createdAtがDate型かnumber型（timestamp）かを判定
      const createdAtDate =
        todo.createdAt instanceof Date
          ? todo.createdAt
          : timestampToDate(todo.createdAt as number);

      const dateKey = formatDateToYMD(createdAtDate);

      // 既にマークされている日付の場合は、マーク数を増やす
      if (marked[dateKey]) {
        marked[dateKey].marked = true;
      } else {
        marked[dateKey] = {
          marked: true,
          markedColor: "#50cebb",
        };
      }
    });

    return marked;
  }, [todos]);

  // 選択された日付でTODOをフィルタリング
  const filteredTodos = useMemo(() => {
    if (!selectedDate) {
      return todos;
    }

    return todos.filter((todo) => {
      const createdAtDate =
        todo.createdAt instanceof Date
          ? todo.createdAt
          : timestampToDate(todo.createdAt as number);

      return isSameDate(createdAtDate, selectedDate);
    });
  }, [todos, selectedDate]);

  return {
    markedDates,
    filteredTodos,
  };
}
