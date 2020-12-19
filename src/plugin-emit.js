/**
 *
 * @param {string[]} assetsJs
 * @param {{[prop:string]:string}} assets
 * @returns {import("rollup").Plugin}
 */
export const pluginEmit = (assetsJs, assets) => ({
    name: "emit-chunks",
    buildStart() {
        assetsJs.forEach((id) => {
            this.emitFile({
                type: "chunk",
                id: id,
                fileName: assets[id],
            });
        });
    },
});
