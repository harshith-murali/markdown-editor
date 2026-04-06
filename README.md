# MD Editor 📝✨

A beautiful, premium, and highly responsive web-based Markdown Editor built with **Next.js**. MD Editor lets you create, edit, save, and export Markdown documents entirely in the cloud with live compilation.

## ✨ Features

- **Live Preview Compilation**: Type markdown on the left, watch it immediately parse into HTML on the right.
- **Syntax Highlighting**: Code blocks are automatically formatted using `highlight.js` with sleek styling.
- **Scroll Syncing**: Perfect simultaneous scrolling. Moving your cursor in the editor smoothly brings the preview pane to the same level!
- **Dark & Light Mode**: Gorgeous visual toggle transitioning between dynamic custom CSS Themes.
- **File Management & Cloud Storage**: 
  - Manage multiple files organized in a collapsing Sidebar.
  - Documents are safely permanently stored inside a remote **MongoDB** Database associated with your anonymous session ID!
  - Explicit manual saving using the "Save" function.
- **Export directly to `.md`**: Instantly download your note straight to your desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS with customized variable tokens (No Tailwind bloat!)
- **Markdown Parsing**: `marked` combined with `marked-highlight` and `highlight.js`
- **Database**: [MongoDB](https://www.mongodb.com/) controlled via `mongoose` 
- **Icons**: `lucide-react`

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshith-murali/markdown-editor.git
   cd markdown-editor
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   For local development, you must create a `.env.local` file at the root of the project to authenticate with MongoDB:
   
   \`\`\`env
   # .env.local
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/markdown-editor?retryWrites=true&w=majority
   \`\`\`

4. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🟢 Deployment

The easiest way to deploy this application is via **Vercel**. 

**CRITICAL DEPLOYMENT STEP:** 
Once your Vercel Project is linked to your Github Repository, you MUST navigate to **Settings > Environment Variables** and inject your unique `MONGODB_URI`. Vercel overlooks local `.env` files for security reasons, so failure to populate this Variable will result in an immediate `500 Server Error` from Next.js failing to hydrate the database! 

Additionally, ensure your MongoDB Atlas project has **Network Access** explicitly set to `0.0.0.0/0` (Allow Anywhere) to accommodate serverless functions triggering from changing IP ranges.
