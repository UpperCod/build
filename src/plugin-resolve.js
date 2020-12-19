import path from "path";
import { resolve } from "@uppercod/replace-import/resolve";
/**
 * Resolves the path of the resources only if they exist in NPM
 * @param {{root:string}} options - define the root directory of the assets
 * @returns {import("rollup").Plugin}
 */
export const pluginResolve = ({ root }) => ({
    name: "plugin-resolve",
    resolveId(source) {
        return source[0] == "."
            ? null
            : source[0] == "/"
            ? path.join(root, source.slice(1))
            : resolve(source).then((url) =>
                  url.href.replace(/^file\:(\/|\\){2,3}/, "")
              );
    },
});
