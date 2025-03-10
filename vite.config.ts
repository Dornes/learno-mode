import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import { vercelPreset } from "@vercel/remix/vite";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  // ssr: {
  //   // List packages that you do NOT want treated as external
  //   // (i.e., that must be fully bundled into the server build)
  //   noExternal: [
  //     "@radix-ui/react-scroll-area",
  //     "@radix-ui/react-use-callback-ref",
  //     "/@radix-ui/.*/",
  //     "lucide-react",
  //     // or even use a regex like /@radix-ui\/.*/
  //   ],
  // },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      // presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
});
