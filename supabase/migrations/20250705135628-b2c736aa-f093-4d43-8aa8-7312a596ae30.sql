
-- Reset the password for the existing user to match our test credentials
-- This will allow you to sign in with kelvin.w.antoine@gmail.com / password123

UPDATE auth.users 
SET encrypted_password = crypt('password123', gen_salt('bf'))
WHERE email = 'kelvin.w.antoine@gmail.com';
