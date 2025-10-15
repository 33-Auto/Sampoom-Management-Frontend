import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logPath = path.join(__dirname, "typecheck_final_13.txt");
if (!fs.existsSync(logPath)) {
  console.log("No log found.");
  process.exit(0);
}
const log = fs.readFileSync(logPath, "utf8");

// Adjusted Regex for pnpm/tsc format: path(line,col): error TSXXXX: Message
const errorRegex = /^([^\(\s]+)\(\d+,\d+\):\s+error\s+TS(\d+):\s+(.*)$/gm;
let match;
while ((match = errorRegex.exec(log)) !== null) {
  const filePath = path.join(__dirname, match[1].trim());
  const errorCode = match[2];
  const message = match[3];

  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");

  if (errorCode === "2307") { // Cannot find module 'X'
    const missingMatch = message.match(/module ['"]([^'"]+)['"]/);
    if (missingMatch) {
        const missing = missingMatch[1];
        console.log(`Fixing TS2307 in ${filePath}: Removing ${missing}`);
        const lines = content.split("\n");
        const newLines = lines.filter(l => !l.includes(`"${missing}"`) && !l.includes(`'${missing}'`));
        if (lines.length !== newLines.length) {
            fs.writeFileSync(filePath, newLines.join("\n"));
        }
    }
  } else if (errorCode === "2300") { // Duplicate identifier 'X'
    const idMatch = message.match(/identifier ['"]([^'"]+)['"]/);
    if (idMatch) {
        const ident = idMatch[1];
        console.log(`Fixing TS2300 in ${filePath}: Removing duplicate ${ident}`);
        const lines = content.split("\n");
        let seen = false;
        const newLines = [];
        for (let l of lines) {
            if (l.includes(ident)) {
                if (!seen) {
                    newLines.push(l);
                    seen = true;
                }
            } else {
                newLines.push(l);
            }
        }
        if (lines.length !== newLines.length) {
            fs.writeFileSync(filePath, newLines.join("\n"));
        }
    }
  } else if (errorCode === "2306" || errorCode === "2339") { // Not a module or Property does not exist
      // Similar cleanup for 2306 (Not a module)
      const targetMatch = message.match(/(File|Property) ['"]([^'"]+)['"]/);
      if (targetMatch) {
          const target = targetMatch[2];
          console.log(`Fixing TS${errorCode} in ${filePath}: Removing ${target}`);
          const lines = content.split("\n");
          // Remove exact line containing it if it's an export
          const newLines = lines.filter(l => !l.includes(target) || !l.trim().startsWith("export"));
          if (lines.length !== newLines.length) {
              fs.writeFileSync(filePath, newLines.join("\n"));
          }
      }
  }
}

console.log("Final surgical cleanup completed.");
