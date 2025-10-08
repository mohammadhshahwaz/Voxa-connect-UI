import React, { useEffect, useMemo, useState } from "react";
import { getPersistedAuth } from "../../services/auth";
import { listSessions, listMessages, type ListMessagesResponse } from "../../services/chat";

type SessionId = string;

const ChatHistory: React.FC = () => {
  const auth = useMemo(() => getPersistedAuth<{ user_id?: string; username?: string }>(), []);
  const userId = auth?.user_id || "";

  const [sessions, setSessions] = useState<SessionId[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [activeSession, setActiveSession] = useState<SessionId | null>(null);
  const [messages, setMessages] = useState<ListMessagesResponse["message_results"]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState(false);

  // Fetch sessions on mount
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoadingSessions(true);
    setSessionsError(null);
    listSessions(userId)
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) {
          setSessionsError(res.error || "Failed to load sessions");
          return;
        }
        const sids = res.data.sessions || [];
        setSessions(sids);
        // After sessions load, fetch first message preview for each
        if (sids.length) {
          setLoadingPreviews(true);
          Promise.allSettled(
            sids.map(async (sid) => {
              const r = await listMessages(userId, sid, 0, 1);
              if (r.ok) {
                const first = r.data.message_results?.[0];
                const content = first?.content || "";
                const words = content.trim().split(/\s+/).slice(0, 10).join(" ");
                // capture order if provided to help sort (best-effort)
                const ord = typeof first?.order === 'number' ? first.order : -1;
                return { sid, preview: words || "New chat", order: ord };
              }
              return { sid, preview: "New chat", order: -1 };
            })
          ).then((all) => {
            const map: Record<string, string> = {};
            const orders: Record<string, number> = {};
            for (const it of all) {
              if (it.status === "fulfilled" && it.value) {
                map[it.value.sid] = it.value.preview + (it.value.preview ? "…" : "");
                orders[it.value.sid] = it.value.order;
              }
            }
            // Sort using freshly computed orders (desc)
            const sorted = sids.slice().sort((a, b) => (orders[b] ?? -1) - (orders[a] ?? -1));
            setPreviews(map);
            setSessions(sorted);
          }).finally(() => setLoadingPreviews(false));
        }
      })
      .catch((e) => !cancelled && setSessionsError(e?.message || "Failed to load sessions"))
      .finally(() => !cancelled && setLoadingSessions(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const onSelectSession = (sid: SessionId) => {
    setActiveSession(sid);
    setMessages([]);
    setMessagesError(null);
    if (!userId) return;
    setLoadingMessages(true);
    listMessages(userId, sid)
      .then((res) => {
        if (!res.ok) {
          setMessagesError(res.error || "Failed to load messages");
          return;
        }
        setMessages(res.data.message_results || []);
      })
      .catch((e) => setMessagesError(e?.message || "Failed to load messages"))
      .finally(() => setLoadingMessages(false));
  };

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--color-bg-light)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-primary-dark)" }}>Chat History</h1>
          <div className="flex gap-2">
            <a
              href="/conversations"
              className="px-3 py-2 rounded-md font-semibold"
              style={{ background: "var(--color-primary)", color: "var(--color-primary-dark)" }}
            >
              Back to Chat
            </a>
          </div>
        </div>

        {!userId ? (
          <div className="p-4 rounded-lg" style={{ background: "var(--bg-white)" }}>
            <p className="text-sm" style={{ color: "var(--color-primary-dark)" }}>
              You must be logged in to view chat history.
            </p>
            <a href="/login" className="underline" style={{ color: "var(--color-primary-dark)" }}>Go to Login</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sessions list */}
            <div className="md:col-span-1 rounded-xl shadow-sm border" style={{ background: "var(--bg-white)", borderColor: "var(--color-line)" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--color-line)" }}>
                <h2 className="font-semibold" style={{ color: "var(--color-primary-dark)" }}>Sessions</h2>
              </div>
              <div className="max-h-[70vh] overflow-auto">
                {loadingSessions && (
                  <div className="p-4 text-sm" style={{ color: "var(--color-primary-dark)" }}>Loading sessions...</div>
                )}
                {sessionsError && (
                  <div className="p-4 text-sm text-red-600">{sessionsError}</div>
                )}
                {!loadingSessions && !sessionsError && sessions.length === 0 && (
                  <div className="p-4 text-sm" style={{ color: "var(--color-primary-dark)" }}>No sessions found.</div>
                )}
                <ul className="divide-y" style={{ borderColor: "var(--color-line)" }}>
                  {sessions.map((sid) => (
                    <li key={sid}>
                      <button
                        onClick={() => onSelectSession(sid)}
                        className={`w-full text-left px-4 py-3 hover:opacity-90 ${activeSession === sid ? "font-semibold" : ""}`}
                        style={{ color: "var(--color-primary-dark)" }}
                      >
                        {previews[sid] || (loadingPreviews ? "Loading…" : sid)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Messages list */}
            <div className="md:col-span-2 rounded-xl shadow-sm border" style={{ background: "var(--bg-white)", borderColor: "var(--color-line)" }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-line)" }}>
                <h2 className="font-semibold" style={{ color: "var(--color-primary-dark)" }}>
                  {activeSession ? `Session: ${activeSession}` : "Select a session"}
                </h2>
                {activeSession && (
                  <button
                    onClick={() => onSelectSession(activeSession)}
                    className="text-sm underline"
                    style={{ color: "var(--color-primary-dark)" }}
                  >
                    Refresh
                  </button>
                )}
              </div>
              <div className="max-h-[70vh] overflow-auto p-4 space-y-3">
                {!activeSession && (
                  <div className="text-sm" style={{ color: "var(--color-primary-dark)" }}>Choose a session to view messages.</div>
                )}
                {loadingMessages && (
                  <div className="text-sm" style={{ color: "var(--color-primary-dark)" }}>Loading messages...</div>
                )}
                {messagesError && (
                  <div className="text-sm text-red-600">{messagesError}</div>
                )}
                {!loadingMessages && !messagesError && messages && messages.length > 0 && (
                  <ul className="space-y-2">
                    {messages
                      .slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((m) => (
                        <li key={m.message_id} className="rounded-lg p-3 border" style={{ borderColor: "var(--color-line)", background: "var(--color-primary)" }}>
                          <div className="text-xs mb-1 opacity-80" style={{ color: "var(--color-primary-dark)" }}>
                            {m.role?.toUpperCase() || "MESSAGE"} • {m.session_id}
                          </div>
                          <div className="text-sm" style={{ color: "var(--color-primary-dark)" }}>{m.content}</div>
                        </li>
                      ))}
                  </ul>
                )}
                {!loadingMessages && !messagesError && activeSession && messages?.length === 0 && (
                  <div className="text-sm" style={{ color: "var(--color-primary-dark)" }}>No messages in this session.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
