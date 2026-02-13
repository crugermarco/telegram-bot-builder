// check-env.js
console.log('=== VERIFICANDO VARIABLES SUPABASE ===');
console.log('1. DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌');
console.log('2. SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
console.log('3. SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌');
console.log('4. SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
console.log('5. NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅' : '❌');

if (process.env.DATABASE_URL) {
  console.log('\n📦 DATABASE_URL (solo inicio):', process.env.DATABASE_URL.substring(0, 30) + '...');
}
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.log('🌐 SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
}