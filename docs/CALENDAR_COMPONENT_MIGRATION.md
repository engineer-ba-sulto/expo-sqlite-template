# カレンダーコンポーネント移植ガイド

## 概要

このドキュメントでは、汎用的なカレンダーコンポーネントを他のアプリケーションに移植する方法について説明します。

このカレンダーコンポーネントは、TODOアプリ固有のロジックを分離して設計されており、任意のデータソースと連携して使用できる汎用的なコンポーネントです。

## 設計思想

### 汎用性の原則

1. **コンポーネントはビジネスロジックに依存しない**
   - `Calendar`コンポーネントは`src/components/ui/`に配置され、どのアプリでも使用可能
   - データの出所を問わず、propsで日付マーキング情報を受け取る

2. **ビジネスロジックの分離**
   - TODO固有の処理は`useCalendarTodos`フックに集約
   - 他のアプリでは独自のフックを作成して使用可能

3. **型安全性の確保**
   - TypeScriptの型定義により、コンパイル時にエラーを検出
   - 明確なインターフェースにより、使い方が理解しやすい

## ファイル構成と依存関係

```
src/
├── components/
│   └── ui/
│       └── Calendar.tsx          # 汎用カレンダーコンポーネント
├── hooks/
│   └── useCalendarTodos.ts       # TODO固有のロジック（参考実装）
├── lib/
│   └── date.ts                   # 汎用的な日付ユーティリティ関数
├── types/
│   └── calendar.ts               # カレンダー関連の型定義
└── app/
    └── index.tsx                 # 使用例
```

### ファイルの役割

#### `src/components/ui/Calendar.tsx`

- **役割**: 汎用的なカレンダーUIコンポーネント
- **依存関係**: `react-native-calendars`, `@/lib/date`, `@/types/calendar`
- **再利用性**: 高い（TODO以外のデータでも使用可能）

#### `src/hooks/useCalendarTodos.ts`

- **役割**: TODO固有のビジネスロジック
- **依存関係**: `@/lib/date`, `@/types/calendar`
- **再利用性**: 低い（TODO専用、参考実装として使用）

#### `src/lib/date.ts`

- **役割**: 汎用的な日付処理ユーティリティ関数
- **依存関係**: なし
- **再利用性**: 高い（どのアプリでも使用可能）

#### `src/types/calendar.ts`

- **役割**: カレンダーコンポーネントの型定義
- **依存関係**: なし
- **再利用性**: 高い（どのアプリでも使用可能）

## 移植手順

### 1. 必要なパッケージのインストール

```bash
bun add react-native-calendars
bun add -d @types/react-native-calendars
```

### 2. 必須ファイルのコピー

以下のファイルを新しいプロジェクトにコピーします：

1. **`src/lib/date.ts`** - 日付ユーティリティ関数
2. **`src/types/calendar.ts`** - 型定義
3. **`src/components/ui/Calendar.tsx`** - カレンダーコンポーネント

### 3. プロジェクト固有のフック作成（オプション）

TODO以外のデータを使用する場合は、独自のフックを作成します。

```typescript
// src/hooks/useCalendarYourData.ts
import { useMemo } from "react";
import { formatDateToYMD, isSameDate, timestampToDate } from "@/lib/date";
import { MarkedDateConfig } from "@/types/calendar";

type YourDataItem = {
  id: number;
  // あなたのデータ構造
  createdAt: Date | number;
};

export default function useCalendarYourData(
  items: YourDataItem[],
  selectedDate?: Date
) {
  const markedDates = useMemo(() => {
    const marked: Record<string, MarkedDateConfig> = {};

    items.forEach((item) => {
      const dateKey = formatDateToYMD(
        item.createdAt instanceof Date
          ? item.createdAt
          : timestampToDate(item.createdAt as number)
      );

      marked[dateKey] = {
        marked: true,
        markedColor: "#50cebb",
      };
    });

    return marked;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedDate) {
      return items;
    }

    return items.filter((item) => {
      const createdAtDate =
        item.createdAt instanceof Date
          ? item.createdAt
          : timestampToDate(item.createdAt as number);

      return isSameDate(createdAtDate, selectedDate);
    });
  }, [items, selectedDate]);

  return {
    markedDates,
    filteredItems,
  };
}
```

