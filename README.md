# expo-sqlite-template - Todo管理アプリ

React Native + Expo で構築されたTodo管理アプリケーションです。カレンダー機能と連携し、ローカルSQLiteデータベースを使用してデータを管理します。

## 概要

このプロジェクトは、Expo Routerを使用したファイルベースルーティング、Drizzle ORMによる型安全なデータベース操作、NativeWindによるスタイリングを採用したモダンなReact Nativeアプリケーションです。

### 主な機能

- **Todo管理**: 作成、編集、削除機能
- **カレンダー連携**: Todo作成日をカレンダーに表示
- **日付フィルタリング**: カレンダーから日付を選択してTodoを表示
- **ローカルデータベース**: Expo SQLiteを使用したオフライン対応
- **リアルタイム更新**: データベースの変更を自動反映
- **フォームバリデーション**: React Hook Form + Zodによる入力検証

## 技術スタック

### コアフレームワーク

- **React Native** (0.81.5)
- **Expo** (54.0.22)
- **TypeScript** (5.9.2)
- **Expo Router** (6.0.13) - ファイルベースルーティング

### UI/スタイリング

- **NativeWind** (4.2.1) - Tailwind CSS for React Native
- **React Native Calendars** (1.1313.0) - カレンダーUIコンポーネント

### データベース

- **Expo SQLite** (16.0.9) - ローカルSQLiteデータベース
- **Drizzle ORM** (0.44.7) - 型安全なORM

### フォーム・バリデーション

- **React Hook Form** (7.65.0) - フォーム管理
- **Zod** (4.1.12) - スキーマバリデーション
- **@hookform/resolvers** (5.2.2) - React Hook FormとZodの統合

### 開発ツール

- **Bun** - パッケージマネージャー
- **Biome** - フォーマッター兼リンター
- **Drizzle Kit** (0.31.6) - マイグレーション管理

## セットアップ

### 必要な環境

- Node.js 18以上
- Bun（推奨）またはnpm/yarn
- Expo CLI（グローバルインストール推奨）

### インストール手順

1. **リポジトリのクローン**

```bash
git clone <repository-url>
cd expo-sqlite-template
```

2. **依存関係のインストール**

```bash
bun install
```

または

```bash
npm install
```

3. **開発サーバーの起動**

```bash
bun run start
```

または

```bash
npm start
```

4. **アプリの実行**

開発サーバー起動後、以下の方法でアプリを実行できます：

- **iOS Simulator**: `i` キーを押す、または `bun run ios`
- **Android Emulator**: `a` キーを押す、または `bun run android`
- **Web**: `w` キーを押す、または `bun run web`
- **Expo Go**: スマートフォンでQRコードをスキャン

## プロジェクト構造

```
src/
├── app/                    # Expo Router ページ
│   ├── _layout.tsx        # ルートレイアウト（タブナビゲーション）
│   ├── index.tsx          # Todo一覧ページ
│   ├── calendar.tsx       # カレンダーページ
│   └── global.css         # グローバルスタイル
├── components/             # コンポーネント
│   ├── todo/             # Todo関連コンポーネント
│   │   ├── TodoForm.tsx  # Todo作成フォーム
│   │   └── TodoItem.tsx  # Todoアイテム表示・編集
│   └── ui/               # 汎用UIコンポーネント
│       ├── Button.tsx
│       ├── Calendar.tsx   # 汎用カレンダーコンポーネント
│       └── TextInput.tsx
├── drizzle/               # Drizzle ORM設定
│   ├── db.ts             # データベース接続
│   ├── schema/           # スキーマ定義
│   │   └── todoSchema.ts # Todoテーブルスキーマ
│   └── migrations/       # マイグレーションファイル
├── hooks/                 # カスタムフック
│   └── useCalendarTodos.ts # カレンダー用Todo処理
├── lib/                   # ビジネスロジック
│   ├── todo.ts           # Todo CRUD操作
│   └── date.ts           # 日付ユーティリティ
├── types/                 # TypeScript型定義
│   ├── todo.ts           # Todo型（Zodから生成）
│   └── calendar.ts       # カレンダー型
└── zod/                   # Zodバリデーションスキーマ
    └── todo.schema.ts    # Todoスキーマ定義
```

## 使用方法

### Todoの作成

1. ホーム画面（Todoタブ）で「新規作成」ボタンをタップ
2. モーダルが開いたら、タイトルと説明を入力
3. 「登録」ボタンをタップして保存

