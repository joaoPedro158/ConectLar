import { Client, Databases } from 'node-appwrite';

// Defaults puxados do seu app (src/servicos/appwrite.js)
const DEFAULTS = {
  APPWRITE_ENDPOINT: 'https://sfo.cloud.appwrite.io/v1',
  APPWRITE_PROJECT_ID: '69ab68b70029335e9551',
  APPWRITE_DB_ID: '69acc44f001bf1ec07c6',
  APPWRITE_COL_USUARIOS: '69acc450002399ec5385',
  APPWRITE_COL_PROPOSTAS: '69acc4550011c28931cd',
  APPWRITE_COL_CANDIDATURAS: '69acc45b000e14689f05'
};

const envOrDefault = (name) => process.env[name] || DEFAULTS[name] || '';

const requiredEnv = (name) => {
  const value = envOrDefault(name);
  if (!value) throw new Error(`Faltando variável de ambiente: ${name}`);
  return value;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const extrairAtributoDesconhecido = (mensagem) => {
  const texto = String(mensagem || '');
  const m = texto.match(/Unknown attribute:\s*"([^"]+)"/i);
  return m?.[1] || '';
};

async function listKeys(databases, dbId, colId) {
  try {
    const resp = await databases.listAttributes(dbId, colId);
    const attrs = resp?.attributes || [];
    return new Set(attrs.map((a) => a.key).filter(Boolean));
  } catch (err) {
    throw new Error(
      `Não foi possível listar atributos da coleção ${colId}. ` +
        `Verifique permissões da API Key. Erro: ${err?.message || err}`
    );
  }
}

async function ensureAttribute({ databases, dbId, colId, existingKeys, key, createFn, sleepMs = 1200 }) {
  if (existingKeys.has(key)) {
    console.log(`ℹ️  Já existe: ${colId}.${key}`);
    return;
  }

  try {
    await createFn();
    console.log(`✅ Criado: ${colId}.${key}`);
    existingKeys.add(key);
    await sleep(sleepMs);
  } catch (err) {
    const unknown = extrairAtributoDesconhecido(err?.message);
    console.error(`❌ Falhou ao criar ${colId}.${key}: ${err?.message || err}`);
    if (unknown) {
      console.error(`   (Appwrite reclamou de atributo desconhecido: ${unknown})`);
    }
    throw err;
  }
}

async function main() {
  const endpoint = envOrDefault('APPWRITE_ENDPOINT') || requiredEnv('APPWRITE_ENDPOINT');
  const projectId = envOrDefault('APPWRITE_PROJECT_ID') || requiredEnv('APPWRITE_PROJECT_ID');
  const apiKey = requiredEnv('APPWRITE_API_KEY');

  const dbId = envOrDefault('APPWRITE_DB_ID') || requiredEnv('APPWRITE_DB_ID');
  const colUsuarios = envOrDefault('APPWRITE_COL_USUARIOS') || requiredEnv('APPWRITE_COL_USUARIOS');
  const colPropostas = envOrDefault('APPWRITE_COL_PROPOSTAS') || requiredEnv('APPWRITE_COL_PROPOSTAS');
  const colCandidaturas =
    envOrDefault('APPWRITE_COL_CANDIDATURAS') || requiredEnv('APPWRITE_COL_CANDIDATURAS');

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const databases = new Databases(client);

  console.log('🔄 Atualizando schema do Appwrite (sem recriar banco)...');

  // ===== Usuarios =====
  console.log('\n== Coleção Usuarios ==');
  const usuarioKeys = await listKeys(databases, dbId, colUsuarios);

  await ensureAttribute({
    databases,
    dbId,
    colId: colUsuarios,
    existingKeys: usuarioKeys,
    key: 'categoria',
    createFn: () => databases.createStringAttribute(dbId, colUsuarios, 'categoria', 50, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colUsuarios,
    existingKeys: usuarioKeys,
    key: 'mediaAvaliacoes',
    createFn: () => databases.createFloatAttribute(dbId, colUsuarios, 'mediaAvaliacoes', false, 0, 5, 0)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colUsuarios,
    existingKeys: usuarioKeys,
    key: 'localizacao',
    createFn: () => databases.createStringAttribute(dbId, colUsuarios, 'localizacao', 200, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colUsuarios,
    existingKeys: usuarioKeys,
    key: 'foto',
    createFn: () => databases.createStringAttribute(dbId, colUsuarios, 'foto', 500, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colUsuarios,
    existingKeys: usuarioKeys,
    key: 'fotoFileId',
    createFn: () => databases.createStringAttribute(dbId, colUsuarios, 'fotoFileId', 50, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colUsuarios,
    existingKeys: usuarioKeys,
    key: 'portfolioFileIds',
    createFn: () => databases.createStringAttribute(dbId, colUsuarios, 'portfolioFileIds', 5000, false)
  });

  // ===== Propostas =====
  console.log('\n== Coleção Propostas ==');
  const propostaKeys = await listKeys(databases, dbId, colPropostas);

  await ensureAttribute({
    databases,
    dbId,
    colId: colPropostas,
    existingKeys: propostaKeys,
    key: 'localizacao',
    createFn: () => databases.createStringAttribute(dbId, colPropostas, 'localizacao', 200, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colPropostas,
    existingKeys: propostaKeys,
    key: 'enderecoCompleto',
    createFn: () => databases.createStringAttribute(dbId, colPropostas, 'enderecoCompleto', 500, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colPropostas,
    existingKeys: propostaKeys,
    key: 'telefoneContato',
    createFn: () => databases.createStringAttribute(dbId, colPropostas, 'telefoneContato', 30, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colPropostas,
    existingKeys: propostaKeys,
    key: 'imagemProblemaUrl',
    createFn: () => databases.createStringAttribute(dbId, colPropostas, 'imagemProblemaUrl', 500, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colPropostas,
    existingKeys: propostaKeys,
    key: 'imagemProblemaFileId',
    createFn: () => databases.createStringAttribute(dbId, colPropostas, 'imagemProblemaFileId', 50, false)
  });

  await ensureAttribute({
    databases,
    dbId,
    colId: colPropostas,
    existingKeys: propostaKeys,
    key: 'itensLista',
    createFn: () => databases.createStringAttribute(dbId, colPropostas, 'itensLista', 2000, false)
  });

  // ===== Candidaturas =====
  console.log('\n== Coleção Candidaturas ==');
  const candidaturaKeys = await listKeys(databases, dbId, colCandidaturas);

  await ensureAttribute({
    databases,
    dbId,
    colId: colCandidaturas,
    existingKeys: candidaturaKeys,
    key: 'valorProposto',
    createFn: () => databases.createFloatAttribute(dbId, colCandidaturas, 'valorProposto', false)
  });

  console.log('\n🎉 Schema atualizado com sucesso.');
}

main().catch((err) => {
  console.error('\n❌ Erro na atualização do schema:', err?.message || err);
  process.exit(1);
});
