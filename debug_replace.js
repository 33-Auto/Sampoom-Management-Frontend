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
const targetList = [
  "app/providers/loaders/bootstrap-auth.loader.ts",
  "pages/master/bom/api/bom.loaders.ts",
];
for (const sub of targetList) {
  const target = path.join(SRC_DIR, sub);
  let content = fs.readFileSync(target, "utf8");
  const importRegex = /(?:import\s+(?:\{[^}]+\}|\*\s+as\s+\w+|\w+)\s+from\s+|export\s+(?:\{[^}]+\}|\*\s+as\s+\w+)\s+from\s+|await\s+import\()(["'])(@\/[^"']+)["']/g;

  content = content.replace(importRegex, (match, quote, importPath) => {
    const bestPublicApi = publicApiPaths.find(api => importPath.startsWith(api + "/"));
    if (bestPublicApi) {
      console.log("File:", sub);
      console.log("MATCH:", importPath, "BEST API:", bestPublicApi);
      return match.replace(importPath, bestPublicApi);
    }
    return match;
  });
}