### 4. コンポーネントの使用

```typescript
import Calendar from "@/components/ui/Calendar";
import useCalendarYourData from "@/hooks/useCalendarYourData";
import { useState } from "react";

export default function YourPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const { markedDates, filteredItems } = useCalendarYourData(
    yourDataItems,
    selectedDate
  );

  return (
    <View>
      <Calendar
        markedDates={markedDates}
        onDayPress={(date) => setSelectedDate(date)}
        selectedDate={selectedDate}
      />
      {/* フィルタリングされたアイテムの表示 */}
    </View>
  );
}
```

## 使用例

### 基本的な使用例

```typescript
import Calendar from "@/components/ui/Calendar";
import { useState } from "react";

export default function BasicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const markedDates = {
    "2024-01-15": { marked: true, markedColor: "#50cebb" },
    "2024-01-20": { marked: true, selected: true, selectedColor: "#00adf5" },
  };

  return (
    <Calendar
      markedDates={markedDates}
      onDayPress={(date) => {
        console.log("選択された日付:", date);
        setSelectedDate(date);
      }}
      selectedDate={selectedDate}
    />
  );
}
```

### 複数の日付をマークする例

```typescript
import Calendar from "@/components/ui/Calendar";
import { formatDateToYMD } from "@/lib/date";

export default function MultipleDatesCalendar() {
  // 複数のイベント日付
  const eventDates = [
    new Date("2024-01-15"),
    new Date("2024-01-20"),
    new Date("2024-01-25"),
  ];

  const markedDates = eventDates.reduce((acc, date) => {
    const dateKey = formatDateToYMD(date);
    acc[dateKey] = {
      marked: true,
      markedColor: "#50cebb",
    };
    return acc;
  }, {} as Record<string, MarkedDateConfig>);

  return (
    <Calendar
      markedDates={markedDates}
      onDayPress={(date) => console.log("選択:", date)}
    />
  );
}
```

### カスタムスタイリングの例

```typescript
import Calendar from "@/components/ui/Calendar";

export default function CustomStyledCalendar() {
  const markedDates = {
    "2024-01-15": {
      marked: true,
      markedColor: "#ff6b6b",
      dots: [
        { color: "#ff6b6b" },
        { color: "#4ecdc4" },
      ],
    },
  };

  return (
    <Calendar
      markedDates={markedDates}
      className="custom-calendar"
      // react-native-calendarsの他のpropsも使用可能
      theme={{
        selectedDayBackgroundColor: "#ff6b6b",
        todayTextColor: "#ff6b6b",
      }}
    />
  );
}
```

## カスタマイズ方法

### テーマのカスタマイズ

`Calendar`コンポーネントは`react-native-calendars`の`theme`プロップをサポートしています。

```typescript
<Calendar
  markedDates={markedDates}
  theme={{
    backgroundColor: "#ffffff",
    calendarBackground: "#f5f5f5",
    selectedDayBackgroundColor: "#your-color",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#your-color",
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#your-color",
    arrowColor: "#your-color",
    monthTextColor: "#2d4150",
  }}
/>
```

### 日付範囲の制限

```typescript
<Calendar
  markedDates={markedDates}
  minDate="2024-01-01" // 最小選択可能日付
  maxDate="2024-12-31" // 最大選択可能日付
/>
```

### カレンダーの無効化

```typescript
<Calendar
  markedDates={markedDates}
  disabled={true} // カレンダー全体を無効化
/>
```

## APIリファレンス

### CalendarProps

