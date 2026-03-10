# React starter kit with Appwrite

Kickstart your React development with this ready-to-use starter project integrated with [Appwrite](https://www.appwrite.io)

## 🚀Getting started

###
Clone the Project
Clone this repository to your local machine using Git:

`git clone https://github.com/appwrite/starter-for-react`

## 🛠️ Development guid
1. **Configure Appwrite**<br/>
   Navigate to `.env` and update the values to match your Appwrite project credentials.
   If you don't have it yet, copy `.env.example` to `.env`.
2. **Customize as needed**<br/>
   Modify the starter kit to suit your app's requirements. Adjust UI, features, or backend
   integrations as per your needs.
3. **Install dependencies**<br/>
   Run `npm install` to install all dependencies.
4. **Run the app**<br/>
   Start the project by running `npm run dev`.

## 📱 Open on mobile (same Wi‑Fi)
1. Run `npm run dev`.
2. Find your computer IP (example: `192.168.0.20`).
3. Open on the phone browser: `http://192.168.0.20:5173`.
4. In the Appwrite Console, add a **Web platform** for your project with the origin:
   - `http://192.168.0.20:5173`
   (Keep `http://localhost:5173` too for desktop dev.)

If you're self-hosting Appwrite locally, make sure your phone can reach the Appwrite endpoint too
(it cannot access your PC's `localhost`).

## 💡 Additional notes
- This starter project is designed to streamline your React development with Appwrite.
- Refer to the [Appwrite documentation](https://appwrite.io/docs) for detailed integration guidance.