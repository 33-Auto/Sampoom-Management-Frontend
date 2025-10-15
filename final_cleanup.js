import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// 1. Delete index files with broken exports
const logPath = path.join(__dirname, "typecheck_final_9.txt");
if (fs.existsSync(logPath)) {
    const log = fs.readFileSync(logPath, "utf8");
    const brokenRegex = /([^:]+): error TS2307: Cannot find module '([^']+)'/g;
    let match;
    while ((match = brokenRegex.exec(log)) !== null) {
        const file = path.join(__dirname, match[1].trim());
        const sub = match[2].trim();
        if (sub.startsWith("./")) {
            // It is an internal broken export
            console.log(`Checking ${file} for broken export ${sub}`);
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, "utf8");
                if (content.includes(`from "${sub}"`)) {
                    // Check if anything ELSE is in this file
                    const lines = content.split("\n").filter(l => l.trim().length > 0);
                    if (lines.every(l => l.includes("from ") && (l.includes(sub) || l.includes("./")))) {
                        // Let's just delete the line first
                        const newContent = content.split("\n").filter(l => !l.includes(`from "${sub}"`)).join("\n");
                        if (newContent.trim().length === 0) {
                            console.log(`Deleting empty index ${file}`);
                            fs.unlinkSync(file);
                        } else {
                            fs.writeFileSync(file, newContent);
                        }
                    }
                }
            }
        }
    }
}

// 2. Specific WMS fix
const stockingPath = "src/pages/wms/purchase-orders/detail/index.ts";
if (fs.existsSync(stockingPath)) {
    fs.writeFileSync(stockingPath, "export { default as StockingPage } from \"./StockingPage\";\n");
}

console.log("Cleanup and WMS fix completed.");
