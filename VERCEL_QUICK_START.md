# ⚡ VERCEL QUICK START (5 minutos)

**Seu código está pronto, mas precisa configurar PostgreSQL. Siga estes passos:**

## 1️⃣ Criar PostgreSQL (2 minutos)

### Opção Recomendada: Vercel Postgres
1. Acesse: https://vercel.com/dashboard
2. Clique em seu projeto
3. Aba **"Storage"** no topo
4. **"Create Database"** → Postgres → Create
5. **Copie a string** que aparecer no campo `POSTGRES_PRISMA_URL`

### Alternativa: Railway (ainda mais fácil)
1. Acesse: https://railway.app
2. New Project → PostgreSQL
3. Copie DATABASE_URL

## 2️⃣ Configurar Vercel (2 minutos)

1. No seu projeto Vercel, vá para **Settings**
2. Abra **Environment Variables**
3. **Adicione uma variável:**
   - Nome: `DATABASE_URL`
   - Value: Cole a string que copiou acima
   - ✅ Clique Save

**OBS**: Se usou Vercel Postgres, a string já tem nome `POSTGRES_PRISMA_URL`. Basta renomear para `DATABASE_URL`.

## 3️⃣ Gerar NEXTAUTH_SECRET (1 minuto)

Cole no PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado (sem quebras de linha).

**Volte para Vercel e adicione:**
- Nome: `NEXTAUTH_SECRET`
- Value: Cole o resultado acima
- ✅ Save

## 4️⃣ Configurar URL (1 minuto)

**Adicione mais uma variável:**
- Nome: `NEXTAUTH_URL`
- Value: `https://seu-dominio-vercel.vercel.app` (Vercel vai mostrar qual é)
- ✅ Save

## 5️⃣ Redeploy ✨

1. Volte para **Deployments**
2. Clique no último deploy
3. **Redeploy** (botão no canto superior direito)

Aguarde 2-3 minutos. Se der verde ✅, está funcionando!

## ✅ Pronto?

Acesse `https://seu-dominio.vercel.app` e teste!

---

## 🆘 Deu erro?

### "DATABASE_URL not set"
- Você esqueceu de adicionar a variável em Vercel
- Volte ao passo 2️⃣ acima

### "Cannot connect to database"
- DATABASE_URL está errada
- Copie novamente e verifique sem espaços extras

### "NEXTAUTH_SECRET is missing"
- Faltou adicionar no passo 3️⃣

## 📚 Mais detalhes?

Veja `VERCEL_SETUP.md` para guia completo.
