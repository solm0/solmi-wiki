import { spawn } from "node:child_process";

const SUPPRESSED_PATTERNS = [
  "[baseline-browser-mapping] The data in this module is over two months old.",
];

const env = {
  ...process.env,
  BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
  BROWSERSLIST_IGNORE_OLD_DATA: "true",
};

const child = spawn("next", ["build"], {
  env,
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
});

function forward(stream, target) {
  let buffer = "";

  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (SUPPRESSED_PATTERNS.some((pattern) => line.includes(pattern))) {
        continue;
      }
      target.write(`${line}\n`);
    }
  });

  stream.on("end", () => {
    if (!buffer) {
      return;
    }
    if (SUPPRESSED_PATTERNS.some((pattern) => buffer.includes(pattern))) {
      return;
    }
    target.write(buffer);
  });
}

forward(child.stdout, process.stdout);
forward(child.stderr, process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
