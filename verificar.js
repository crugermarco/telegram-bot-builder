// verificar.js 
const fs = require('fs'); 
console.log('=== .env VERIFICADO ==='); 
if (fs.existsSync('.env')) { 
  const content = fs.readFileSync('.env', 'utf8'); 
  console.log('? Archivo .env encontrado'); 
  console.log('?? Tama�o:', content.length, 'caracteres'); 
  console.log('?? Primera l�nea con DATABASE_URL:'); 
  const dbLine = content.split('\n').find(l =
  if (dbLine) console.log('   ' + dbLine.substring(0, 70) + '...'); 
} else { 
  console.log('? Archivo .env NO encontrado'); 
} 
