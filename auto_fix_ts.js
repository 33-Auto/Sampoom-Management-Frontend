import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

// 1. Read typecheck log
const logPath = path.join(__dirname, "typecheck_final_2.txt");
if (!fs.existsSync(logPath)) {
  console.log("No typecheck_final_2.txt found");
  process.exit(0);
}

const logContent = fs.readFileSync(logPath, "utf8");

// 2. Parse errors like: `src/app/App.tsx(10,10): error TS2305: Module '"@/entities/user"' has no exported member 'useAuthStore'.`
const missingExports = {}; // Map<modulePath, Set<exportName>>
const missingDefaults = new Set(); // Set<modulePath>

const exportRegex = /Module '"(@\/[^']+)"' has no exported member '([^']+)'/g;
const defaultRegex = /Module '"([^']+)"' has no default export/g;

let match;
while ((match = exportRegex.exec(logContent)) !== null) {
  const mod = match[1];
  const exp = match[2];
  if (!missingExports[mod]) missingExports[mod] = new Set();
  missingExports[mod].add(exp);
}

while ((match = defaultRegex.exec(logContent)) !== null) {
  const mod = match[1]; // this might be absolute path or @/path
  let normalizedMod = mod;
  if (mod.startsWith(__dirname)) {
    normalizedMod = mod.substring(__dirname.length + 1).replace(/^src\//, "@/");
  }
  missingDefaults.add(normalizedMod);
}

// 3. Search for the missing export in the module directory
function searchForExport(dir, exportName) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "node_modules" || file === ".git" || file === "dist") continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const res = searchForExport(fullPath, exportName);
      if (res) return res;
    } else if (file.match(/\.(tsx?)$/)) {
      const content = fs.readFileSync(fullPath, "utf8");
      // very naive search for `export const X` or `export type X` or `export function X`
      const regex = new RegExp(`export\\s+(const|type|interface|function|class|enum)\\s+${exportName}\\b`);
      if (regex.test(content)) {
        return fullPath;
      }
    }
  }
  return null;
}

// 4. Inject missing exports
for (const [mod, exps] of Object.entries(missingExports)) {
  // map @/entities/user to src/entities/user
  let modPath = path.join(SRC_DIR, mod.replace(/^@\//, ""));
  let indexPath = path.join(modPath, "index.ts");
  if (!fs.existsSync(indexPath)) {
     indexPath = path.join(modPath, "index.tsx");
  }
  
  if (!fs.existsSync(indexPath)) {
    console.log("Could not find index file for module", mod);
    continue;
  }

  let indexContent = fs.readFileSync(indexPath, "utf8");
  let appended = false;

  for (const exp of exps) {
    // Search the directory for this export
    const foundPath = searchForExport(modPath, exp);
    if (foundPath) {
      // Calculate relative path from index.ts to found file
      let relPath = path.relative(modPath, foundPath).replace(/\.tsx?$/, "");
      if (!relPath.startsWith(".")) relPath = "./" + relPath;
      
      const exportLine = `export { ${exp} } from "${relPath}";`;
      const typeExportLine = `export type { ${exp} } from "${relPath}";`;
      
      if (!indexContent.includes(exportLine) && !indexContent.includes(typeExportLine)) {
         // Determine if it was a type or value based on the file content (naive approach: just export, TypeScript allows exporting type as value loosely, or we can check file)
         const fileContent = fs.readFileSync(foundPath, "utf8");
         const isType = new RegExp(`export\\s+(type|interface)\\s+${exp}\\b`).test(fileContent);
         
         if (isType) {
            indexContent += `\nexport type { ${exp} } from "${relPath}";`;
         } else {
            indexContent += `\nexport { ${exp} } from "${relPath}";`;
         }
         appended = true;
         console.log(`Auto-fixed missing export ${exp} in ${mod}`);
      }
    } else {
      console.log(`Could not locate where ${exp} is exported in ${mod}`);
    }
  }

  if (appended) {
    fs.writeFileSync(indexPath, indexContent);
  }
}

// 5. Fix missing defaults (specifically AppLayout, etc.)
for (const mod of missingDefaults) {
  console.log("Missing default export in module:", mod);
  let modFsPath = path.join(SRC_DIR, mod.replace(/^@\//, ""));
  if (modFsPath.endsWith("/index")) modFsPath = modFsPath.replace(/\/index$/, "");
  
  let indexPath = path.join(modFsPath, "index.ts");
  if (!fs.existsSync(indexPath)) {
     indexPath = path.join(modFsPath, "index.tsx");
  }
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, "utf8");
    // Just a heuristic for now, we know widgets/Layout has AppLayout etc.
    if (mod.includes("widgets/Layout")) {
      const neededLayouts = [
         "AppLayout", "HRMLayout", "MasterLayout", "ProductionLayout",
         "PurchasingLayout", "SalesLayout", "WMSLayout", "HomeLayout"
      ];
      let changed = false;
      for (const layout of neededLayouts) {
         const layoutLine = `export { default as ${layout} } from "./${layout}";`;
         if (!content.includes(layoutLine)) {
            content += `\n${layoutLine}`;
            changed = true;
         }
      }
      if (changed) {
         fs.writeFileSync(indexPath, content);
         console.log("Auto-fixed default exports in widgets/Layout");
      }
    }
  }
}

console.log("Auto-fix script completed.");
