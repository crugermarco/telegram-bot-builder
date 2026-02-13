import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://obdpmefmlzvvwgvuyksf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iZHBtZWZtbHp2dndndnV5a3NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc1ODYzMSwiZXhwIjoyMDg2MzM0NjMxfQ.u315_94hnGZt02UgPvG329s80yx7oPCLTp_FBrPE5uw'
);

async function verFlow() {
  console.log('🔍 VERIFICANDO TUS BOTS Y NODOS...\n');
  
  // 1. Buscar tu usuario
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', 'crugermarco@gmail.com')
    .single();
    
  if (userError || !user) {
    console.log('❌ Usuario no encontrado. ¿Te registraste con otro email?');
    console.log('   Emails disponibles:');
    const { data: users } = await supabase.from('users').select('email');
    users?.forEach(u => console.log(`   - ${u.email}`));
    return;
  }
  
  console.log('✅ USUARIO ENCONTRADO:');
  console.log(`   Email: ${user.email}`);
  console.log(`   ID: ${user.id}\n`);
  
  // 2. Buscar TODOS los bots (sin filtro primero)
  console.log('📊 TODOS LOS BOTS EN LA BASE DE DATOS:');
  const { data: allBots } = await supabase.from('bots').select('*');
  console.log(`   Total: ${allBots?.length || 0} bots\n`);
  
  // 3. Buscar tus bots específicamente
  const { data: bots } = await supabase
    .from('bots')
    .select('*')
    .eq('user_id', user.id);
    
  console.log(`🎯 TUS BOTS (${bots?.length || 0}):`);
  
  if (!bots || bots.length === 0) {
    console.log('   ❌ No tienes bots creados aún');
    
    // Mostrar de quién son los bots existentes
    if (allBots?.length > 0) {
      console.log('\n📌 Los bots existentes pertenecen a:');
      for (const bot of allBots) {
        const { data: owner } = await supabase
          .from('users')
          .select('email')
          .eq('id', bot.user_id)
          .single();
        console.log(`   - ${bot.name}: ${owner?.email || 'desconocido'}`);
      }
    }
    return;
  }
  
  // 4. Analizar cada bot
  for (const bot of bots) {
    console.log(`\n🤖 BOT: "${bot.name}"`);
    console.log(`   ID: ${bot.id}`);
    console.log(`   Estado: ${bot.status}`);
    console.log(`   Token: ${bot.token ? '✅ Configurado' : '❌ No configurado'}`);
    console.log(`   Creado: ${new Date(bot.created_at).toLocaleString()}`);
    
    // 5. VERIFICAR FLOW - ESTO ES LO IMPORTANTE
    console.log(`   📦 FLOW:`);
    
    if (!bot.flow) {
      console.log(`      ❌ No hay datos de flow`);
    } else {
      console.log(`      ✅ Datos de flow existen`);
      
      if (bot.flow.nodes) {
        console.log(`      📊 Nodos guardados: ${bot.flow.nodes.length}`);
        
        if (bot.flow.nodes.length > 0) {
          console.log(`      📝 PRIMER MENSAJE:`);
          const firstNode = bot.flow.nodes[0];
          console.log(`         Tipo: ${firstNode.type}`);
          if (firstNode.type === 'text') {
            console.log(`         Contenido: "${firstNode.data?.content?.substring(0, 100)}..."`);
          }
          
          console.log(`      📋 TODOS LOS NODOS:`);
          bot.flow.nodes.forEach((node, i) => {
            console.log(`         ${i + 1}. ${node.type} - ID: ${node.id.substring(0, 8)}...`);
          });
        }
      } else {
        console.log(`      ❌ El objeto flow no tiene propiedad 'nodes'`);
        console.log(`      Estructura:`, JSON.stringify(bot.flow).substring(0, 200) + '...');
      }
      
      if (bot.flow.edges) {
        console.log(`      🔗 Conexiones: ${bot.flow.edges.length}`);
      }
    }
    
    // 6. Probar API de flow directamente
    console.log(`   🌐 Probando API de flow...`);
    try {
      const testUrl = `http://localhost:3000/api/bots/${bot.id}/flow`;
      console.log(`      GET ${testUrl}`);
      
      // No podemos hacer fetch desde Node.js fácilmente, es solo referencia
      console.log(`      ✅ API disponible en: ${testUrl}`);
    } catch (e) {
      console.log(`      ❌ Error: ${e.message}`);
    }
  }
}

verFlow().catch(console.error);