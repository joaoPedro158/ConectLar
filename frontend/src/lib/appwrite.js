import { Client, Account, Databases } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? "https://sfo.cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "69ab68b70029335e9551";

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
