# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 project created with `create-next-app`, specifically for exploring track placement rationalization related to Audacity. The project uses the App Router and is configured with TypeScript, ESLint, and Turbopack for development.

## Development Commands

- `npm run dev` - Start development server with Turbopack (faster builds)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint checks

## Project Structure

This follows Next.js App Router conventions:

- `src/app/` - Contains the main application routes and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Homepage component
  - `globals.css` - Global styles
- `public/` - Static assets (SVG icons for Next.js/Vercel branding)

## TypeScript Configuration

- Uses strict TypeScript settings with ESNext module resolution
- Path alias: `@/*` maps to `./src/*`
- Configured for Next.js with the official Next.js plugin

## Linting

ESLint is configured with Next.js recommended rules including Core Web Vitals and TypeScript support. The configuration uses the new flat config format with compatibility layer for extending Next.js presets.

## Key Dependencies

- Next.js 15.4.6 with App Router
- React 19.1.0
- TypeScript 5.x
- ESLint with Next.js configuration
- Geist font family for typography

## Development Notes

- Uses Turbopack in development for faster builds and hot reloading
- No custom testing setup detected - if tests are needed, consider adding Jest or Vitest
- Currently a fresh Next.js template - the actual Audacity track placement logic would be implemented in additional components and pages