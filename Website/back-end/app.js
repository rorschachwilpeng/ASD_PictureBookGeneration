import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const DATA_DIR = path.join(__dirname, "data");
const REQUESTS_DIR = path.join(DATA_DIR, "requests");
const GENERATED_DIR = path.join(__dirname, "static", "generated");

function ensureDirs() {
  fs.mkdirSync(REQUESTS_DIR, { recursive: true });
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

function utcTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function storeRequestJson(payload) {
  ensureDirs();
  const requestId = `${utcTimestamp()}_${uuidv4().replaceAll("-", "").slice(0, 12)}`;
  const filePath = path.join(REQUESTS_DIR, `${requestId}.json`);
  const wrapped = {
    request_id: requestId,
    stored_at_utc: new Date().toISOString(),
    payload,
  };
  fs.writeFileSync(filePath, JSON.stringify(wrapped, null, 2), "utf-8");
  return { requestId, filePath };
}

const app = express();

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

// 静态文件：将来放生成图片（MVP 先留出口）
app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/mvp/create", async (req, res) => {
  try {
    const config = req?.body?.config ?? {};
    const { requestId, filePath } = storeRequestJson(config);

    // TODO: 下一步接第三方 LLM：config -> prompt
    const prompt = null;

    // TODO: 下一步接 LoRA：prompt -> images
    const image_urls = [];

    res.json({
      request_id: requestId,
      stored_json_path: filePath,
      prompt,
      image_urls,
    });
  } catch (e) {
    res.status(500).send(String(e?.message || e));
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});


