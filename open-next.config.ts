import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  middleware: {
    external: true,
  },
  serverExternalPackages: ["onnxruntime-node", "onnxruntime-web", "@huggingface/transformers"],
});
