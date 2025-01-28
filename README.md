#TIERHELDEN-APP

##Installation

Use the package manager [npm] to install the dependencies.

```bash
npm install
```

Generate prisma schema on your local environment.

```bash
npm run postinstall
```

Syncronize the remote database with your local database.

```bash
npx prisma migrate dev
```

##Update database

update the schema in /prisma/schema.prisma

Generate the schema

```bash
prisma generate
```

Syncronize the remote database with your local database.

```bash
npx prisma migrate dev
```

Upload the changes to GitHub

##Add a .env file

Für die lokale Nutzung der App werden API-Keys benötigt.
Dafür eine .env datei anlegen und folgende Variablen eintragen:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=xxx  
CLERK_SECRET_KEY=xxx  
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in  
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up  
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/  
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

DATABASE_URL=xxx  
UPLOADTHING_SECRET=xxx  
UPLOADTHING_APP_ID=xxx

MUX_TOKEN_ID=xxx  
MUX_TOKEN_SECRET=xxx

STRIPE_API_KEY=(aktuell nicht notwendig)  
NEXT_PUBLIC_APP_URL=http://localhost:3000  
STRIPE_WEBHOOK_SECRET=(aktuell nicht notwendig)

NEXT_PUBLIC_TEACHER_ID=[xxx]
