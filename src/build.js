import path from "path";
import glob from "fast-glob";
import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";
import { copyFile } from "fs/promises";
import { loadHtml } from "./load-html.js";
import { prepareDir } from "./utils.js";
import { pluginEmit } from "./plugin-emit.js";
import { pluginResolve } from "./plugin-resolve.js";
/**
 *
 * @param {Object} options
 * @param {string} options.src - files or expression to be processed by the build
 * @param {string} options.dist - write destination of processed files
 * @param {string} [options.href] - prefix for assets associated with html files
 * @param {boolean} [options.sourcemap] - enable the use of sourcemap for files type js
 * @param {boolean} [options.minify] - minify the js code
 */
export async function createBuild({ src, dist, href, sourcemap, minify }) {
    const root = src.replace(/^([^\*]+)(.*)/, "$1");

    const [input, html] = (await glob(src)).reduce(
        (list, file) => {
            list[file.endsWith(".html") ? 1 : 0].push(file);
            return list;
        },
        [[], []]
    );
    /**
     * contains assets captured from HTML files
     * @type {{[prop:string]:string}}
     */
    const assets = {};

    await Promise.all(
        html.map(async (file) =>
            Object.assign(assets, await loadHtml({ file, dist, root, href }))
        )
    );

    const assetsKeys = Object.keys(assets);

    const assetsCopy = assetsKeys.filter((src) => !src.endsWith(".js"));

    const assetsJs = assetsKeys.filter((src) => src.endsWith(".js"));

    const dir = path.join(dist, assetsKeys.length ? "assets" : "");

    const plugins = [pluginResolve({ root }), pluginEmit(assetsJs, assets)];

    if (minify) plugins.push(terser());

    const bundle = await rollup({
        input,
        preserveEntrySignatures: false,
        plugins,
    });

    if (assetsCopy.length) {
        await prepareDir(dir);
    }

    await Promise.all(
        assetsCopy.map(async (id) => copyFile(id, path.join(dir, assets[id])))
    );

    await bundle.write({
        dir,
        format: "esm",
        sourcemap,
        chunkFileNames: `chunks/[name]-[hash].js`,
    });
}
