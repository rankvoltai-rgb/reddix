// Alibaba Cloud Model Studio (Qwen) — OpenAI-compatible endpoint.
//
// Secrets (Lovable Cloud → Secrets), never in code:
//   DASHSCOPE_API_KEY     the Model Studio API key
//   DASHSCOPE_BASE_URL    the workspace's OpenAI-compatible URL, e.g.
//                         https://ws-….ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1
//                         (workspace keys, "sk-ws-…", only work against it)
// Optional overrides:
//   DASHSCOPE_MODEL       deep work: onboarding analysis, subreddit discovery,
//                         keywords, lead analysis, replies (default qwen3.8-max)
//   DASHSCOPE_FAST_MODEL  high-volume batch scoring during scans
//                         (default qwen-flash: fast and cheap per post)
const BASE = (Deno.env.get('DASHSCOPE_BASE_URL') || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1').replace(/\/+$/, '');
export const QWEN_URL = `${BASE}/chat/completions`;
export const QWEN_KEY = Deno.env.get('DASHSCOPE_API_KEY') ?? '';
export const QWEN_MODEL = Deno.env.get('DASHSCOPE_MODEL') || 'qwen3.8-max';
export const QWEN_FAST_MODEL = Deno.env.get('DASHSCOPE_FAST_MODEL') || 'qwen-flash';

// Sent with every request. Our calls are non-streaming structured outputs, so
// thinking mode is switched off: it adds latency, and some Qwen 3 models
// reject non-streaming calls with thinking on.
export const QWEN_OPTIONS = { enable_thinking: false } as const;
