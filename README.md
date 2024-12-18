TIERHELDEN-APP

für die Benutzung der App werden API-Keys benötigt.
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

NEXT_PUBLIC_TEACHER_ID=xxx
