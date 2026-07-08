// Compiles src/paraglide/ with the exact options the vite plugin uses (run
// from the repo root; needs Node >= 23.6 for native TypeScript execution).
import { compile } from "@inlang/paraglide-js";
import { paraglideCompilerOptions } from "../paraglide.config.ts";

await compile(paraglideCompilerOptions);
