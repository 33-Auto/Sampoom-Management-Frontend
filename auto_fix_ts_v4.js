import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

const logPath = path.join(__dirname, "typecheck_final_8.txt");
if (!fs.existsSync(logPath)) {
  console.log("No typecheck_final_8.txt found");
  process.exit(0);
}
const logContent = fs.readFileSync(logPath, "utf8");

const propRegex = /error TS2339: Property '([^']+)' does not exist on type 'typeof import\("([^"]+)"\)'/g;
const missingProps = [];
let match;
while ((match = propRegex.exec(logContent)) !== null) {
  missingProps.push({ prop: match[1], modPath: match[2].replace(/\.(ts|tsx|js|jsx)$/, "") });
}
console.log(`Found ${missingProps.length} property errors.`);

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
      if (new RegExp(`export\\s+(async\\s+)?(const|type|interface|function|class|enum|let|var)\\s+${propName}\\b`).test(content)) {
        return fullPath;
      }
    }
  }
  return null;
}

for (const { prop, modPath } of missingProps) {
  let moduleEntry = modPath;
  if (!fs.existsSync(moduleEntry)) {
      if (fs.existsSync(moduleEntry + ".ts")) moduleEntry += ".ts";
      else if (fs.existsSync(moduleEntry + ".tsx")) moduleEntry += ".tsx";
  }
  if (!fs.existsSync(moduleEntry)) continue;

  let currentDir = moduleEntry;
  if (fs.statSync(currentDir).isFile()) currentDir = path.dirname(currentDir);

  const sourceFile = searchInDir(currentDir, prop);
  if (sourceFile) {
    console.log(`Fixing export of ${prop} from ${sourceFile} in ${currentDir}`);
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
            let rel = isLast ? "./" + part.replace(/\.tsx?$/, "") : "./" + part;
            if (!indexContent.includes(`export * from "${rel}"`) && !indexContent.includes(`{ ${prop} }`)) {
                let isType = false;
                try {
                  const targetSub = path.join(traceDir, isLast ? part : (part + "/index.ts"));
                  const checkPath = fs.existsSync(targetSub) ? targetSub : (fs.existsSync(targetSub + "x") ? targetSub + "x" : null);
                  if (checkPath) {
                    const fContent = fs.readFileSync(checkPath, "utf8");
                    isType = /export\s+(type|interface)/.test(fContent);
                  }
                } catch(e) {}
                const line = isType ? `\nexport type { ${prop} } from "${rel}";` : `\nexport { ${prop} } from "${rel}";`;
                fs.appendFileSync(indexPath, line);
                console.log(`  Added export to ${indexPath}: ${rel}`);
            }
        }
        if (!isLast) traceDir = path.join(traceDir, part);
    }
  }
}

function prune(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            prune(fullPath);
            const indexPath = path.join(fullPath, "index.ts");
            const indexTsxPath = path.join(fullPath, "index.tsx");
            const target = fs.existsSync(indexPath) ? indexPath : (fs.existsSync(indexTsxPath) ? indexTsxPath : null);
            if (target) {
                const content = fs.readFileSync(target, "utf8").trim();
                const lines = content.split("\n").filter(l => l.trim().startsWith("export"));
                let allBroken = true;
                if (lines.length === 0) allBroken = false; // Don't delete manually written empty index maybe?
                for (let line of lines) {
                    let match = line.match(/from "([^"]+)"/);
                    if (match) {
                        let sub = match[1];
                        let subPath = path.join(fullPath, sub);
                        if (fs.existsSync(subPath) || fs.existsSync(subPath + ".ts") || fs.existsSync(subPath + ".tsx")) {
                            allBroken = false;
                        }
                    } else {
                        // Named export or something else, assume valid
                        allBroken = false;
                    }
                }
                if (allBroken && lines.length > 0) {
                    console.log(`Deleting broken index ${target}`);
                    fs.unlinkSync(target);
                }
            }
        }
    }
}
prune(SRC_DIR);
console.log("Auto-fix v4 completed.");
