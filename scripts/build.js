import { execSync } from "child_process";
import fs from "fs";

// Ensure latest diamond logo and favicon assets are generated
try {
  execSync("node scripts/generate-assets.cjs", { stdio: "inherit" });
} catch (e) {
  console.warn("Could not regenerate assets:", e.message);
}

// If building on Vercel or already inside OpenNext, run native next build
if (process.env.VERCEL || process.env.OPEN_NEXT_BUILD) {
  execSync("next build", { stdio: "inherit" });
} else {
  // Cloudflare Workers CI build step
  try {
    fs.rmSync(".open-next", { recursive: true, force: true });
  } catch {}
  console.log("☁️ Building Next.js for Cloudflare via OpenNext with --dangerouslyUseUnsupportedNextVersion...");
  execSync("opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion", {
    stdio: "inherit",
    env: { ...process.env, OPEN_NEXT_BUILD: "true" },
  });
}
