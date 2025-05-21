import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "/Users/rog/Desktop/Freelance/afel-slot/openapi.client.json",
    output: {
      client: "react-query",
      target: "./src/api/index.ts",
      mode: "single",
      override: {
        mutator: {
          path: "./src/api/AxiosInstance.ts",
          name: "getAxiosInstance",
        },
      },
    },
  },
});
