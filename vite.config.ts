import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import WindiCSS from 'vite-plugin-windicss'
import MiniProgramTailwind from '@dcasia/mini-program-tailwind-webpack-plugin/rollup'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      sourcemap: true,
    },
    plugins: [
      uni(),
      AutoImport({
        imports: ['vue', 'uni-app'],
        dts: './auto-imports.d.ts',
      }),
      WindiCSS(),
      MiniProgramTailwind({
        designWidth: 375,
      }),
    ],
    esbuild: { keepNames: true },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/vars.scss";`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@img': path.resolve(__dirname, 'src/static/images'),
      },
    },
  }
})
