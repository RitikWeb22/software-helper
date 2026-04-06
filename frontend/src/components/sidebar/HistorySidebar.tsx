import { History, MessageSquare, Plus, Trash2 } from "lucide-react";

export type HistoryItem = {
  id: string;
  title: string;
  date: string;
};

interface HistorySidebarProps {
  historyItems: HistoryItem[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
  onDeleteChat: (id: string) => void;
}

export function HistorySidebar({
  historyItems,
  activeChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat
}: HistorySidebarProps) {
  return (
    <div className="w-72 bg-surface-low border-r border-[#201f21] h-screen flex flex-col hidden md:flex">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-medium">
          <History className="w-5 h-5 text-gray-400" />
          <span>History</span>
        </div>
        <button
          onClick={onCreateChat}
          className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-gray-400 hover:text-white"
          aria-label="Create new chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1">
        {historyItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center px-3">
            <p className="text-sm text-gray-500">
              No history yet. Tap + to start a new chat.
            </p>
          </div>
        ) : (
          historyItems.map((item) => {
            const isActive = item.id === activeChatId;
            return (
              <button
                key={item.id}
                onClick={() => onSelectChat(item.id)}
                className={`w-full group flex items-start gap-3 p-3 rounded-lg text-left transition-all relative ${
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(172,138,255,0.6)]" />
                ) : (
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-50" />
                )}
                <div className="flex-1 overflow-hidden pr-6">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs opacity-50 mt-1">{item.date}</p>
                </div>
                
                {/* Delete Button - Appears on hover */}
                <div 
                  className={`absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity`}
                  onClick={(e) => {
                     e.stopPropagation();
                     onDeleteChat(item.id);
                  }}
                >
                  <div className="p-1.5 hover:bg-black/40 rounded-md text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Clean Footer */}
      <div className="p-4 border-t border-[#201f21]">
        <p className="text-xs text-gray-500 text-center">
          Local session history
        </p>
      </div>
    </div>
  );
}
