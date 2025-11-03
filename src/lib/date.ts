/**
 * DateオブジェクトをYYYY-MM-DD形式の文字列に変換する
 * @param date 変換するDateオブジェクト
 * @returns YYYY-MM-DD形式の文字列
 */
export function formatDateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 2つの日付が同じ日かどうかを判定する（時刻は無視）
 * @param date1 比較する日付1
 * @param date2 比較する日付2
 * @returns 同じ日の場合true
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
