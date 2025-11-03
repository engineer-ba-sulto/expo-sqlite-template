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
 * YYYY-MM-DD形式の文字列をDateオブジェクトに変換する
 * @param ymd YYYY-MM-DD形式の文字列
 * @returns Dateオブジェクト
 */
export function parseYMDToDate(ymd: string): Date {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
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

/**
 * タイムスタンプ（秒単位の整数）をDateオブジェクトに変換する
 * @param timestamp タイムスタンプ（秒単位）
 * @returns Dateオブジェクト
 */
export function timestampToDate(timestamp: number): Date {
  // SQLiteのタイムスタンプは秒単位の場合とミリ秒単位の場合があるため、
  // 1000未満の場合は秒単位とみなして変換
  if (timestamp < 10000000000) {
    return new Date(timestamp * 1000);
  }
  return new Date(timestamp);
}

/**
 * Dateオブジェクトの時刻部分を00:00:00にリセットする
 * @param date リセットするDateオブジェクト
 * @returns 時刻が00:00:00にリセットされた新しいDateオブジェクト
 */
export function resetTimeToMidnight(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
