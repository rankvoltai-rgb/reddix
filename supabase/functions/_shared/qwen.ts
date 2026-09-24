// Alibaba DashScope (Qwen) — OpenAI-compatible endpoint.
const BASE = Deno.env.get('DASHSCOPE_BASE_URL') || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
export const QWEN_URL = `${BASE}/chat/completions`;
export const QWEN_KEY = Deno.env.get('DASHSCOPE_API_KEY') ?? '';
// Deep analysis (onboarding, lead analysis, replies)
export const QWEN_MODEL = 'qwen-plus';
// Cheap, high-volume batch scoring
export const QWEN_FAST_MODEL = 'qwen-flash';