| プロパティ     | 型                                 | 必須       | 説明                                                   |
| -------------- | ---------------------------------- | ---------- | ------------------------------------------------------ |
| `markedDates`  | `Record<string, MarkedDateConfig>` | 必須       | マークされた日付のマップ（YYYY-MM-DD形式をキーとする） |
| `onDayPress`   | `(date: Date) => void`             | オプション | 日付が選択された時のコールバック                       |
| `selectedDate` | `Date`                             | オプション | 現在選択されている日付                                 |
| `className`    | `string`                           | オプション | カスタムクラス名                                       |
| `current`      | `string`                           | オプション | カレンダーの表示月を制御（YYYY-MM-DD形式）             |
| `minDate`      | `string`                           | オプション | 最小選択可能日付（YYYY-MM-DD形式）                     |
| `maxDate`      | `string`                           | オプション | 最大選択可能日付（YYYY-MM-DD形式）                     |
| `disabled`     | `boolean`                          | オプション | カレンダーの表示を無効化するかどうか                   |

### MarkedDateConfig

| プロパティ      | 型                                               | 必須       | 説明                     |
| --------------- | ------------------------------------------------ | ---------- | ------------------------ |
| `marked`        | `boolean`                                        | オプション | 日付をマークするかどうか |
| `selected`      | `boolean`                                        | オプション | 選択された日付かどうか   |
| `selectedColor` | `string`                                         | オプション | 選択された日付の背景色   |
| `markedColor`   | `string`                                         | オプション | マークされた日付の背景色 |
| `textColor`     | `string`                                         | オプション | 日付のテキスト色         |
| `dots`          | `Array<{color: string, selectedColor?: string}>` | オプション | カスタムマーカー         |

### 日付ユーティリティ関数

#### `formatDateToYMD(date: Date): string`

DateオブジェクトをYYYY-MM-DD形式の文字列に変換します。

#### `parseYMDToDate(ymd: string): Date`

YYYY-MM-DD形式の文字列をDateオブジェクトに変換します。

#### `isSameDate(date1: Date, date2: Date): boolean`

2つの日付が同じ日かどうかを判定します（時刻は無視）。

#### `timestampToDate(timestamp: number): Date`

タイムスタンプ（秒単位またはミリ秒単位の整数）をDateオブジェクトに変換します。

#### `resetTimeToMidnight(date: Date): Date`

Dateオブジェクトの時刻部分を00:00:00にリセットします。

## トラブルシューティング

### 日付が正しく表示されない

- `createdAt`がDate型ではなくnumber型（timestamp）の場合、`timestampToDate`を使用して変換してください。
- タイムゾーンの問題がある場合は、`resetTimeToMidnight`を使用して時刻をリセットしてください。

### カレンダーが表示されない

- `react-native-calendars`が正しくインストールされているか確認してください。
- NativeWindが正しく設定されているか確認してください。

### 日付のマーキングが反映されない

- `markedDates`のキーがYYYY-MM-DD形式になっているか確認してください。
- `formatDateToYMD`を使用して日付をフォーマットしてください。

### パフォーマンスの問題

- 大量のデータがある場合、`useMemo`を使用してマーキングデータの再計算を最適化してください。
- カスタムフック内で既に`useMemo`を使用しているため、大きな問題はないはずです。

## 注意事項

1. **日付形式の統一**: 常にYYYY-MM-DD形式を使用してください。
2. **タイムスタンプの扱い**: SQLiteのタイムスタンプは秒単位の場合とミリ秒単位の場合があるため、`timestampToDate`を使用してください。
3. **型安全性**: TypeScriptの型定義を活用して、コンパイル時にエラーを検出してください。
4. **パフォーマンス**: 大量のデータがある場合は、適切にメモ化してください。

## 関連ファイル

- `src/components/ui/Calendar.tsx` - カレンダーコンポーネントの実装
- `src/hooks/useCalendarTodos.ts` - TODO用のカスタムフック（参考実装）
- `src/lib/date.ts` - 日付ユーティリティ関数
- `src/types/calendar.ts` - 型定義

## ライセンス

このコンポーネントは、プロジェクトのライセンスに準拠します。
