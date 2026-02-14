import { execSync } from "child_process";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

function getProjectContext() {
  const srcPath = path.join(process.cwd(), "src");
  let contextOutput = "";

  function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        const relativePath = path.relative(process.cwd(), fullPath);

        if (
          relativePath.endsWith(".js") ||
          relativePath.endsWith(".ts") ||
          relativePath.endsWith(".css")
        ) {
          const fileContent = fs.readFileSync(fullPath, "utf-8");

          contextOutput += `
===== FILE: ${relativePath} =====
${fileContent}
`;
        }
      }
    }
  }

  walk(srcPath);
  return contextOutput;
}

function applyChange(filePath, change) {
  const existing = fs.readFileSync(filePath, "utf-8");

  if (change.action === "insert_at_top") {
    const updated = change.code + "\n" + existing;
    fs.writeFileSync(filePath, updated);
    return;
  }

  if (change.action === "insert_after_line") {
    if (!change.target) {
      throw new Error("insert_after_line requires a 'target' field");
    }

    const lines = existing.split("\n");
    const index = lines.findIndex((line) => line.includes(change.target));

    if (index === -1) {
      throw new Error(
        `Target line not found for insert_after_line. Target was: ${change.target}`
      );
    }

    lines.splice(index + 1, 0, change.code);
    fs.writeFileSync(filePath, lines.join("\n"));
    return;
  }

  throw new Error(`Unsupported action: ${change.action}`);
}

async function runAgent() {
  const prompt = process.argv.slice(2).join(" ");

  if (!prompt) {
    console.log("Please provide an instruction.");
    process.exit(1);
  }

  const context = getProjectContext();

  const finalPrompt = `
You are a senior frontend engineer working on an existing Vite-based golf website.

IMPORTANT CONTEXT:
- This project already works.
- You must PRESERVE existing logic.
- You are NOT allowed to rewrite entire files.
- You may NOT remove existing code.
- You may NOT introduce new frameworks (React/Vue/etc) unless they already exist in the file.
- Do NOT add new imports unless the instruction explicitly requires it.
- Prefer minimal, surgical edits only.
- Assume Vite environment.

Here is the project file structure and contents:

${context}

User Instruction:
${prompt}

Respond ONLY in this JSON format:

{
  "changes": [
    {
      "file": "relative/path",
      "action": "insert_at_top OR insert_after_line",
      "target": "required only for insert_after_line",
      "code": "exact code to insert"
    }
  ]
}

Allowed actions:
- insert_at_top
- insert_after_line (must include "target" field that matches an existing line partially)

Rules:
- Do NOT output anything outside JSON.
- Only modify existing files.
- For insert_at_top: return ONLY the exact line(s) to insert.
- For insert_after_line: provide a target string that exists in the file, and return ONLY the exact line(s) to insert.
- Do NOT fabricate unrelated code.
`;

  console.log("🧠 Sending contextual instruction to Ollama...");

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: finalPrompt,
        stream: false,
      }),
    });

    const data = await response.json();
    const rawResponse = data.response;

    console.log("\n=== Model Response ===\n");
    console.log(rawResponse);

    const jsonStart = rawResponse.indexOf("{");
    const json = rawResponse.slice(jsonStart);
    const parsed = JSON.parse(json);

    for (const change of parsed.changes) {
      const filePath = path.join(process.cwd(), change.file);
      console.log(`✏️ Applying change to ${change.file}`);
      applyChange(filePath, change);
    }

    console.log("🔨 Running build...");
    execSync("npm run build", { stdio: "inherit" });

    console.log("✅ Build successful. Committing...");
    execSync("git add .");
    execSync(`git commit -m "AI update: ${prompt.replace(/"/g, "'")}"`);

    console.log("🎉 Changes committed.");
  } catch (err) {
    console.log("❌ Build failed or error occurred. Reverting changes...");
    execSync("git reset --hard HEAD");
    console.error("Reverted to last stable commit.");
    console.error(err?.message || err);
  }
}

runAgent();
