import { useEffect, useMemo, useState } from "react";
import { HistorySidebar, type HistoryItem } from "../sidebar/HistorySidebar";
import { AgentGrid } from "../agents/AgentGrid";
import { UserInputBar } from "../input/UserInputBar";

type AgentData = Record<string, string>;

type StoredChat = {
  id: string;
  title: string;
  date: string;
  agentData: AgentData;
  latencyMs: number | null;
};

const HISTORY_STORAGE_KEY = "software-helper-chat-history-v1";

function formatChatDate(date = new Date()) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function createChatTitle(problem?: string, count = 1) {
  if (!problem?.trim()) return `New chat ${count}`;
  return problem.length > 40 ? `${problem.slice(0, 40)}...` : problem;
}

export function Arena() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentData, setAgentData] = useState<AgentData>({});
  const [historyItems, setHistoryItems] = useState<StoredChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [requestLatencyMs, setRequestLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredChat[];
      if (!Array.isArray(parsed)) return;

      setHistoryItems(parsed);
      if (parsed.length > 0) {
        const first = parsed[0];
        setActiveChatId(first.id);
        setAgentData(first.agentData ?? {});
        setRequestLatencyMs(first.latencyMs ?? null);
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(historyItems),
      );
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [historyItems]);

  const sidebarItems = useMemo<HistoryItem[]>(
    () => historyItems.map(({ id, title, date }) => ({ id, title, date })),
    [historyItems],
  );

  const upsertChat = (id: string, patch: Partial<StoredChat>) => {
    setHistoryItems((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, ...patch } : chat)),
    );
  };

  const handleCreateChat = () => {
    const nextCount = historyItems.length + 1;
    const newChat: StoredChat = {
      id: Date.now().toString(),
      title: createChatTitle(undefined, nextCount),
      date: formatChatDate(),
      agentData: {},
      latencyMs: null,
    };

    setHistoryItems((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setAgentData({});
    setRequestLatencyMs(null);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    const selected = historyItems.find((item) => item.id === id);
    setAgentData(selected?.agentData ?? {});
    setRequestLatencyMs(selected?.latencyMs ?? null);
  };

  const handleDeleteChat = (id: string) => {
    setHistoryItems((prev) => {
      const next = prev.filter((item) => item.id !== id);

      if (activeChatId === id) {
        const fallback = next[0];
        setActiveChatId(fallback?.id ?? null);
        setAgentData(fallback?.agentData ?? {});
        setRequestLatencyMs(fallback?.latencyMs ?? null);
      }

      return next;
    });
  };

  const handleSend = async (problem: string) => {
    if (!problem.trim()) return;

    let targetChatId = activeChatId;
    if (!targetChatId) {
      targetChatId = Date.now().toString();
      const newChat: StoredChat = {
        id: targetChatId,
        title: createChatTitle(problem, historyItems.length + 1),
        date: formatChatDate(),
        agentData: {},
        latencyMs: null,
      };
      setHistoryItems((prev) => [newChat, ...prev]);
      setActiveChatId(targetChatId);
    }

    setIsProcessing(true);
    setRequestLatencyMs(null);
    setAgentData({
      product_analysis: "Processing...",
      system_architecture: "Waiting...",
      database_design: "Waiting...",
      summary: "Waiting...",
    });

    upsertChat(targetChatId, {
      title: createChatTitle(problem, historyItems.length + 1),
      date: formatChatDate(),
      agentData: {
        product_analysis: "Processing...",
        system_architecture: "Waiting...",
        database_design: "Waiting...",
        summary: "Waiting...",
      },
      latencyMs: null,
    });

    const startTime = performance.now();

    try {
      const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();
      const elapsed = Math.max(1, Math.round(performance.now() - startTime));

      setAgentData(data);
      setRequestLatencyMs(elapsed);
      upsertChat(targetChatId, {
        title: createChatTitle(problem, historyItems.length + 1),
        date: formatChatDate(),
        agentData: data,
        latencyMs: elapsed,
      });
    } catch (e) {
      console.error(e);
      const errorData = { error: "Failed to connect to backend" };
      setAgentData(errorData);
      upsertChat(targetChatId, {
        date: formatChatDate(),
        agentData: errorData,
        latencyMs: null,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden text-white font-sans">
      <HistorySidebar
        historyItems={sidebarItems}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Top subtle gradient glow for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Header/Status Bar */}
        <header className="p-6 pb-2 flex justify-between items-center z-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
              Architecture Design
            </h1>
            <p className="text-sm text-gray-400">
              Multi-Agent Intelligence Active
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <span
              className={`w-2 h-2 rounded-full ${isProcessing ? "bg-primary shadow-[0_0_8px_rgba(143,245,255,0.8)] animate-pulse" : "bg-secondary shadow-[0_0_8px_rgba(172,138,255,0.8)]"}`}
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">
              {isProcessing ? "Processing" : "Live Sync"}
            </span>
          </div>
        </header>

        {/* Main Grid Area */}
        <div className="flex-1 relative z-0 min-h-0 overflow-hidden">
          <AgentGrid
            agentData={agentData}
            isProcessing={isProcessing}
            latencyMs={requestLatencyMs}
          />
        </div>

        {/* Floating Input Area */}
        <UserInputBar onSend={handleSend} disabled={isProcessing} />
      </main>
    </div>
  );
}
