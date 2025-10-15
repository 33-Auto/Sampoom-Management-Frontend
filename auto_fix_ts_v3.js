import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

const logPath = path.join(__dirname, "typecheck_final_6.txt");
if (!fs.existsSync(logPath)) {
  console.log("No typecheck_final_6.txt found");
  process.exit(0);
}

const logContent = fs.readFileSync(logPath, "utf8");

const propRegex = /error TS2339: Property '([^']+)' does not exist on type 'typeof import\("([^"]+)"\)'/g;

const missingProps = [];
let match;
while ((match = propRegex.exec(logContent)) !== null) {
  missingProps.push({
    prop: match[1],
    modPath: match[2].replace(/\.(ts|tsx|js|jsx)$/, "")
  });
}

function searchInDir(dir, propName) {
  if (!fs.existsSync(dir)) return null;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      const res = searchInDir(fullPath, propName);
      if (res) return res;
    } else if (item.match(/\.(tsx?)$/)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (new RegExp(`export\\s+(const|type|interface|function|class|enum|let|var)\\s+${propName}\\b`).test(content)) {
        return fullPath;
      }
    }
  }
  return null;
}

for (const { prop, modPath } of missingProps) {
  let moduleEntry = modPath;
  if (!fs.existsSync(moduleEntry)) {
      if (fs.existsSync(moduleEntry + ".ts")) moduleEntry = moduleEntry + ".ts";
      else if (fs.existsSync(moduleEntry + ".tsx")) moduleEntry = moduleEntry + ".tsx";
  }
  
  if (!fs.existsSync(moduleEntry)) {
      console.log(`Could not resolve module path: ${modPath}`);
      continue;
  }

  let currentDir = moduleEntry;
  if (fs.statSync(currentDir).isFile()) {
    currentDir = path.dirname(currentDir);
  }

  const sourceFile = searchInDir(currentDir, prop);
  if (sourceFile) {
    console.log(`Found ${prop} in ${sourceFile}. Fixing intermediate index files...`);
    
    let relativeFromMod = path.relative(currentDir, sourceFile);
    let parts = relativeFromMod.split(path.sep);
    
    let traceDir = currentDir;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = (i === parts.length - 1);
        
        let indexPath = path.join(traceDir, "index.ts");
        if (!fs.existsSync(indexPath)) indexPath = path.join(traceDir, "index.tsx");
        
        if (fs.existsSync(indexPath)) {
            let indexContent = fs.readFileSync(indexPath, "utf8");
            let nextExport = "";
            let rel = isLast ? "./" + part.replace(/\.tsx?$/, "") : "./" + part;
            
            if (indexContent.includes(`export * from "${rel}"`)) {
                // already covered
            } else if (!indexContent.includes(`{ ${prop} }`) && !indexContent.includes(`export type { ${prop} }`)) {
                if (isLast) {
                    const fContent = fs.readFileSync(sourceFile, "utf8");
                    const isType = new RegExp(`export\\s+(type|interface)\\s+${prop}\\b`).test(fContent);
                    nextExport = isType ? `\nexport type { ${prop} } from "${rel}";` : `\nexport { ${prop} } from "${rel}";`;
                } else {
                    nextExport = `\nexport * from "${rel}";`;
                }
                
                if (!indexContent.includes(nextExport.trim())) {
                    fs.appendFileSync(indexPath, nextExport);
                    console.log(`  Updated ${indexPath} to export ${rel}`);
                }
            }
        }
        if (!isLast) traceDir = path.join(traceDir, part);
    }
  }
}
console.log("Deep fix script completed.");
