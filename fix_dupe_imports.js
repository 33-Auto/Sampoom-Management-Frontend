import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// 1. Remove redundant static imports of tanstackQueryClient if there is another definition (e.g. from dynamic import)
function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (item.match(/\.(tsx?)$/)) {
            let content = fs.readFileSync(fullPath, "utf8");
            let changed = false;

            const staticImport = "import { tanstackQueryClient } from \"@/shared/api\";";
            if (content.startsWith(staticImport)) {
                // Check if there is another definition later in the file
                const rest = content.slice(staticImport.length);
                if (rest.includes("const { tanstackQueryClient }") || rest.includes("let { tanstackQueryClient }")) {
                    console.log(`Removing redundant static import in ${fullPath}`);
                    content = rest.trimStart();
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
console.log("Redundant tanstackQueryClient imports removed.");
