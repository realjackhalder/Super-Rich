import { execSync } from "child_process";

// If building on Vercel or already inside OpenNext, run native next build
if (process.env.VERCEL || process.env.OPEN_NEXT_BUILD) {
  execSync("next build", { stdio: "inherit" });
} else {
  // Cloudflare Workers CI build step
  console.log("☁️ Building Next.js for Cloudflare via OpenNext with --dangerouslyUseUnsupportedNextVersion...");
  execSync("opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion", {
    stdio: "inherit",
    env: { ...process.env, OPEN_NEXT_BUILD: "true" },
  });
}
