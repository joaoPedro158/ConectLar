import { Client, Databases, Permission, Role } from 'node-appwrite';

const ENDPOINT = 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = '69ab68b70029335e9551'; 
const API_KEY = 'standard_19f7a541da5666801209132892afdd4171eaac0eaafc69314e6671f79f31142d19cd3ce83fbd053288615d59e205cddd29b66750fc52cf213d0081291cfb549525c8dd1ba73bea051de6150a3bb96ea0b7c9a38c4d3da27d4184f47027afcf1050f148f5ba86b449099a6cdfc8a0f906b0729467fb936ce10cd86d4cdb512627';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const ID_DO_BANCO = '69acc44f001bf1ec07c6';
const colecoes = [
    { id: '69acc450002399ec5385', nome: 'Usuarios' },
    { id: '69acc4550011c28931cd', nome: 'Propostas' },
    { id: '69acc45b000e14689f05', nome: 'Candidaturas' },
    { id: '69acc45e0039053e7592', nome: 'Avaliacoes' }
];

async function updatePermissions() {
    try {
        console.log('🔄 Atualizando permissões de TODAS as coleções...');
        
        for (const col of colecoes) {
            await databases.updateCollection(
                ID_DO_BANCO,
                col.id,
                col.nome,
                [
                    Permission.read(Role.any()),
                    Permission.create(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users())
                ]
            );
            console.log(`✅ Permissões ajustadas para: ${col.nome}`);
        }
        console.log('🎉 Tudo pronto!');
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

updatePermissions();