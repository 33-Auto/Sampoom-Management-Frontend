import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// 1. Find all files calling prefetchQuery or ensureQueryData on "queryClient" imported from @/shared/api
function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (item.match(/\.(tsx?)$/)) {
            let content = fs.readFileSync(fullPath, "utf8");
            let changed = false;

            // Check if it imports queryClient from @/shared/api
            if (content.includes("from \"@/shared/api\"") && content.includes("queryClient")) {
                const methods = ["prefetchQuery", "ensureQueryData", "setQueryData", "getQueryData", "invalidateQueries"];
                const usesTanstackMethod = methods.some(m => content.includes(`queryClient.${m}`));

                if (usesTanstackMethod) {
                    console.log(`Fixing tanstack import in ${fullPath}`);
                    // Change import { ..., queryClient, ... } to import { ..., tanstackQueryClient, ... }
                    // Case 1: import { queryClient } from "@/shared/api"
                    content = content.replace(/import\s+\{\s*queryClient\s*\}\s+from\s+"@\/shared\/api"/g, 'import { tanstackQueryClient } from "@/shared/api"');
                    // Case 2: import { ..., queryClient, ... } from "@/shared/api"
                    content = content.replace(/import\s+\{([^}]+)queryClient([^}]*)\}\s+from\s+"@\/shared\/api"/g, (match, before, after) => {
                        if (before.includes("tanstackQueryClient") || after.includes("tanstackQueryClient")) return match;
                        return `import {${before}tanstackQueryClient${after}} from "@/shared/api"`;
                    });
                    
                    // Rename usages: queryClient.prefetchQuery -> tanstackQueryClient.prefetchQuery
                    for (const m of methods) {
                        const regex = new RegExp(`queryClient\\.${m}`, "g");
                        content = content.replace(regex, `tanstackQueryClient.${m}`);
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
console.log("Tanstack import fix completed.");
