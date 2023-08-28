import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";


// https://astro.build/config
export default defineConfig({
  applyBaseStyles: false,
  output: "server",
  integrations: [tailwind()],
  adapter: vercel()
});