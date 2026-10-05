import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    watch: {
      /*
       * Poll instead of using inotify.
       *
       * This machine's `fs.inotify.max_user_watches` is 65536 and it is fully
       * consumed by other tooling (PhpStorm's indexer is the usual culprit),
       * so Vite dies at startup with ENOSPC before it can serve anything.
       * Polling sidesteps the kernel limit entirely; on a project this small
       * the cost is negligible.
       *
       * To go back to inotify, raise the limit permanently with
       *   echo 'fs.inotify.max_user_watches=524288' | sudo tee /etc/sysctl.d/60-inotify.conf
       *   sudo sysctl --system
       * and then delete this `watch` block.
       */
      usePolling: true,
      interval: 300,
    },
  },
})
