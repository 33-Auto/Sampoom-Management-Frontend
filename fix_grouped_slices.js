import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, "src");

function getPublicApiPaths() {
  const publicApis = new Set();
  function traverse(dir, currentPath) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === "node_modules" || file === ".git") continue;
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
         traverse(fullPath, currentPath ? currentPath + '/' + file : file);
      } else if (file === "index.ts" || file === "index.tsx") {
         if (currentPath) publicApis.add('@/' + currentPath);
      }
    }
  }
  traverse(SRC_DIR, "");
  return Array.from(publicApis).sort((a, b) => b.length - a.length);
}

const publicApiPaths = getPublicApiPaths();

function normalizeFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content;

  // Added \s* after import( to handle newlines before quotes
  const importRegex = /(?:import\s+(?:\{[^}]+\}|\*\s+as\s+\w+|\w+)\s+from\s+|export\s+(?:\{[^}]+\}|\*\s+as\s+\w+)\s+from\s+|await\s+import\(\s*)(["'])(@\/[^"']+)["']/g;
  
  updated = updated.replace(importRegex, (match, quote, importPath) => {
    const bestPublicApi = publicApiPaths.find(api => importPath.startsWith(api + "/"));
    
    if (bestPublicApi) {
      const apiFsPath = path.join(SRC_DIR, bestPublicApi.replace(/^@\//, ""));
      if (filePath.startsWith(apiFsPath + path.sep)) {
         // Intra-slice alias import -> convert to relative
         const targetFsPath = path.join(SRC_DIR, importPath.replace(/^@\//, ""));
         let relPath = path.relative(path.dirname(filePath), targetFsPath);
         if (!relPath.startsWith(".")) relPath = "./" + relPath;
         
         if (match.includes("await import")) {
            return match.replace(importPath, relPath);
         }
         return match.replace(importPath, relPath);
      }

      // Deep import from another slice -> map to Best Public API
      return match.replace(importPath, bestPublicApi);
    }
    return match;
  });

  if (content !== updated) fs.writeFileSync(filePath, updated);
}

function traverseAndNormalize(dir) {
  const skipDirs = ["node_modules", ".git", "dist"];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (skipDirs.includes(file)) continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseAndNormalize(fullPath);
    } else if (file.match(/\.(tsx?)$/)) {
      normalizeFile(fullPath);
    }
  }
}

traverseAndNormalize(SRC_DIR);
console.log("Deep imports normalized thoroughly, including relative conversions.");
