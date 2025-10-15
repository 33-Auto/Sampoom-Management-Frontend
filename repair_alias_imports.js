import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// Final repair of aliased imports: change { queryClient as tanstackQueryClient } to { tanstackQueryClient }
function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (item.match(/\.(tsx?)$/)) {
            let content = fs.readFileSync(fullPath, "utf8");
            let changed = false;

            if (content.includes("queryClient as tanstackQueryClient")) {
                console.log(`Fixing aliased import in ${fullPath}`);
                content = content.replace(/import\s+\{\s*queryClient\s+as\s+tanstackQueryClient\s*\}\s+from\s+"@\/shared\/api"/g, 'import { tanstackQueryClient } from "@/shared/api"');
                // also handle cases with other members
                content = content.replace(/\{([^}]+)queryClient\s+as\s+tanstackQueryClient([^}]*)\}/g, '{$1tanstackQueryClient$2}');
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

walk(SRC_DIR);
console.log("Aliased import repair completed.");
