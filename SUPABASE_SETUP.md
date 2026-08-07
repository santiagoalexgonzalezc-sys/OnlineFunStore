# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Store Management Simulator.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub or email (free tier is sufficient for development)
4. Verify your email address if required

## Step 2: Create a New Project

1. After logging in, click "New Project"
2. Choose your organization (or create one if needed)
3. Fill in the project details:
   - **Name**: `store-simulator` (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely!)
   - **Region**: Choose a region close to you for better performance
   - **Pricing Plan**: Select "Free" (perfect for development)

4. Click "Create new project"
5. Wait for the project to be created (this may take 1-2 minutes)

## Step 3: Get Your Project Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **API** in the settings menu
3. You'll see several important values:

### Key Information to Copy:

**Project URL**: 
```
https://your-project-ref.supabase.co
```

**Anon Public Key**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Service Role Key** (SECRET - keep this safe!):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Database Connection String**:
```
postgresql://postgres.YOUR_PASSWORD@db.your-project-ref.supabase.co:5432/postgres
```

## Step 4: Set Up Your Environment Variables

1. Copy the `.env.example` file to create your actual `.env` file:
   ```bash
   # In PowerShell
   Copy-Item .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your actual Supabase credentials:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR-PROJECT-REF.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres.YOUR-PROJECT-REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?schema=public"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"
```

### Important Notes:
- Replace `YOUR_PASSWORD` with the database password you set in Step 2
- Replace `YOUR-PROJECT-REF` with your actual project reference (found in Project Settings > API)
- Replace the keys with your actual keys from the API settings
- **NEVER commit the `.env` file** - it's already in `.gitignore`

## Step 5: Configure Database Schema

1. Install Prisma CLI if not already installed:
   ```bash
   npm install -g prisma
   ```

2. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

3. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```
   - When prompted, enter a migration name like `init`
   - This will create all the tables in your Supabase database

4. Seed the database with initial data:
   ```bash
   npm run prisma:seed
   ```

## Step 6: Verify the Setup

1. Check your Supabase dashboard:
   - Go to **Table Editor** in the left sidebar
   - You should see tables like: `User`, `Store`, `Product`, `Supplier`, etc.
   - Click on the `Product` table to see the seeded products

2. Test the connection by running the development server:
   ```bash
   npm run dev
   ```

3. If everything is set up correctly, the app should start without database connection errors.

## Step 7: Set Up Authentication (Optional but Recommended)

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Configure email settings if you want email verification
4. For development, you can disable email confirmation in:
   - Authentication > Settings > Email Auth > Confirm email > Turn off

## Common Issues and Solutions

### Issue: "Connection refused" or "Cannot connect to database"
**Solution**: 
- Verify your DATABASE_URL is correct
- Check that your project is active in Supabase dashboard
- Ensure you're using the correct password

### Issue: "Migration failed"
**Solution**:
- Make sure your DATABASE_URL in .env matches exactly
- Try running `npx prisma db push` instead of migrate
- Check Supabase logs for specific error messages

### Issue: "Prisma client not generated"
**Solution**:
- Run `npm run prisma:generate`
- Make sure @prisma/client is installed

### Issue: CORS errors in browser
**Solution**:
- In Supabase dashboard, go to Project Settings > API
- Add `http://localhost:3000` to allowed origins if needed

## Security Best Practices

1. **Never commit .env files** - They contain sensitive keys
2. **Use environment variables** - Never hardcode credentials
3. **Rotate keys periodically** - Especially if compromised
4. **Use Row Level Security (RLS)** - Enable in Supabase for production
5. **Keep service role key secret** - Only use on server-side

## Next Steps

After setting up Supabase:
1. Test the authentication system
2. Implement the game save/load functionality
3. Connect the game systems to the database
4. Test multiplayer features when ready

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)