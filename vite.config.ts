import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  //根据当前工作目录中的 `mode` 加载 .env 文件设置第三个参数为 '' 来加载所有环境变量
  // 根据指定模式加载环境变量
  // 参数 mode: 当前运行模式，例如 'development' 或 'production'
  // 参数 directory: 指定从哪个目录开始查找环境变量文件，默认为项目根目录
  // 参数 prefix: 环境变量的前缀，用于筛选哪些环境变量应该被加载
  const env = loadEnv(mode, process.cwd(), 'BUN')
  console.log(env)
  return {
    // 定义全局常量配置对象,可以直接在代码中使用BUN_GD_API_KEY，但是ts会校验，会爆红， 最好通过 import.meta.env.BUN_GD_API_KEY 访问，前提加上envPrefix:“BUN”,因为默认是VITE_
    /*  对于使用 TypeScript 的开发者来说，请确保在 env.d.ts 或 vite-env.d.ts 文件中添加类型声明，以获得类型检查以及代码提示。
    vite-env.d.ts
    declare const BUN_GD_API_KEY: string*/
    define: {
      BUN_GD_API_KEY: JSON.stringify(env.BUN_GD_API_KEY),
      BUN_GD_SECURITY_KEY: JSON.stringify(env.BUN_GD_SECURITY_KEY),
    },
    envPrefix: "BUN",
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        // 安装 pnpm i @types/node -D path来自这个包，这个是为了编译使用@符号不报错
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js", // 生成chunk文件名的名称
          entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
          manualChunks(id) {
            //静态资源分拆打包
            if (id.includes('node_modules/echarts')) {
              return 'echarts'
            } else if (id.includes('node_modules/antd/es/')) {
              return 'antd'
            } else if (id.includes('node_modules/@ant-design/icons') || id.includes('node_modules/lodash') || id.includes('node_modules/sortable')) {
              return 'antd-icon-ld-sortable'
            }
          },
        },

      },
      manifest: true,
      // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能
      reportCompressedSize:false
    },
    css: {
      modules: {
        /**
         * 用户可以自定义一个回调函数，来处理生成的 JSON 文件。
         * 该回调函数接受三个参数：
         *  - cssFileName: 当前处理的 CSS 文件名
         *  - json: 生成的类名与哈希值的映射对象
         *  - outputFileName: 生成的 CSS 文件的输出路径
         */
        // getJSON(cssFileName, json, outputFileName) {
        // 	console.log('Generated CSS JSON:', json)
        // },
        /**
         * 定义 CSS Modules 的作用域行为
         * - 'local'：启用 CSS Modules，生成的类名会进行哈希化并作用于当前模块。
         * - 'global'：禁用 CSS Modules，所有类名都将是全局的，不会进行哈希化。
         */
        scopeBehaviour: 'local', // 使用 CSS Modules
        /**
         * 定义哪些 CSS 文件路径需要被视为全局样式，不应用 CSS Modules。
         * 可以传入一个正则表达式数组，匹配路径中符合规则的文件。
         */

        // globalModulePaths: [/\.global\.css$/], // 匹配全局 CSS 文件

        /**
         * 如果为 `true`，会导出所有的全局类名，即使在使用 CSS Modules 时，也会把它们暴露为全局类。
         * 默认为 `false`，不会导出全局类名。
         */
        exportGlobals: false, // 导出全局类名
        /**
         * 定义生成的 CSS 类名的格式，可以是一个字符串模板，也可以是一个函数。
         * 字符串模板的格式通常为 `[name]__[local]___[hash:base64:7]`，其中：
         * - `[name]` 是文件名（不含扩展名）
         * - `[local]` 是原始的 CSS 类名
         * - `[hash:base64:7]` 是文件内容的哈希值，长度为 7
         * 如果传入函数，它接受三个参数，允许你根据文件名、类名及 CSS 内容来生成类名。
         */
        generateScopedName: 'bun__[name]__[local]__[hash:base64:2]', // 移除 bun_ 前缀，因为会通过 hashPrefix 添加
        /**
         * 为哈希值的生成过程添加前缀。它不会直接出现在类名中，但会影响最终的哈希值。
         */
        hashPrefix: 'bun_',
        /**
         * 控制类名在 JS 对象中的转换方式：
         * - 'camelCase'：将类名转换为驼峰格式，同时保留原始类名,.my-class 会导出为 { myClass: '...', 'my-class': '...' }
         * - 'camelCaseOnly'：只导出驼峰格式的类名 .my-class 会导出为 { myClass: '...' }。
         * - 'dashes'：保留原始类名格式,.my-class 会导出为 { 'my-class': '...' }
         * - 'dashesOnly'：与 'dashes' 相同，保留原始类名格式
         * 还可以传入一个函数，允许你自定义转换规则，函数接收三个参数：
         * - `originalClassName`: 原始 CSS 类名
         * - `generatedClassName`: 生成的类名
         * - `inputFile`: 当前处理的文件路径
         */
        localsConvention: 'camelCase' // 驼峰命名类名
      }
    },
    server: {
      port: 5173,
      // http://localhost:5173/api/login -> http://localhost:3001/login
      // proxy: {
      //     '/api': {
      //         target: "",
      //         changeOrigin: true,
      //         rewrite: path => path.replace(RegExp(`^api`), '')
      //     },
      // }
    },
  }
})
