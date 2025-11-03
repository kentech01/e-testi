# Supabase Storage Setup Guide

## Problem

You're getting a `403 Unauthorized` error with message "new row violates row-level security policy" when trying to upload files.

## Solution

Since you're using **Firebase Auth** (not Supabase Auth), you need to configure Supabase Storage RLS (Row Level Security) policies to allow public/anonymous uploads.

## Steps to Fix

### Option 1: Allow Public Uploads (Recommended for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click on your bucket: **`e-testi-bucket`**
5. Go to the **Policies** tab
6. Click **New Policy** → **Create policy from scratch** (or use the template)

#### Create Upload Policy (INSERT)

- **Policy Name:** `Allow public uploads`
- **Allowed Operation:** `INSERT`
- **Target Roles:** `anon`, `authenticated`
- **Policy Definition (USING expression):** Leave empty or use:
  ```sql
  true
  ```
- **Policy Definition (WITH CHECK expression):** Leave empty or use:
  ```sql
  true
  ```

#### Create Read Policy (SELECT)

- **Policy Name:** `Allow public read`
- **Allowed Operation:** `SELECT`
- **Target Roles:** `anon`, `authenticated`
- **Policy Definition (USING expression):**
  ```sql
  true
  ```

#### Create Delete Policy (DELETE) - Optional

- **Policy Name:** `Allow public delete`
- **Allowed Operation:** `DELETE`
- **Target Roles:** `authenticated` (more restrictive)
- **Policy Definition (USING expression):**
  ```sql
  true
  ```

### Option 2: Using SQL Editor (Faster)

1. Go to **SQL Editor** in Supabase Dashboard
2. Run these commands:

```sql
-- Allow anonymous users to upload files
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'e-testi-bucket');

-- Allow anonymous users to read files
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'e-testi-bucket');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'e-testi-bucket');
```

### Option 3: Make Bucket Public (Less Secure)

1. Go to **Storage** → **Buckets**
2. Click on **`e-testi-bucket`**
3. Toggle **Public bucket** to ON
4. This automatically allows public read access, but you still need INSERT policies

## Verify Setup

After configuring policies, try uploading an image again from your app. The upload should succeed.

## Security Notes

- ⚠️ **Public uploads** mean anyone can upload files to your bucket. For production, consider:
  - File size limits (configure in bucket settings)
  - File type restrictions (validate in your code)
  - Rate limiting
  - Or create a backend endpoint that handles uploads with service role key

## Alternative: Backend Upload Endpoint

For production apps, it's recommended to:

1. Create a backend API endpoint (Express, etc.)
2. Use Supabase **Service Role Key** (never expose in client!)
3. Backend handles uploads with service role key
4. Returns public URL to frontend

This gives you full control over upload validation and security.
