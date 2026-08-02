# portfolio-3d

This is a static portfolio site built with Three.js.

## Deploying to Vercel

Two easy ways to deploy:

1) Quick deploy with the Vercel CLI (recommended for immediate deploy):

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Login (this opens a browser)
vercel login

# From the project root, deploy (follow prompts)
vercel --prod
```

2) GitHub integration (recommended for continuous deploy):

- Create a GitHub repository and push this project.
- Go to https://vercel.com/new and import the repository.
- Use default settings; Vercel will detect this as a static site.

Notes:
- `vercel.json` is included to ensure the site serves `index.html` for SPA-style routing.
- If you prefer a custom build step, add a `build` script to `package.json` and configure Vercel accordingly.
