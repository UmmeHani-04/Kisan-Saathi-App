# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### Firebase Google login during local development

The Firebase web configuration uses the `kishan-saathi-95f8f.firebaseapp.com`
auth domain and Google login uses `signInWithPopup`. For local development,
open the app at `http://localhost:8080` (not `http://127.0.0.1:8080`).

In Firebase Console, open **Authentication → Settings → Authorized domains**
and ensure these hostnames are present:

- `localhost`
- `127.0.0.1` (only needed if you open the app using that address)

Ports are not included in Firebase authorized domains. For a deployed site,
add the production hostname as well.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
