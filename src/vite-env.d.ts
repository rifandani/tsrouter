/// <reference types="vite/client" />

interface ImportMetaEnv {
  // prefixed with "VITE_" -> exposed to our Vite-processed code
  readonly VITE_APP_TITLE: string | undefined;
  readonly VITE_API_BASE_URL: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
