import { AgentCard } from "./AgentCard";
import { Database, LayoutTemplate, Network, ServerCog } from "lucide-react";

interface AgentGridProps {
  agentData: Record<string, string>;
  isProcessing: boolean;
  latencyMs: number | null;
}

export function AgentGrid({
  agentData,
  isProcessing,
  latencyMs,
}: AgentGridProps) {
  const agents = [
    {
      id: "agent-1",
      title: "Product Analyst",
      role: "Agent 1",
      status: isProcessing ? "processing" : "idle",
      icon: <LayoutTemplate size={20} />,
      accentColor: "#8ff5ff",
      delayMs: 0,
      content: agentData.product_analysis,
    },
    {
      id: "agent-2",
      title: "System Architect",
      role: "Agent 2",
      status: isProcessing ? "processing" : "idle",
      icon: <Network size={20} />,
      accentColor: "#ac8aff",
      delayMs: 100,
      content: agentData.system_architecture,
    },
    {
      id: "agent-3",
      title: "Database Designer",
      role: "Agent 3",
      status: isProcessing ? "processing" : "idle",
      icon: <Database size={20} />,
      accentColor: "#00eefc",
      delayMs: 200,
      content: agentData.database_design,
    },
    {
      id: "agent-4",
      title: "Final Summary",
      role: "Agent 4",
      status: isProcessing ? "processing" : "idle",
      icon: <ServerCog size={20} />,
      accentColor: "#ceb9ff",
      delayMs: 300,
      content: agentData.summary,
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 pb-40 h-full overflow-y-auto">
      {agents.map((agent) => (
        <div key={agent.id} className="min-h-75 h-75 xl:h-100">
          <AgentCard
            title={agent.title}
            role={agent.role}
            status={agent.status as "idle" | "processing"}
            icon={agent.icon}
            accentColor={agent.accentColor}
            delayMs={agent.delayMs}
            content={agent.content}
            latencyMs={latencyMs}
          />
        </div>
      ))}
    </div>
  );
}
