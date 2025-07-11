# Hydrogen Theme

[![Build status](https://github.com/G2Digital/theme-blank-shopify/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/montalvomiguelo/hydrogen-theme/actions/workflows/ci.yml?query=branch%3Amain)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/G2Digital/theme-blank-shopify/blob/main/LICENSE.md)

A port of Hydrogen's default template to Shopify OS 2.0.

![pika-1697163139924-1x](https://github.com/montalvomiguelo/hydrogen-theme/assets/5134470/d92f6135-62d8-4a7d-a612-c812c6652da1)

## 🔨 Requirements

- [Node.js (latest LTS version)](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

## ⚙️ Environment Setup

Create a `.env` file in your project root to configure your development environment:

```env
# Shopify Store URLs for CORS (comma-separated for multiple stores)
VITE_SHOPIFY_URL=https://your-store.myshopify.com,https://your-dev-store.myshopify.com
```

### Environment Variables

| Variable           | Description                                                                                           | Example                                                            |
| :----------------- | :---------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| `VITE_SHOPIFY_URL` | Your Shopify store URL(s) for CORS configuration. Use comma-separated values for multiple stores.     | `https://johns-apparel.myshopify.com,https://test-store.myshopify.com` |

> **Note**: The CORS configuration allows the theme customizer to work properly in development mode, enabling you to preview `theme.css` and `theme.js` files before building.

## 🚀 Project Structure

This theme leverages the [default Shopify theme folder structure](https://shopify.dev/themes/tools/github#repository-structure) and introduces the following directories, some of which have special behaviors.

```bash
└── hydrogen-theme
    └── frontend
        ├── entrypoints
        ├── islands
        ├── lib
        └── styles
```

| Subdirectory  | Description                           |
| :------------ | :------------------------------------ |
| `entrypoints` | The entry points for your theme       |
| `islands`     | The interactive islands in your theme |
| `lib`         | Theme specific libraries              |
| `styles`      | The styles of your theme              |

## 🧞 Commands

| Command                             | Action                                                                  |
| :---------------------------------- | :---------------------------------------------------------------------- |
| `pnpm install`                      | Installs dependencies                                                   |
| `pnpm dev -- --store johns-apparel` | Launch the Shopify and Vite servers in parallel                         |
| `pnpm run deploy`                   | Bundle your theme's assets and upload your local theme files to Shopify |

## 🏝️ Hydration Directives

The following hydration strategies are available (borrowed from [Astro](https://docs.astro.build/en/concepts/islands/)).

| Directive        | Description                                                                                                                                       |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `client:idle`    | Hydrate the component as soon as the main thread is [free](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)           |
| `client:visible` | Hydrates the component as soon as the element [enters the viewport](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)   |
| `client:media`   | Hydrates the component as soon as the browser [matches the given media query](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) |

Usage:

```html
<my-component client:visible>This is an island.</my-component>
```

## 🔧 Development Features

### CORS Configuration
The theme includes automatic CORS configuration for development mode, allowing seamless integration with Shopify's theme customizer. This enables you to:

- Preview your theme assets (`theme.css`, `theme.js`) in real-time
- Use the Shopify customizer while developing
- Work with multiple store environments

### Tunnel Support
Development server includes tunnel support for external access, making it easier to test your theme across different devices and share previews.

## 🙇‍♂️ Thanks

We would like to specifically thank the following projects for the inspiration and help regarding the creation of hydrogen-theme:

- [vite-plugin-shopify](https://github.com/barrel/shopify-vite)
- [hydrogen](https://github.com/Shopify/hydrogen)
- [dawn](https://github.com/Shopify/dawn)
- [astro](https://github.com/withastro/astro)