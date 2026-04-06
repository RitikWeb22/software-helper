import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Activity, Check, Copy, Maximize2, Minimize2 } from "lucide-react";

interface AgentCardProps {
  title: string;
  role: string;
  status: "active" | "idle" | "processing";
  icon: ReactNode;
  accentColor: string;
  delayMs?: number;
  content?: string;
  latencyMs?: number | null;
}

export function AgentCard({
  title,
  role,
  status,
  icon,
  accentColor,
  delayMs = 0,
  content,
  latencyMs = null,
}: AgentCardProps) {
  const isProcessing = status === "processing";
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const markdownContent = useMemo(() => content?.trim() ?? "", [content]);

  useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  const handleCopy = async () => {
    if (!markdownContent) return;

    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] animate-in fade-in duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div
        className={`relative flex flex-col bg-surface-low rounded-2xl overflow-hidden group ghost-border transition-all duration-300 ${
          isExpanded
            ? "fixed inset-6 md:inset-12 lg:inset-24 z-[60] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            : "h-full hover:bg-[#1a191b]"
        }`}
        style={!isExpanded ? { animationDelay: `${delayMs}ms` } : undefined}
      >
        {/* Accent Top Line */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }}
        />

        <div className="p-6 flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl flex items-center justify-center bg-black/40 border border-white/5 ${isExpanded ? "w-12 h-12" : "w-10 h-10"}`}
                style={{ color: accentColor }}
              >
                {icon}
              </div>
              <div>
                <h3
                  className={`text-white font-medium font-space-grotesk tracking-wide ${isExpanded ? "text-xl" : "text-base"}`}
                >
                  {title}
                </h3>
                <p className="text-xs text-gray-400 capitalize">{role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-gray-400 hover:text-white transition-colors mr-2 flex items-center justify-center"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <div className="relative flex h-2 w-2">
                {isProcessing && (
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                )}
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{
                    backgroundColor: isProcessing ? accentColor : "#484849",
                  }}
                ></span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                {status}
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-xl bg-black/20 border border-white/5 relative overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 pb-16">
              {markdownContent ? (
                <div
                  className={`agent-markdown text-gray-300 font-sans ${isExpanded ? "text-base" : "text-sm"}`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline underline-offset-2"
                        />
                      ),
                      code: ({ className, children, ...props }) => {
                        const hasLanguage = className?.includes("language-");
                        if (hasLanguage) {
                          return (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <code
                            className="px-1.5 py-0.5 rounded bg-white/10 text-primary-container"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-2 w-3/4 bg-white/5 rounded-full animate-pulse" />
                  <div className="h-2 w-1/2 bg-white/5 rounded-full animate-pulse delay-75" />
                  <div className="h-2 w-5/6 bg-white/5 rounded-full animate-pulse delay-150" />
                </div>
              )}
            </div>

            {/* Sticky Actions Bar */}
            {markdownContent && (
              <div className="absolute bottom-2 left-0 right-0 px-3 flex justify-between items-center pointer-events-none">
                <button
                  onClick={handleCopy}
                  className="pointer-events-auto flex items-center gap-1.5 bg-[#131314]/90 backdrop-blur-md border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-md text-xs text-gray-300 hover:text-white transition-colors"
                  aria-label="Copy result"
                  type="button"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <div className="pointer-events-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#131314]/90 backdrop-blur-md border border-white/10 px-2 py-1 rounded">
                  <Activity className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500 font-mono">
                    {status === "processing"
                      ? "Processing..."
                      : latencyMs
                        ? `${latencyMs}ms latency`
                        : "No latency"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
