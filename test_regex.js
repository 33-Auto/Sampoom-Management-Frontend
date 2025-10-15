const importPath = "@/entities/user/api";
const publicApiPaths = ["@/entities/user"];
const bestPublicApi = publicApiPaths.find(api => importPath.startsWith(api + "/"));
console.log({ importPath, bestPublicApi });

let match = 'import { getMyProfile } from "@/entities/user/api";';
const quote = '"';
if (bestPublicApi) {
  let res = match.replace(importPath, bestPublicApi);
  console.log("Replaced:", res);
}
