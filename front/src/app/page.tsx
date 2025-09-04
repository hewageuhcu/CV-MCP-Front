
"use client";
import { useState } from "react";

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:5093/api/chat";
const EMAIL_API_URL = process.env.NEXT_PUBLIC_EMAIL_API_URL || "http://localhost:5093/mcp/email/send";

export default function Home() {
  // Chat state
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Email state
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState("");
  const [emailStatus, setEmailStatus] = useState<string|null>(null);

  // Send chat message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setLoading(true);
    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { role: "assistant", content: data.reply || JSON.stringify(data) }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { role: "assistant", content: "Error: Could not reach backend." }]);
    }
    setInput("");
    setLoading(false);
  }

  // Send email
  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus(null);
    try {
      const res = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body, from }),
      });
      if (res.ok) setEmailStatus("Email sent!");
      else setEmailStatus("Failed to send email.");
    } catch {
      setEmailStatus("Failed to send email.");
    }
    setTo("");
    setSubject("");
    setBody("");
    setFrom("");
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">MCP Chat Playground</h1>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Chat</h2>
        <div className="border rounded p-4 h-64 overflow-y-auto bg-white dark:bg-black/20 mb-2">
          {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <span className={msg.role === "user" ? "font-semibold text-blue-600" : "font-semibold text-green-600"}>
                {msg.role === "user" ? "You" : "MCP"}:
              </span> {msg.content}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded" type="submit" disabled={loading || !input.trim()}>
            {loading ? "..." : "Send"}
          </button>
        </form>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Trigger Email</h2>
        <form onSubmit={sendEmail} className="flex flex-col gap-2 max-w-md">
          <input
            className="border rounded px-2 py-1"
            type="email"
            value={to}
            onChange={e => setTo(e.target.value)}
            placeholder="To (recipient email)"
            required
          />
          <input
            className="border rounded px-2 py-1"
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Subject"
            required
          />
          <textarea
            className="border rounded px-2 py-1"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Body"
            required
          />
          <input
            className="border rounded px-2 py-1"
            type="email"
            value={from}
            onChange={e => setFrom(e.target.value)}
            placeholder="From (your email)"
            required
          />
          <button className="bg-green-600 text-white px-4 py-1 rounded w-fit" type="submit">
            Send Email
          </button>
        </form>
        {emailStatus && <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{emailStatus}</div>}
      </section>
    </div>
  );
}
