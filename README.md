# ASD_PictureBookGeneration

一个用于 **ASD（孤独症）儿童家长** 的 AI 绘本生成工具（MVP）。

## 目标（当前阶段）
- **前端（Web）**：收集用户的结构化选项与文本输入，打包成 JSON 提交
- **后端（API）**：接收 JSON → **本地落盘保存**（后续可接数据库）→ 调用第三方 LLM（下一步接入）产出 prompt → 调用 LoRA 绘本模型（后续接入）生成图片 → 返回结果给前端

> 说明：当前提交先把「项目架构骨架」搭起来，LLM/LoRA 的真实调用会在下一步补齐。

## 项目结构
```
ASD_PictureBookGeneration/
  Website/          # ✅Vue + Express（参考 casa0017-web-assessment 的前后端分离形态）
```

## 本地启动（开发）

### 启动（Vue + Express）

#### Terminal 1：后端（Express）
```bash
cd Website/back-end
npm install
node app.js
```

默认地址：
- `http://localhost:8000`
- 健康检查：`GET /healthz`

#### Terminal 2：前端（Vue）
```bash
cd Website/front-end
npm install
npm run dev
```

默认地址：
- `http://localhost:5173`

> 说明：后续接第三方 LLM 与 LoRA 也会基于 `Website/` 目录继续做。

## 环境变量
后端将来会用到第三方 LLM 的 API Key（下一步接入时补齐）。
你可以先创建 `Website/back-end/.env`（参考 `Website/back-end/env.example`）。
