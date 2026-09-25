import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("缺少 OPENAI_API_KEY。请在 GitHub Actions Secrets 中设置它。");

const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
const root = process.cwd();
const contentDir = path.join(root, "content");
const indexPath = path.join(contentDir, "index.json");
const index = JSON.parse(await readFile(indexPath, "utf8"));
if (index.some(item => item.date === date)) {
  console.log(`${date} 的内容已存在，跳过生成。`);
  process.exit(0);
}

const schema = {
  type: "object", additionalProperties: false,
  properties: {
    topic: { type: "string" },
    source: { type: "object", additionalProperties: false, properties: { language: { type: "string", enum: ["韩语"] }, text: { type: "string" }, glossZh: { type: "string" } }, required: ["language", "text", "glossZh"] },
    translations: { type: "array", minItems: 4, maxItems: 4, items: { type: "object", additionalProperties: false, properties: { id: { type: "string", enum: ["ja", "pt-BR", "es", "yue"] }, language: { type: "string" }, style: { type: "string" }, text: { type: "string" }, pronunciation: { type: "string" }, keywords: { type: "array", minItems: 2, maxItems: 4, items: { type: "object", additionalProperties: false, properties: { term: { type: "string" }, meaningZh: { type: "string" }, pronunciation: { type: "string" }, explanationZh: { type: "string" } }, required: ["term", "meaningZh", "pronunciation", "explanationZh"] } } }, required: ["id", "language", "style", "text", "pronunciation", "keywords"] } }
  }, required: ["topic", "source", "translations"]
};

const prompt = `为韩语母语者生成一篇初级四语日课。今天是第 ${index.length + 1} 日。选择一个不与此前主题重复的真实生活场景。先写一到两句自然韩语原文，再翻译为日语、巴西葡语、西班牙语和粤语。所有译文必须地道、简洁、适合初级学习者。每种语言提供 2–4 个译文中实际出现的重点词；粤语使用 Jyutping，日语用罗马字。只生成 JSON。`;
const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
  body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-6-astra", reasoning: { effort: "low" }, instructions: prompt, input: "生成今日内容。", text: { format: { type: "json_schema", name: "daily_four_language_lesson", strict: true, schema } } })
});
if (!response.ok) throw new Error(`OpenAI API 请求失败：${response.status} ${await response.text()}`);
const payload = await response.json();
const lesson = JSON.parse(payload.output_text);
lesson.date = date;
lesson.day = index.length + 1;
await mkdir(contentDir, { recursive: true });
await writeFile(path.join(contentDir, `${date}.json`), JSON.stringify(lesson, null, 2) + "\n");
await writeFile(path.join(contentDir, "latest.json"), JSON.stringify(lesson, null, 2) + "\n");
index.unshift({ date, file: `${date}.json`, topic: lesson.topic });
await writeFile(indexPath, JSON.stringify(index, null, 2) + "\n");
console.log(`已生成 ${date}：${lesson.topic}`);
