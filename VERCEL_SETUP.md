# Vercel Deployment Setup Guide

Este guia explica como deployar a SegundaVoz no Vercel com PostgreSQL.

## ⚠️ Importante: SQLite não funciona em Vercel

O projeto usa SQLite localmente (`prisma/dev.db`), mas **Vercel tem filesystem efêmero**. Dados serão perdidos a cada deploy. **Use PostgreSQL em produção**.

## Passo 1: Criar PostgreSQL Database

Escolha uma das opções:

### Opção A: Vercel Postgres (Recomendado)
1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Vá para a aba **"Storage"**
3. Clique **"Create Database"** → Postgres
4. Copie a string de conexão (DATABASE_URL)

### Opção B: Railway
1. Acesse [railway.app](https://railway.app)
2. Crie novo projeto → PostgreSQL plugin
3. Copie DATABASE_URL

### Opção C: Neon
1. Acesse [neon.tech](https://neon.tech)
2. Crie novo projeto
3. Copie DATABASE_URL

### Opção D: PlanetScale (MySQL, alternativa)
1. Acesse [planetscale.com](https://planetscale.com)
2. Crie novo banco MySQL
3. Copie DATABASE_URL

## Passo 2: Gerar Variáveis Necessárias

### NEXTAUTH_SECRET
```bash
openssl rand -base64 32
# ou no Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Guarde o valor gerado.

## Passo 3: Configurar Vercel

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para **Settings** → **Environment Variables**
3. Adicione as variáveis:

| Variável | Valor | Exemplo |
|----------|-------|---------|
| `DATABASE_URL` | String PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Gerado no Passo 2 | `abc123...xyz==` |
| `NEXTAUTH_URL` | URL do Vercel | `https://segundavoz.vercel.app` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `seu-email@gmail.com` |
| `EMAIL_PASSWORD` | App password | `abc def ghi jkl` |

**Nota**: Para Stripe e Email, deixe em branco por enquanto se não tiver configurado. O app funcionará sem eles (alguns recursos desativados).

## Passo 4: Deploy

1. Vercel detectará automaticamente Next.js
2. O script de build rodará:
   ```bash
   prisma generate && prisma migrate deploy && next build
   ```
3. Database será inicializada automaticamente ✅

## Passo 5: Seed (Opcional)

Para popular dados de exemplo, use o seed script:

```bash
npm run seed  # Local
```

Vercel não roda seed automaticamente em produção. Para popular dados em produção, acesse `https://seu-app.vercel.app/api/seed` (você pode criar um endpoint para isso, por enquanto pule).

## Verificação Pós-Deploy

1. Acesse `https://seu-app.vercel.app`
2. Tente criar conta / fazer login
3. Verifique que pode criar casos

## Troubleshooting

| Erro | Solução |
|------|---------|
| "P3005" | Migrations não encontradas → certifique que `prisma/migrations/` está no git |
| "Connection refused" | DATABASE_URL errada ou banco offline → verifique em Vercel dashboard |
| "NEXTAUTH_SECRET not found" | Variável não configurada em Vercel → adicione em Settings |
| "Stripe error" | Chaves de teste/produção incorretas → verifique Dashboard |

## Local Development (com Vercel Postgres)

Se quiser testar localmente com o mesmo banco Vercel:

1. Copie DATABASE_URL de Vercel
2. Cole em `.env.local`:
   ```env
   DATABASE_URL="postgresql://..."
   ```
3. Rode:
   ```bash
   npm run dev
   ```

## Pro Tips

- Use [Prisma Studio](https://www.prisma.io/studio) para gerenciar dados:
  ```bash
  npx prisma studio
  ```
- Monitore logs em Vercel Dashboard → **Deployments** → **Logs**
- Use Vercel Postgres Dashboard para backups automáticos

## Suporte

- Prisma: https://www.prisma.io/docs
- Vercel: https://vercel.com/docs
- NextAuth: https://next-auth.js.org/getting-started
