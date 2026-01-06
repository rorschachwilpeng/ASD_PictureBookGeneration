<script setup lang="ts">
import { computed, ref } from "vue";
import { createMvp, type MVPCreateResponse } from "./api";

type AgeBand = "0-3" | "3-6" | "6-9" | "9-12";
type Ratio = "1:1" | "3:4" | "16:9";

const AGE_BANDS: { label: string; value: AgeBand }[] = [
  { label: "0–3岁", value: "0-3" },
  { label: "3–6岁", value: "3-6" },
  { label: "6–9岁", value: "6-9" },
  { label: "9–12岁", value: "9-12" },
];

const TYPES = ["常识认知", "社交礼仪", "心智解读", "趣味故事"] as const;
const STYLES = ["童年绘本风", "沙滩卡通风"] as const; // 占位（=LoRA）
const ROLES = ["小男孩", "小女孩", "小熊", "小狗", "小蜜蜂"] as const;
const VOICES = ["开朗男童", "纯真女童", "温柔女声", "智慧男声"] as const;

const agentOpen = ref(false);

const ageBand = ref<AgeBand>("0-3");
const type = ref<(typeof TYPES)[number]>("常识认知");
const style = ref<(typeof STYLES)[number]>("童年绘本风");
const role = ref<(typeof ROLES)[number]>("小男孩");
const voice = ref<(typeof VOICES)[number]>("开朗男童");

const protagonistDesc = ref("");
const highlight = ref("");
const avoid = ref("");
const pageCount = ref(6);
const ratio = ref<Ratio>("16:9");
const publicVisible = ref(true);

const loading = ref(false);
const errorMsg = ref<string | null>(null);
const result = ref<MVPCreateResponse | null>(null);

const config = computed(() => ({
  ageBand: ageBand.value,
  type: type.value,
  style: style.value, // 约定：style = LoRA 模型选择（后续替换为 styleId/loraId）
  role: role.value,
  voice: voice.value,
  protagonistDesc: protagonistDesc.value,
  highlight: highlight.value,
  avoid: avoid.value,
  pageCount: pageCount.value,
  ratio: ratio.value,
  publicVisible: publicVisible.value,
}));

async function onSubmit() {
  loading.value = true;
  errorMsg.value = null;
  result.value = null;
  try {
    result.value = await createMvp(config.value);
  } catch (e: any) {
    errorMsg.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="page">
    <header class="topbar">
      <div class="title">创作页（Vue MVP）</div>
      <button class="agentBtn" @click="agentOpen = !agentOpen">
        {{ agentOpen ? "Agent 关闭窗口" : "Agent 入口" }}
      </button>
    </header>

    <div class="content" :class="agentOpen ? 'twoCol' : 'oneCol'">
      <section class="panel">
        <div class="block">
          <div class="label">主角描述（文本）</div>
          <textarea
            v-model="protagonistDesc"
            placeholder="例如：老师教小男孩玩乐乐，用“这个很好玩”和同学分享玩具"
            maxlength="200"
          />
          <div class="hint">{{ protagonistDesc.length }}/200</div>
        </div>

        <div class="block">
          <div class="label">适龄段</div>
          <div class="row">
            <button
              v-for="x in AGE_BANDS"
              :key="x.value"
              class="chip"
              :class="{ active: x.value === ageBand }"
              @click="ageBand = x.value"
            >
              {{ x.label }}
            </button>
          </div>
        </div>

        <div class="block">
          <div class="label">类型</div>
          <div class="row">
            <button
              v-for="x in TYPES"
              :key="x"
              class="chip"
              :class="{ active: x === type }"
              @click="type = x"
            >
              {{ x }}
            </button>
          </div>
        </div>

        <div class="block">
          <div class="label">风格（=LoRA）</div>
          <div class="row">
            <button
              v-for="x in STYLES"
              :key="x"
              class="chip"
              :class="{ active: x === style }"
              @click="style = x"
            >
              {{ x }}
            </button>
          </div>
        </div>

        <div class="block">
          <div class="label">角色</div>
          <div class="row">
            <button
              v-for="x in ROLES"
              :key="x"
              class="chip"
              :class="{ active: x === role }"
              @click="role = x"
            >
              {{ x }}
            </button>
          </div>
        </div>

        <div class="block">
          <div class="label">声音</div>
          <div class="row">
            <button
              v-for="x in VOICES"
              :key="x"
              class="chip"
              :class="{ active: x === voice }"
              @click="voice = x"
            >
              {{ x }}
            </button>
            <button class="chip" @click="alert('MVP：新增声音占位')">+ 新增</button>
          </div>
        </div>

        <div class="block">
          <div class="label">需要突出的内容（建议 100 字内）</div>
          <textarea
            v-model="highlight"
            placeholder="描述您想通过故事让孩子学会的知识内容"
            maxlength="100"
          />
          <div class="hint">{{ highlight.length }}/100</div>
        </div>

        <div class="block">
          <div class="label">避免出现的内容</div>
          <textarea v-model="avoid" placeholder="不要出现这些词语和内容" maxlength="50" />
          <div class="hint">{{ avoid.length }}/50</div>
        </div>

        <div class="block two">
          <div>
            <div class="label">页数</div>
            <div class="row">
              <button class="chip" @click="pageCount = Math.max(1, pageCount - 1)">-</button>
              <div class="valueBox">{{ pageCount }}</div>
              <button class="chip" @click="pageCount = pageCount + 1">+</button>
            </div>
          </div>
          <div>
            <div class="label">比例</div>
            <select v-model="ratio">
              <option value="1:1">1:1</option>
              <option value="3:4">3:4</option>
              <option value="16:9">16:9（横屏）</option>
            </select>
          </div>
        </div>

        <div class="block">
          <div class="label">是否所有人可见</div>
          <label class="toggle">
            <input type="checkbox" v-model="publicVisible" />
            <span class="toggleUi" />
          </label>
        </div>

        <div class="actions">
          <button class="secondary" @click="alert('MVP：暂存占位')">暂存</button>
          <button class="primary" :disabled="loading" @click="onSubmit">
            {{ loading ? "生成中..." : "下一步（提交）" }}
          </button>
        </div>

        <div v-if="errorMsg" class="error">错误：{{ errorMsg }}</div>

        <div v-if="result" class="result">
          <div class="label">后端返回</div>
          <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
      </section>

      <aside v-if="agentOpen" class="agentPanel">
        <div class="agentTitle">Agent 对话窗口（骨架）</div>
        <div class="agentBody">这里先做 UI 占位，后续再接真实多轮对话。</div>
      </aside>
    </div>
  </div>
</template>


