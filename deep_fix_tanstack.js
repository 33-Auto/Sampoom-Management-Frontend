import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// Final repair script for TanStack Query client and dynamic imports
function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (item.match(/\.(tsx?)$/)) {
            let content = fs.readFileSync(fullPath, "utf8");
            let changed = false;

            // Handle STATIC imports
            if (content.includes("from \"@/shared/api\"") && content.includes("queryClient")) {
                const methods = ["prefetchQuery", "ensureQueryData", "setQueryData", "getQueryData", "invalidateQueries"];
                const usesTanstackMethod = methods.some(m => content.includes(`queryClient.${m}`));
                if (usesTanstackMethod) {
                    content = content.replace(/import\s+\{\s*queryClient\s*\}\s+from\s+"@\/shared\/api"/g, 'import { tanstackQueryClient } from "@/shared/api"');
                    content = content.replace(/import\s+\{([^}]+)queryClient([^}]*)\}\s+from\s+"@\/shared\/api"/g, (match, before, after) => {
                        if (before.includes("tanstackQueryClient") || after.includes("tanstackQueryClient")) return match;
                        return `import {${before}tanstackQueryClient${after}} from "@/shared/api"`;
                    });
                    for (const m of methods) {
                        content = content.replace(new RegExp(`queryClient\\.${m}`, "g"), `tanstackQueryClient.${m}`);
                    }
                    changed = true;
                }
            }

            // Handle DYNAMIC imports: const { queryClient } = await import("@/shared/api");
            if (content.includes("import(\"@/shared/api\")") && content.includes("queryClient")) {
                const methods = ["prefetchQuery", "ensureQueryData", "setQueryData", "getQueryData", "invalidateQueries"];
                const usesTanstackMethod = methods.some(m => content.includes(`queryClient.${m}`));
                if (usesTanstackMethod) {
                    // Replace destructuring
                    content = content.replace(/const\s+\{\s*queryClient([^}]*)\}\s+=\s+await\s+import\("@\/shared\/api"\)/g, (match, after) => {
                         if (after.includes("tanstackQueryClient")) return match;
                         return `const { tanstackQueryClient${after}} = await import("@/shared/api")`;
                    });
                    for (const m of methods) {
                        content = content.replace(new RegExp(`queryClient\\.${m}`, "g"), `tanstackQueryClient.${m}`);
                    }
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

walk(SRC_DIR);
console.log("Deep repair of TanStack Query imports completed.");
