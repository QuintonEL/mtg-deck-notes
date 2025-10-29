import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeck,
  listChanges,
  addChange,
  setChangeStatus,
  listNotes,
  addNote,
} from "./api";
import { useState } from "react";

export default function DeckDetail() {
  const { id = "" } = useParams();
  const qc = useQueryClient();

  const { data: deck } = useQuery({
    queryKey: ["deck", id],
    queryFn: () => getDeck(id),
    enabled: !!id,
  });
  const { data: changes = [] } = useQuery({
    queryKey: ["changes", id],
    queryFn: () => listChanges(id),
    enabled: !!id,
  });
  const { data: notes = [] } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => listNotes(id),
    enabled: !!id,
  });

  const [action, setAction] = useState<"add" | "cut">("add");
  const [cardName, setCardName] = useState("");
  const [reason, setReason] = useState("");

  const createChange = useMutation({
    mutationFn: () => addChange(id, { action, cardName, reason }),
    onSuccess: () => {
      setCardName("");
      setReason("");
      qc.invalidateQueries({ queryKey: ["changes", id] });
    },
  });

  const [note, setNote] = useState("");
  const createNote = useMutation({
    mutationFn: () => addNote(id, note, "general"),
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["notes", id] });
    },
  });

  if (!deck)
    return (
      <div className="p-6">
        Loading…{" "}
        <Link className="underline" to="/">
          Back
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{deck.commander}</h1>
          <div className="text-sm text-slate-500">
            {deck.format} • {deck.colorIdentity.join("")}
          </div>
        </div>
        <Link to="/" className="text-sm underline">
          Back to decks
        </Link>
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        {/* Changes */}
        <div className="border rounded bg-white">
          <div className="p-3 border-b font-medium">Changes</div>
          <div className="p-3 flex gap-2">
            <select
              className="border rounded px-2 py-1"
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
            >
              <option value="add">Add</option>
              <option value="cut">Cut</option>
            </select>
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Card name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button
              className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={!cardName}
              onClick={() => createChange.mutate()}
            >
              Add
            </button>
          </div>
          <ul className="p-3 space-y-2">
            {changes.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between border rounded p-2"
              >
                <div>
                  <span
                    className={`px-2 py-0.5 rounded text-xs mr-2 ${
                      c.action === "add"
                        ? "bg-green-100 text-green-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {c.action}
                  </span>
                  <span className="font-medium">{c.cardName}</span>
                  {c.reason ? (
                    <span className="text-slate-500 text-sm">
                      {" "}
                      — {c.reason}
                    </span>
                  ) : null}
                  <span className="ml-2 text-xs text-slate-400">
                    {c.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-xs px-2 py-1 border rounded"
                    onClick={() => {
                      setChangeStatus(c.id, "accepted").then(() =>
                        qc.invalidateQueries({ queryKey: ["changes", id] })
                      );
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="text-xs px-2 py-1 border rounded"
                    onClick={() => {
                      setChangeStatus(c.id, "rejected").then(() =>
                        qc.invalidateQueries({ queryKey: ["changes", id] })
                      );
                    }}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
            {changes.length === 0 && (
              <li className="text-slate-500">No proposed changes yet.</li>
            )}
          </ul>
        </div>

        {/* Notes */}
        <div className="border rounded bg-white">
          <div className="p-3 border-b font-medium">Notes</div>
          <div className="p-3">
            <textarea
              className="w-full border rounded px-2 py-1 h-24"
              placeholder="General notes, synergy ideas, meta reads…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="mt-2">
              <button
                className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={!note.trim()}
                onClick={() => createNote.mutate()}
              >
                Add note
              </button>
            </div>
          </div>
          <ul className="p-3 space-y-2">
            {notes.map((n) => (
              <li key={n.id} className="border rounded p-2">
                <div className="text-xs text-slate-400 mb-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
                <div className="whitespace-pre-wrap">{n.body}</div>
              </li>
            ))}
            {notes.length === 0 && (
              <li className="text-slate-500">No notes yet.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
