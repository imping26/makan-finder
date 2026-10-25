# Makan Finder 🍜

马来西亚美食 directory —— Next.js 16 App Router · TypeScript · Drizzle · PostgreSQL

> 规划和进度：[`docs/PLAN.md`](docs/PLAN.md)

## 快速开始

需要 Node.js 20+。

```bash
npm install
cp .env.example .env.local      # 填入 DATABASE_URL
```

**数据库三选一：**

| 选项 | 步骤 |
|---|---|
| Neon（推荐，免费） | neon.tech 建项目 → Connect → 复制 connection string 填进 `.env.local` |
| Supabase（免费） | Project Settings → Database → Connection string |
| 本地 Docker | `docker compose up -d`，然后 `DATABASE_URL="postgres://postgres:postgres@localhost:5432/makan_finder"` |

```bash
npm run db:migrate    # 建表（用 drizzle/ 里已生成好的 migration）
npm run db:seed       # 写入 36 家示范餐厅、6 个用户、~118 条评论
npm run db:studio     # 可选：在浏览器里看数据
npm run dev           # http://localhost:3000
```

## Scripts

| 命令 | 作用 |
|---|---|
| `npm run dev` | 开发服务器 |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript 检查 |
| `npm run lint` | ESLint |
| `npm run db:generate` | 改了 schema 后生成新的 migration |
| `npm run db:migrate` | 执行 migration |
| `npm run db:push` | 原型阶段直接同步 schema（不生成 migration 文件） |
| `npm run db:seed` | 清空并重新写入示范数据 |
| `npm run db:studio` | Drizzle Studio |

## 示范数据

`scripts/seed-data.ts` 里的餐厅**全部是虚构的**（店名、地址都是编的），只用于开发。上线前请换成真实数据，或在网站上标明 sample data。
