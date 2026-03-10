import fs from 'node:fs';

const txt = fs.readFileSync('setup_db.js', 'utf8');
const marker = "const API_KEY = '";
const start = txt.indexOf(marker);
if (start < 0) {
  console.error('❌ API_KEY não encontrada em setup_db.js');
  process.exit(1);
}
const from = start + marker.length;
const end = txt.indexOf("';", from);
if (end < 0) {
  console.error('❌ Fim da API_KEY não encontrado em setup_db.js');
  process.exit(1);
}

process.env.APPWRITE_API_KEY = txt.slice(from, end);

await import('./update_schema.js');
