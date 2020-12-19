import builtins from "builtin-modules";
import pkg from "./package.json";

export default {
    input: ["./src/build.js"],
    output: [
        {
            dir: "./",
            format: "cjs",
            sourcemap: true,
        },
    ],
    external: [...builtins, ...Object.keys(pkg.dependencies || {})],
};
