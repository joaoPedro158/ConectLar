# ConectLar

Aplicativo para conectar clientes e profissionais de serviços de forma rápida, segura e eficiente.

## Funcionalidades
- Cadastro e login de usuários e profissionais
- Feed de propostas e vagas
- Criação de propostas com foto, localização e valor
- Filtros por categoria
- Portfólio de profissionais
- Contraproposta e candidatura
- Notificações sonoras em loop para novas propostas
- Interface responsiva e moderna
- Build PWA e APK Android

## Tecnologias Utilizadas
- React (Vite)
- Capacitor
- Appwrite
- Lucide Icons
- CSS customizado
- Android Studio

## Instalação
```bash
npm install
```

## Build Web
```bash
npm run build
```

## Build Android
```bash
npx cap sync android
npx cap open android
```

## Gerar APK
Abra o projeto no Android Studio e use:
> Build > Build APK(s)

O APK estará em:
android/app/build/outputs/apk/release/app-release.apk

## Estrutura do Projeto
```
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── lib/
│   ├── services/
│   ├── styles/
│   └── App.jsx
├── android/
├── public/
├── assets/
├── package.json
├── vite.config.js
├── capacitor.config.json
```

## Contribuição
- Faça um fork do projeto
- Crie uma branch
- Faça suas alterações
- Envie um Pull Request

## Contato
- Email: seuemail@dominio.com
- GitHub: github.com/seuusuario

---

> Não inclua arquivos confidenciais (.env, key.properties, etc) no repositório.
