import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exec } from "child_process";
import { writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Java compiler is ready!",
    });
  });

  app.post("/api/compile", async (req, res) => {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "No code provided",
      });
    }

    const sessionId = randomUUID();
    const tempDir = join("/tmp", `java_${sessionId}`);

    try {
      await mkdir(tempDir, { recursive: true });

      const classNameMatch = code.match(/public\s+class\s+(\w+)/);
      const className = classNameMatch ? classNameMatch[1] : "Main";
      const filePath = join(tempDir, `${className}.java`);

      await writeFile(filePath, code);

      const compileResult = await new Promise<{ stdout: string; stderr: string }>((resolve) => {
        exec(
          `javac ${className}.java`,
          { cwd: tempDir, timeout: 10000 },
          (error, stdout, stderr) => {
            resolve({ stdout, stderr: error ? stderr || error.message : stderr });
          }
        );
      });

      if (compileResult.stderr) {
        await rm(tempDir, { recursive: true, force: true });
        return res.json({
          success: false,
          error: `Compilation Error:\n${compileResult.stderr}`,
        });
      }

      const runResult = await new Promise<{ stdout: string; stderr: string }>((resolve) => {
        exec(
          `java ${className}`,
          { cwd: tempDir, timeout: 10000 },
          (error, stdout, stderr) => {
            resolve({ stdout, stderr: error ? stderr || error.message : stderr });
          }
        );
      });

      await rm(tempDir, { recursive: true, force: true });

      if (runResult.stderr) {
        return res.json({
          success: false,
          error: `Runtime Error:\n${runResult.stderr}`,
        });
      }

      return res.json({
        success: true,
        output: runResult.stdout || "(No output)",
      });
    } catch (error: any) {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
      return res.json({
        success: false,
        error: `Server Error: ${error.message}`,
      });
    }
  });

  return httpServer;
}
