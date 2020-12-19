import { createBuild } from "../src/build.js";

createBuild({
    src: "example/*.html",
    dist: "public",
});
