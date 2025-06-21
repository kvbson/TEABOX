## 🚀 Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env` file**

   Copy the example file and edit it:

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and update the values as needed.

3. **Generate local HTTPS certificates**

   ```bash
   npx tsx api/certs/run.ts
   ```

4. **Install local certificates**

   - Locate the generated certs in `api/certs/`
   - Install them on your system to allow HTTPS on `localhost`
   - ⚠️ *Instructions vary by OS — for example:*
     - **macOS**: double-click `.crt` to add to Keychain Access
     - **Windows**: right-click and choose "Install Certificate"

5. **Build the project**

   ```bash
   npm run build
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open the app in your browser**

   Navigate to:

   ```
   https://localhost:5173
   ```
