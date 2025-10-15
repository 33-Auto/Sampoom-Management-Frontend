import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logPath = path.join(__dirname, "typecheck_final_17.txt");
if (!fs.existsSync(logPath)) {
  console.log("No log found.");
  process.exit(0);
}
const log = fs.readFileSync(logPath, "utf8");

const errorRegex = /^([^\(\s]+)\(\d+,\d+\):\s+error\s+TS(\d+):\s+(.*)$/gm;
let match;
while ((match = errorRegex.exec(log)) !== null) {
  const filePath = path.join(__dirname, match[1].trim());
  const errorCode = match[2];
  const message = match[3];

  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");

  if (errorCode === "2300") { // Duplicate identifier
    if (message.includes("'tanstackQueryClient'")) {
        console.log(`Fixing TS2300 in ${filePath}: Removing redundant tanstackQueryClient import`);
        const lines = content.split("\n");
        // Remove only the first occurrence if it's a static import
        let found = false;
        const newLines = lines.filter(l => {
            if (!found && l.includes("import { tanstackQueryClient }")) {
                found = true;
                return false;
            }
            return true;
        });
        fs.writeFileSync(filePath, newLines.join("\n"));
    }
  } else if (errorCode === "2308") { // Ambiguity
    if (message.includes("'RoutingProcessFormData'")) {
        console.log(`Fixing TS2308 in ${filePath}: Resolving RoutingProcessFormData ambiguity`);
        // We know it's features/routing-process/model/routing-process.types.ts
        const targetFile = path.join(__dirname, "src/features/routing-process/model/routing-process.types.ts");
        if (fs.existsSync(targetFile)) {
            let tc = fs.readFileSync(targetFile, "utf8");
            tc = tc.replace("export type RoutingProcessFormData = z.infer<typeof RoutingProcessSchema>;", "");
            fs.writeFileSync(targetFile, tc);
        }
    }
  } else if (errorCode === "2306") { // Not a module
     console.log(`Fixing TS2306 in ${filePath}: Removing non-module export`);
     const missingMatch = message.match(/File ['"]([^'"]+)['"]/);
     if (missingMatch) {
         const missing = missingMatch[1];
         const baseName = path.basename(missing).replace(".tsx", "").replace(".ts", "");
         const lines = content.split("\n").filter(l => !l.includes(baseName));
         fs.writeFileSync(filePath, lines.join("\n"));
     }
  }
}

console.log("Final fix script execution completed.");
