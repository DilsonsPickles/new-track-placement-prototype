# Netlify Deployment Instructions

This project is configured for easy deployment to Netlify.

## Quick Deploy

1. **Push to GitHub**: Push this repository to GitHub
2. **Connect to Netlify**: Go to [netlify.com](https://netlify.com) and create a new site from Git
3. **Select Repository**: Choose your GitHub repository
4. **Deploy**: Netlify will automatically use the `netlify.toml` configuration

## Manual Deploy

Alternatively, you can deploy the build folder directly:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `out` folder**: 
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder to deploy

## Configuration

The project includes:
- `netlify.toml` - Netlify build configuration
- `next.config.ts` - Next.js static export configuration
- Static export optimized for hosting

## Live Demo

Once deployed, the prototype will be fully interactive with:
- All 3 placement strategies (Focus-based, Selection-based, Context-aware)
- Complete keyboard navigation
- Range selection with Shift
- Multi-selection with Ctrl/Cmd
- Focus state management
- Track duplication and mixing features