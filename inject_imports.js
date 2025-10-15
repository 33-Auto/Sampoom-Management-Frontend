import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// 1. Find all files using "tanstackQueryClient" but not importing it from @/shared/api
function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (item.match(/\.(tsx?)$/)) {
            let content = fs.readFileSync(fullPath, "utf8");
            let changed = false;

            if (content.includes("tanstackQueryClient") && !content.includes("import { tanstackQueryClient } from \"@/shared/api\"")) {
                console.log(`Adding missing import to ${fullPath}`);
                // Add to TOP
                content = `import { tanstackQueryClient } from "@/shared/api";\n` + content;
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

walk(SRC_DIR);
console.log("Missing tanstackQueryClient import injection completed.");
