import { Client, Account, Databases, Storage, ID } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? 'https://sfo.cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? '69ab68b70029335e9551';

const cliente = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

export const conta = new Account(cliente);
export const bancoDeDados = new Databases(cliente);
export const storage = new Storage(cliente);
export { cliente };
export { ID };

export const ID_DO_BANCO = '69acc44f001bf1ec07c6';
export const ID_COLECAO_USUARIOS = '69acc450002399ec5385';
export const ID_COLECAO_PROPOSTAS = '69acc4550011c28931cd';
export const ID_COLECAO_CANDIDATURAS = '69acc45b000e14689f05';
export const ID_COLECAO_AVALIACOES = '69acc45e0039053e7592';
export const ID_BUCKET_FOTOS = '69ab814c00359feb37b7';
export const ID_BUCKET_IMAGENS_PROBLEMA = '69ab851400380196686a';