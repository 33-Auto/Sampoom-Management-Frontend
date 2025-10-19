import createClient from "openapi-fetch";

import type { paths } from "./v1";

export const { GET, POST, PUT, DELETE } = createClient<paths>({
  baseUrl: "https://sampoom.store/",
});
