import { createApiClient } from "./apiClient";

const client = createApiClient();

export const { GET, POST, PUT, DELETE } = client;
