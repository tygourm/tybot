import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["en", "fr"],
  extract: {
    input: "src/**/*.tsx",
    output: "public/i18n/{{language}}.json",
  },
});
