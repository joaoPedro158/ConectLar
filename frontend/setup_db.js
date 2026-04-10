import { Client, Databases, ID } from 'node-appwrite';

// Configurações baseadas nos dados que você enviou
const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = '69ab68b70029335e9551'; // Retirado do seu arquivo appwrite.js
const API_KEY = 'standard_19f7a541da5666801209132892afdd4171eaac0eaafc69314e6671f79f31142d19cd3ce83fbd053288615d59e205cddd29b66750fc52cf213d0081291cfb549525c8dd1ba73bea051de6150a3bb96ea0b7c9a38c4d3da27d4184f47027afcf1050f148f5ba86b449099a6cdfc8a0f906b0729467fb936ce10cd86d4cdb512627';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// Função para pausar (Appwrite precisa de um tempinho entre a criação de atributos)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function setupDatabase() {
    try {
        console.log('🔄 Iniciando criação do banco de dados ConectLar...');

        // 1. Cria o Banco de Dados
        const db = await databases.create(ID.unique(), 'ConectLarDB');
        const dbId = db.$id;
        console.log(`✅ Banco de Dados criado! ID: ${dbId}`);

        // ==========================================
        // COLEÇÃO: USUÁRIOS
        // ==========================================
        const colUsuarios = await databases.createCollection(dbId, ID.unique(), 'Usuarios');
        console.log(`✅ Coleção 'Usuarios' criada! ID: ${colUsuarios.$id}`);
        
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'nome', 100, true);
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'email', 100, true);
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'telefone', 20, true);
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'tipoPerfil', 20, true); // USUARIO ou PROFISSIONAL
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'categoria', 50, false); 
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'foto', 500, false);
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'fotoFileId', 50, false);
        await databases.createStringAttribute(dbId, colUsuarios.$id, 'portfolioFileIds', 5000, false);
        await databases.createFloatAttribute(dbId, colUsuarios.$id, 'mediaAvaliacoes', false, 0, 5, 0);
        await databases.createDatetimeAttribute(dbId, colUsuarios.$id, 'dataCriacao', true);
        await sleep(2000);

        // ==========================================
        // COLEÇÃO: PROPOSTAS
        // ==========================================
        const colPropostas = await databases.createCollection(dbId, ID.unique(), 'Propostas');
        console.log(`✅ Coleção 'Propostas' criada! ID: ${colPropostas.$id}`);

        await databases.createStringAttribute(dbId, colPropostas.$id, 'clienteId', 50, true);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'profissionalAceitoId', 50, false);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'titulo', 150, true);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'descricao', 1000, true);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'itensLista', 2000, false);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'categoria', 50, true);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'localizacao', 200, true);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'enderecoCompleto', 500, false);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'telefoneContato', 30, false);
        await databases.createFloatAttribute(dbId, colPropostas.$id, 'valorEstimado', true);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'imagemProblemaUrl', 500, false);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'imagemProblemaFileId', 50, false);
        await databases.createStringAttribute(dbId, colPropostas.$id, 'status', 20, true); // ABERTO, EM_ESPERA, EM_ANDAMENTO, CONCLUIDO, CANCELADO
        await databases.createDatetimeAttribute(dbId, colPropostas.$id, 'dataCriacao', true);
        await sleep(2000);

        // ==========================================
        // COLEÇÃO: CANDIDATURAS
        // ==========================================
        const colCandidaturas = await databases.createCollection(dbId, ID.unique(), 'Candidaturas');
        console.log(`✅ Coleção 'Candidaturas' criada! ID: ${colCandidaturas.$id}`);

        await databases.createStringAttribute(dbId, colCandidaturas.$id, 'propostaId', 50, true);
        await databases.createStringAttribute(dbId, colCandidaturas.$id, 'profissionalId', 50, true);
        await databases.createFloatAttribute(dbId, colCandidaturas.$id, 'valorProposto', false);
        await databases.createStringAttribute(dbId, colCandidaturas.$id, 'status', 20, true); // PENDENTE, ACEITO, RECUSADO
        await databases.createDatetimeAttribute(dbId, colCandidaturas.$id, 'dataCandidatura', true);
        await sleep(2000);

        // ==========================================
        // COLEÇÃO: AVALIAÇÕES
        // ==========================================
        const colAvaliacoes = await databases.createCollection(dbId, ID.unique(), 'Avaliacoes');
        console.log(`✅ Coleção 'Avaliacoes' criada! ID: ${colAvaliacoes.$id}`);

        await databases.createStringAttribute(dbId, colAvaliacoes.$id, 'propostaId', 50, true);
        await databases.createStringAttribute(dbId, colAvaliacoes.$id, 'clienteId', 50, true);
        await databases.createStringAttribute(dbId, colAvaliacoes.$id, 'profissionalId', 50, true);
        await databases.createIntegerAttribute(dbId, colAvaliacoes.$id, 'nota', true, 1, 5);
        await databases.createStringAttribute(dbId, colAvaliacoes.$id, 'comentario', 500, false);
        await databases.createDatetimeAttribute(dbId, colAvaliacoes.$id, 'dataAvaliacao', true);

        console.log('\n🎉 SUCESSO! Banco de dados estruturado.');
        console.log('====================================================');
        console.log('Cole essas constantes no seu arquivo `src/servicos/appwrite.js`:');
        console.log('====================================================');
        console.log(`export const ID_DO_BANCO = '${dbId}';`);
        console.log(`export const ID_COLECAO_USUARIOS = '${colUsuarios.$id}';`);
        console.log(`export const ID_COLECAO_PROPOSTAS = '${colPropostas.$id}';`);
        console.log(`export const ID_COLECAO_CANDIDATURAS = '${colCandidaturas.$id}';`);
        console.log(`export const ID_COLECAO_AVALIACOES = '${colAvaliacoes.$id}';`);

    } catch (error) {
        console.error('❌ Erro ao configurar banco de dados:', error.message);
    }
}

setupDatabase();