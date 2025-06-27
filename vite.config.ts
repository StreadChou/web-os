import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import dts from 'vite-plugin-dts'; // 导入 dts 插件

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({ // 添加 dts 插件
            entryRoot: 'src', // 指定入口目录，通常是你的源码根目录
            outDir: 'dist', // 指定 d.ts 文件的输出目录，通常和你的 js 文件在同一个 dist 目录
            insertTypesEntry: true, // 在 package.json 的 types/typings 字段指向的入口文件中插入一个类型入口
            // *** 关键：指定使用 tsconfig.app.json 来生成类型 ***
            tsconfigPath: './tsconfig.app.json', // 告诉 dts 插件使用这个 tsconfig 来读取源码并生成类型
            rollupTypes: true, // 如果你想将所有类型定义合并成一个文件，可以设置为 true，但通常 insertTypesEntry 配合默认行为就够了
        })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'web-os',
            fileName: (format) => `web-os.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
})
