import createClient from "openapi-react-query";

import { fetchClient } from "./fetchClient";

export const queryClient = createClient(fetchClient);
