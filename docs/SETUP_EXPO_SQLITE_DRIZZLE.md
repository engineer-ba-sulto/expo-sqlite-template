# Expo SQLite + Drizzle ORM セットアップ手順

このドキュメントでは、React Native ExpoプロジェクトでExpo SQLiteとDrizzle ORMをセットアップする手順を説明します。

## 目次

1. [必要なパッケージのインストール](#必要なパッケージのインストール)
2. [Drizzle設定ファイルの作成](#drizzle設定ファイルの作成)
3. [データベース接続ファイルの作成](#データベース接続ファイルの作成)
4. [スキーマ定義の作成](#スキーマ定義の作成)
5. [マイグレーションの生成と実行](#マイグレーションの生成と実行)
6. [使用例](#使用例)

## 参考リンク

- [Expo SQLite ドキュメント](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Drizzle ORM - Expo SQLite接続ガイド](https://orm.drizzle.team/docs/connect-expo-sqlite)
- [Drizzle ORM - Expo SQLite新規プロジェクトセットアップ](https://orm.drizzle.team/docs/get-started/expo-new)
- [Drizzle Kit ドキュメント](https://orm.drizzle.team/kit-docs/overview)
- [Drizzle Kit - Configuration](https://orm.drizzle.team/kit-docs/config-reference)

## 必要なパッケージのインストール

以下のコマンドで必要なパッケージをインストールします。

```bash
bun add drizzle-orm expo-sqlite
bun add -d drizzle-kit
```

### インストールされるパッケージ

- **drizzle-orm**: ORMライブラリ本体
- **expo-sqlite**: Expo用SQLiteライブラリ
- **drizzle-kit**: マイグレーション生成・実行ツール（開発用）

## Drizzle設定ファイルの作成

プロジェクトルートに `drizzle.config.ts` を作成します。

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/drizzle/schema/*",
  out: "./src/drizzle/migrations",
  driver: "expo",
});
```

### 設定項目の説明

- `dialect`: データベースの種類（SQLiteを指定）
- `schema`: スキーマファイルのパス（ワイルドカードで複数ファイルを指定可能）
- `out`: マイグレーションファイルの出力先
- `driver`: Expo環境を使用することを指定

## データベース接続ファイルの作成

`src/drizzle/db.ts` を作成して、データベース接続を初期化します。

```typescript
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as userSchema from "./schema/todoSchema";

const expoDb = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expoDb, { schema: userSchema });

export default db;
```

### ポイント

- `openDatabaseSync`: データベースファイルを開く（同期バージョン）
  - 第一引数: データベースファイル名（例: `"db.db"`）
  - 第二引数: オプション（`enableChangeListener: true` で変更を監視）
- `drizzle`: Drizzle ORMインスタンスを作成
  - 第一引数: SQLiteデータベースインスタンス
  - 第二引数: スキーマオブジェクトを指定（型推論とリレーションに使用）

## スキーマ定義の作成

`src/drizzle/schema/` ディレクトリにスキーマファイルを作成します。

### 例: `src/drizzle/schema/todoSchema.ts`

```typescript
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todoTable = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
```

### スキーマ定義のポイント

- `sqliteTable`: SQLiteテーブルを定義
  - 第一引数: テーブル名
  - 第二引数: カラム定義オブジェクト
- カラム型:
  - `integer`: 整数型
  - `text`: テキスト型
- オプション:
  - `primaryKey({ autoIncrement: true })`: 自動増分の主キー
  - `notNull()`: NOT NULL制約
  - `default()`: デフォルト値
  - `{ mode: "timestamp" }`: 整数をタイムスタンプとして扱う

## マイグレーションの生成と実行

### 1. マイグレーションファイルの生成

スキーマを変更した後、マイグレーションファイルを生成します。

```bash
bun run db:generate
```

このコマンドは `drizzle-kit generate` を実行し、`src/drizzle/migrations/` にマイグレーションファイルを生成します。

### 2. マイグレーションの実行（実行時）

アプリのルートコンポーネントで`useMigrations`フックを使用してマイグレーションを実行します。
また、`useLiveQuery`フックを使用してデータベースの変更を監視します。
データベースの変更を監視することで、データベースの変更をリアルタイムで取得できます。

```typescript
import db from "@/drizzle/db";
import migrations from "@/drizzle/migrations/migrations";
import { todoTable } from "@/drizzle/schema/todoSchema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Text, View } from "react-native";

export default function Index() {
  const { success, error } = useMigrations(db, migrations);
  const { data } = useLiveQuery(db.select().from(todoTable));

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Text>Data:{JSON.stringify(data)}</Text>
    </View>
  );
}
```

#### ポイント

- `useMigrations`: Expo SQLite専用のマイグレーションフック
- `useLiveQuery`: データベースの変更を監視するフック
- `migrations`: `src/drizzle/migrations`からインポート（自動生成される）
- `success`: マイグレーションが完了したかどうか
- `error`: マイグレーションエラーがある場合

## package.json のスクリプト設定

以下のスクリプトが `package.json` に定義されている必要があります。

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate"
  }
}
```

## 使用例

### データベースへのクエリ実行

```typescript
import db from "@/drizzle/db";
import { todoTable } from "@/drizzle/schema/todoSchema";
import { eq } from "drizzle-orm";

// 全件取得
const allTodos = await db.select().from(todoTable);

// 条件指定で取得
const todo = await db.select().from(todoTable).where(eq(todoTable.id, 1));

// 新規作成
const newTodo = await db
  .insert(todoTable)
  .values({
    title: "新しいタスク",
    description: "タスクの説明",
  })
  .returning();

// 更新
await db
  .update(todoTable)
  .set({ title: "更新されたタイトル" })
  .where(eq(todoTable.id, 1));

// 削除
await db.delete(todoTable).where(eq(todoTable.id, 1));
```

## ディレクトリ構造

セットアップ後の推奨ディレクトリ構造は以下の通りです。

```
src/
└── drizzle/
    ├── db.ts                    # データベース接続ファイル
    ├── schema/                  # スキーマ定義
    │   ├── todoSchema.ts
    │   └── ...
    └── migrations/              # マイグレーションファイル
        ├── migrations.js        # マイグレーション読み込み用
        ├── 0000_*.sql          # マイグレーションSQLファイル
        └── meta/                # メタデータ
            ├── _journal.json
            └── 0000_snapshot.json
```

## 注意事項

1. **マイグレーションファイル**: Expo SQLiteを使用する場合、`migrations.js` ファイルが必要です。このファイルは `drizzle-kit generate` によって自動生成されます。

2. **データベースファイルの場所**: `openDatabaseSync` で開いたデータベースファイルは、アプリのローカルストレージに保存されます。

3. **型安全性**: スキーマを定義することで、TypeScriptの型推論が効きます。クエリの際に型チェックが働きます。

4. **変更の監視**: `enableChangeListener: true` を指定することで、データベースの変更を監視できます。

5. **マイグレーション実行**: Expo SQLiteでは`drizzle-kit migrate`コマンドは使用できません。必ずアプリ起動時に`useMigrations`フックを使用して実行時マイグレーションを実行してください。
