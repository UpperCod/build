import test from "ava";
import { createBuild } from "../src/module.js";

test("simple replace", async (t) => {
    t.is(example("a"), "a");
});