### Todoの編集

1. Todoアイテムの「編集」ボタンをタップ
2. インライン編集モードで内容を変更
3. 「保存」ボタンをタップして変更を保存

### Todoの削除

1. Todoアイテムの「削除」ボタンをタップ
2. 確認ダイアログで「削除」を選択

### カレンダー機能の使用

1. 「カレンダー」タブに切り替え
2. Todoが作成された日付がマーキングされています
3. 日付をタップすると、その日のTodoのみが表示されます
4. 「選択解除」ボタンでフィルターを解除

カレンダーコンポーネントを他のプロジェクトに移植する方法については、[カレンダーコンポーネント移行ガイド](./docs/CALENDAR_COMPONENT_MIGRATION.md)を参照してください。

## データベース操作

### マイグレーションの生成

スキーマを変更した後、マイグレーションファイルを生成します：

```bash
bun run db:generate
```

### マイグレーションの実行

マイグレーションはアプリ起動時に自動的に実行されます（`useMigrations`フックを使用）。

## 開発ガイドライン

### コーディング規約

- **ファイルサイズ**: 1ファイルは500行以下に保つ（400行を超えたら分割を検討）
- **関数サイズ**: 関数は30-40行以下に保つ
- **クラスサイズ**: クラスは200行以下に保つ
- **命名規則**:
  - コンポーネント: PascalCase（例: `TodoForm.tsx`）
  - フック: camelCase + `use`プレフィックス（例: `useCalendarTodos.ts`）
  - ユーティリティ: camelCase（例: `todo.ts`）
  - Zodスキーマ: camelCase + `.schema.ts`（例: `todo.schema.ts`）

### アーキテクチャ原則

- **単一責任の原則**: 各ファイル、クラス、関数は1つの責任のみを持つ
- **モジュール設計**: 再利用可能でテスト可能なコードを心がける
- **責務の分離**:
  - `app/`: ルーティングとページコンポーネント
  - `components/`: UIコンポーネント
  - `lib/`: ビジネスロジック
  - `hooks/`: カスタムロジック
  - `providers/`: 状態管理

### 型定義の管理

- Zodスキーマを型定義の単一の情報源として使用
- `z.infer<typeof schema>`を使用して型を生成
- 型定義は`src/types/`に配置

詳細はプロジェクトルール（`.cursor/rules`）を参照してください。

## ドキュメント

このプロジェクトには、以下の詳細なドキュメントが含まれています：

- [Expo SQLite + Drizzle ORM セットアップ手順](./docs/SETUP_EXPO_SQLITE_DRIZZLE.md)
  - Expo SQLiteとDrizzle ORMのセットアップ方法
  - マイグレーションの生成と実行方法
  - データベース操作の例

- [カレンダーコンポーネント移行ガイド](./docs/CALENDAR_COMPONENT_MIGRATION.md)
  - 汎用的なカレンダーコンポーネントの設計思想
  - 他のプロジェクトへの移植手順
  - カスタマイズ方法とAPIリファレンス

## スクリプト

```bash
# 開発サーバーを起動
bun run start

# iOSシミュレーターで起動
bun run ios

# Androidエミュレーターで起動
bun run android

# Webブラウザで起動
bun run web

# データベースマイグレーションを生成
bun run db:generate

# コード品質チェック
bun run lint

# コード整形
bun run format
```

## 設定ファイル

- `app.json` - Expo設定
- `drizzle.config.ts` - Drizzle ORM設定
- `tailwind.config.js` - NativeWind設定
- `tsconfig.json` - TypeScript設定

## 参考リンク

### 公式ドキュメント

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NativeWind](https://www.nativewind.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

### 関連ドキュメント

- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Drizzle ORM - Expo SQLite接続ガイド](https://orm.drizzle.team/docs/connect-expo-sqlite)

## コントリビューション

このプロジェクトへの貢献を歓迎します。以下の点にご注意ください：

1. コードは日本語のコメントで記述してください
2. コミットメッセージは日本語で記述してください
3. プロジェクトのコーディング規約に従ってください

## 謝辞

このプロジェクトは以下のオープンソースライブラリを使用しています：

- Expo
- React Native
- Drizzle ORM
- NativeWind
- React Hook Form
- Zod
- その他、多くの素晴らしいオープンソースプロジェクト

---

**注意**: このプロジェクトは開発中です。プロダクション環境で使用する前に、十分なテストを行ってください。
