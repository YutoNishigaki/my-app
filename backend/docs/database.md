# Prisma によるデータベース接続

## セットアップ
1. `.env.example` を `.env` にコピーし、必要に応じて `DATABASE_URL` を変更してください。
2. Prisma クライアントを生成します。
   ```bash
   npm run prisma:generate
   ```
3. スキーマをデータベースへ適用します（SQLite では `prisma/dev.db` が自動作成されます）。
   ```bash
   npm run prisma:migrate
   ```

## SQLite から PostgreSQL への切り替え
- `prisma/schema.prisma` 内の `datasource db` の `provider` を `postgresql` に変更し、`DATABASE_URL` を PostgreSQL の接続文字列に更新してください。
- 既存のデータを移行する場合は、新しいデータベースで `npm run prisma:migrate` を実行し、必要に応じてデータ移行ツールを利用してください。
- Prisma は環境変数で接続先を切り替えられるため、CI/CD では `DATABASE_URL` を環境ごとに設定してください。
