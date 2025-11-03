/**
 * カレンダーにマークする日付の設定
 */
export type MarkedDateConfig = {
  /** 日付をマークするかどうか */
  marked?: boolean;
  /** 選択された日付かどうか */
  selected?: boolean;
  /** 選択された日付のスタイル */
  selectedColor?: string;
  /** マークされた日付のスタイル */
  markedColor?: string;
  /** 日付のテキストスタイル */
  textColor?: string;
  /** カスタムマーカー */
  dots?: {
    color: string;
    selectedColor?: string;
  }[];
};

/**
 * カレンダーコンポーネントのProps
 */
export interface CalendarProps {
  /** マークされた日付のマップ（YYYY-MM-DD形式をキーとする） */
  markedDates: Record<string, MarkedDateConfig>;
  /** 日付が選択された時のコールバック */
  onDayPress?: (date: Date) => void;
  /** 現在選択されている日付 */
  selectedDate?: Date;
  /** カスタムクラス名 */
  className?: string;
  /** カレンダーの表示月を制御 */
  current?: string;
  /** 最小選択可能日付 */
  minDate?: string;
  /** 最大選択可能日付 */
  maxDate?: string;
}
