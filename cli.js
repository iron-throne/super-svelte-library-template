#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// ESM doesn't have __dirname (ESM is browser‑compatible, and browsers don’t have __dirname), so we derive it from the current file's URL
const __dirname = path.dirname(fileURLToPath(import.meta.url)); //( import.meta.url  full URL of the current file.)

// Second CLI arg is the project name; default to "svelte-app" if omitted
const target = process.argv[2] || "svelte-library";

// Bail early if the target folder already exists to avoid overwriting anything
if (fs.existsSync(target)) {
  console.error(`Error: directory "${target}" already exists.`);
  process.exit(1);
}

// The template folder ships inside the npm package next to this file
const templateDir = path.join(__dirname, "template");
if (!fs.existsSync(templateDir)) {
  console.error(`Error: template directory not found at ${templateDir}`);
  process.exit(1);
}

console.log(`Creating project: ${target}`);

// These top-level folders inside the template are dev/build artifacts — skip them
const SKIP_DIRS = new Set(["node_modules", ".svelte-kit", ".git", ".claude"]);

try {
fs.cpSync(templateDir, target, {
	recursive: true,
      // Filter runs on absolute paths, so we use relative path from templateDir
    // to avoid false matches against "node_modules" in the npm cache path itself
	filter: (src) => {
		const rel = path.relative(templateDir, src);

		// Keep root itself
		if (!rel) return true;

		const parts = rel.split(path.sep);

		// Skip only actual directories named in SKIP_DIRS
		return !parts.some((part) => SKIP_DIRS.has(part));
	}
});

  // npm strips .gitignore from published packages, so the template stores them as _gitignore
  const renameGitignores = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) renameGitignores(full);
      else if (entry.name === "_gitignore") fs.renameSync(full, path.join(dir, ".gitignore"));
    }
  };
  renameGitignores(target);

  // Rename the package to match the new project folder and drop the private flag
  const pkgPath = path.join(target, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = path.basename(target);
  delete pkg.private;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, "\t") + "\n");

  console.log("Installing dependencies...");
  // Run npm install inside the newly created project folder
  execSync("npm install", { cwd: target, stdio: "inherit" });

  console.log("\nDone!");
  console.log(`  cd ${target}`);
  console.log("  npm run dev");
} catch (err) {
  console.error("Error during scaffolding:", err.message);
  process.exit(1);
}
