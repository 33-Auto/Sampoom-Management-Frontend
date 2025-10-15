import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Move NotificationContext if it's in app/providers
const oldContextPath = path.join(__dirname, "src", "app", "providers", "NotificationContext.tsx");
const newContextPath = path.join(__dirname, "src", "shared", "lib", "NotificationContext.tsx");
if (fs.existsSync(oldContextPath)) {
  fs.renameSync(oldContextPath, newContextPath);
  console.log("Moved NotificationContext.");
}

// Replace all imports of NotificationContext
function findAndReplaceStringInFiles(dir, oldStr, newStr) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".git") {
        findAndReplaceStringInFiles(fullPath, oldStr, newStr);
      }
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      let content = fs.readFileSync(fullPath, "utf8");
      if (content.includes(oldStr)) {
        content = content.replace(new RegExp(oldStr, "g"), newStr);
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
findAndReplaceStringInFiles(path.join(__dirname, "src"), "@/app/providers/NotificationContext", "@/shared/lib");

// 2. Fix Header / Layout exports
function fixWidgetIndex(widgetName, exports) {
  const p = path.join(__dirname, "src", "widgets", widgetName, "index.ts");
  if (fs.existsSync(path.dirname(p))) {
    fs.writeFileSync(p, exports);
  }
}
fixWidgetIndex("Footer", `export { default as Footer } from "./Footer";\nexport * from "./Footer";\nexport { default } from "./Footer";\n`);
fixWidgetIndex("Header", `export { default as Header } from "./ModuleHeader";\nexport * from "./ModuleHeader";\nexport * from "./NavigationTabs";\nexport { default } from "./ModuleHeader";\n`);
fixWidgetIndex("Layout", `export * from "./PageLayout";
export * from "./ModuleLayout";
export { default as AppLayout } from "./AppLayout";
export { default as HRMLayout } from "./HRMLayout";
export { default as HomeLayout } from "./HomeLayout";
export { default as MasterLayout } from "./MasterLayout";
export { default as ProductionLayout } from "./ProductionLayout";
export { default as PurchasingLayout } from "./PurchasingLayout";
export { default as SalesLayout } from "./SalesLayout";
export { default as WMSLayout } from "./WMSLayout";
`);

// 3. Create missing layer index files (create_all_indices logic)
function createIndices(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      const internalItems = fs.readdirSync(itemPath);
      const isPublicSlice = !["ui", "model", "api", "lib", "mocks", "handlers", "config"].includes(item.toLowerCase());
      if (isPublicSlice && item !== "__tests__") {
        createIndices(itemPath); // recurse
        
        const indexPath = path.join(itemPath, "index.ts");
        if (!fs.existsSync(indexPath)) {
          let exports = "";
          for (const file of internalItems) {
             if (file.endsWith(".ts") || file.endsWith(".tsx") || fs.statSync(path.join(itemPath, file)).isDirectory()) {
                if (!file.includes("index.ts") && file !== "mocks" && file !== "handlers") {
                   const bareName = file.replace(/\.tsx?$/, "");
                   exports += 'export * from "./' + bareName + '";\n';
                }
             }
          }
          if (exports) fs.writeFileSync(indexPath, exports);
        }
      }
    }
  }
}

["entities", "features", "widgets", "pages", "shared"].forEach(layer => {
  createIndices(path.join(__dirname, "src", layer));
});

// Remove layer-level indexes if they exist
["entities", "features", "widgets", "pages", "shared"].forEach(layer => {
  const p = path.join(__dirname, "src", layer, "index.ts");
  if (fs.existsSync(p)) fs.unlinkSync(p);
  const px = path.join(__dirname, "src", layer, "index.tsx");
  if (fs.existsSync(px)) fs.unlinkSync(px);
});

// 4. Normalize Imports (normalize_fsd_imports_v2 logic)
const SRC_DIR = path.join(__dirname, "src");
function hasPublicApi(layerPath, slicePath) {
  const indexPath = path.join(SRC_DIR, layerPath, slicePath, "index.ts");
  const indexPathTsx = path.join(SRC_DIR, layerPath, slicePath, "index.tsx");
  return fs.existsSync(indexPath) || fs.existsSync(indexPathTsx);
}

function normalizeFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content;

  const importRegex = /(?:import\s+(?:\{[^}]+\}|\*\s+as\s+\w+|\w+)\s+from\s+|export\s+(?:\{[^}]+\}|\*\s+as\s+\w+)\s+from\s+|await\s+import\()(["'])(@\/([a-z]+)\/([^/]+))(\/[^"']+)["']/g;
  
  updated = updated.replace(importRegex, (match, quote, basePath, layer, slice, rest) => {
    const isLocalSlice = filePath.includes(path.join(layer, slice));
    if (isLocalSlice) return match; // Keep intra-slice imports

    if (hasPublicApi(layer, slice)) {
      if (match.includes("await import")) {
         return 'await import(' + quote + basePath + quote;
      }
      return match.replace(basePath + rest, basePath);
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

console.log("FSD Pragmatic Refactoring Complete!");
