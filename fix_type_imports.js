import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "src");

function traverseAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "node_modules" || file === ".git" || file === "dist") continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseAndReplace(fullPath);
    } else if (file.match(/\.(tsx?)$/)) {
      let cnt = fs.readFileSync(fullPath, "utf8");
      let updated = cnt;
      updated = updated.replace(/from\s+["'](@\/[^"']+)["']/g, (m, p) => {
         if (p === "@/shared/model/v1" || p === "@/shared/model/models") return `from "@/shared/model"`;
         if (p.startsWith("@/shared/ui/Table/")) return `from "@/shared/ui/Table"`;
         if (p.startsWith("@/shared/ui/Upload/")) return `from "@/shared/ui/Upload"`;
         return m;
      });
      if (cnt !== updated) {
         fs.writeFileSync(fullPath, updated);
         console.log("Fixed type import in", fullPath);
      }
    }
  }
}
traverseAndReplace(SRC_DIR);
console.log("Finished replacing isolated types.");
