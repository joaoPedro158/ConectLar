# Release Android - ConectLar

## 1. Configurar o Android SDK
Se ainda não estiver configurado, defina o SDK no Android Studio ou crie o arquivo `android/local.properties` com:

sdk.dir=/caminho/para/o/Android/Sdk

## 2. Criar o keystore de release
Na raiz `android/`, gere a chave:

keytool -genkey -v -keystore conectlar-release.jks -alias conectlar -keyalg RSA -keysize 2048 -validity 10000

## 3. Criar o arquivo de credenciais
Copie `android/key.properties.example` para `android/key.properties` e preencha:

- `storeFile`
- `storePassword`
- `keyAlias`
- `keyPassword`

## 4. Atualizar web + Android
Na raiz do projeto:

- `npm run build`
- `npm run android:assets`
- `npm run android:sync`

## 5. Gerar release
### APK
`npm run android:apk`

Saída esperada:
`android/app/build/outputs/apk/release/app-release.apk`

### AAB
`npm run android:aab`

Saída esperada:
`android/app/build/outputs/bundle/release/app-release.aab`

## 6. Abrir no Android Studio
`npm run android:open`
