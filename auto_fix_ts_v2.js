import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// 1. Read typecheck log
const logPath = path.join(__dirname, "typecheck_final_4.txt");
if (!fs.existsSync(logPath)) {
  console.log("No typecheck_final_4.txt found");
  process.exit(0);
}

const logContent = fs.readFileSync(logPath, "utf8");

// REGEX for TS2613: ... has no default export. Did you mean to use 'import { X } from "..."' instead?
// Example: src/widgets/Layout/ModuleLayout.tsx:4:8 - error TS2613: Module '".../src/widgets/Header/index"' has no default export. Did you mean to use 'import { ModuleHeader } from "/Users/choosla/Dev/Frontend/Sampoom-Management-Frontend/src/widgets/Header/index"' instead?
const suggestRegex = /([^(]+)\(\d+,\d+\): error TS2613: Module '[^']+' has no default export\. Did you mean to use 'import \{ ([^}]+) \} from "[^"]+"' instead\?/g;

let match;
const fixes = [];
while ((match = suggestRegex.exec(logContent)) !== null) {
  fixes.push({
    file: match[1].trim(),
    namedImport: match[2].trim()
  });
}

console.log(`Found ${fixes.length} default-to-named export suggestions.`);

for (const fix of fixes) {
  const fullPath = path.join(__dirname, fix.file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    // Generic replacement: import X from "@..." -> import { X } from "@..."
    const importRegex = new RegExp(`import\\s+${fix.namedImport}\\s+from\\s+["']([^"']+)["']`, "g");
    const updated = content.replace(importRegex, `import { ${fix.namedImport} } from "$1"`);
    
    if (content !== updated) {
      fs.writeFileSync(fullPath, updated);
      console.log(`Fixed TS2613 in ${fix.file}: converted ${fix.namedImport} to named import.`);
    }
  }
}

// ALSO handle TS2305 (Module has no exported member) which we handled before but maybe some missed
const exportRegex = /Module '"(@\/[^']+)"' has no exported member '([^']+)'/g;
while ((match = exportRegex.exec(logContent)) !== null) {
  const mod = match[1];
  const exp = match[2];
  // Re-use logic from previous script to inject missing exports into index.ts
  let modPath = path.join(SRC_DIR, mod.replace(/^@\//, ""));
  let indexPath = path.join(modPath, "index.ts");
  if (!fs.existsSync(indexPath)) indexPath = path.join(modPath, "index.tsx");
  
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf8");
    if (!indexContent.includes(`{ ${exp} }`)) {
       // Naive search for the file containing the export
       const files = fs.readdirSync(modPath);
       for (const f of files) {
         if (f.match(/\.(tsx?)$/) && f !== "index.ts" && f !== "index.tsx") {
           const fPath = path.join(modPath, f);
           const fContent = fs.readFileSync(fPath, "utf8");
           if (fContent.includes(`export const ${exp}`) || fContent.includes(`export type ${exp}`) || fContent.includes(`export function ${exp}`)) {
             const relPath = "./" + f.replace(/\.tsx?$/, "");
             const isType = fContent.includes(`export type ${exp}`) || fContent.includes(`export interface ${exp}`);
             const line = isType ? `export type { ${exp} } from "${relPath}";` : `export { ${exp} } from "${relPath}";`;
             indexContent += `\n${line}`;
             fs.writeFileSync(indexPath, indexContent);
             console.log(`Injected ${exp} into ${indexPath}`);
             break;
           }
         }
       }
    }
  }
}

console.log("Upgrade fix script completed.");
