import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listDecks, createDeck } from "../features/decks/api";

export default function Home() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const { data: decks = [] } = useQuery({
    queryKey: ["decks", q],
    queryFn: () => listDecks(q),
  });
  const [form, setForm] = useState({
    commanderName: "",
    format: "Commander",
    colorIdentity: ["U", "B"],
    tags: [] as string[],
  });

  const create = useMutation({
    mutationFn: () => createDeck(form as any),
    onSuccess: () => {
      setForm({
        commanderName: "",
        format: "Commander",
        colorIdentity: ["U", "B"],
        tags: [],
      });
      qc.invalidateQueries({ queryKey: ["decks"] });
    },
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Commander Deck Notes</h1>

      <input
        className="border rounded px-3 py-2 w-full mb-4"
        placeholder="Search decks…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="border rounded p-4 mb-6 bg-white">
        <div className="flex gap-2 items-center">
          <input
            className="border rounded px-2 py-1 flex-1"
            placeholder="Commander name"
            value={form.commanderName}
            onChange={(e) =>
              setForm((f) => ({ ...f, commanderName: e.target.value }))
            }
          />
          <select
            className="border rounded px-2 py-1"
            value={form.format}
            onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
          >
            <option>Commander</option>
            <option>Oathbreaker</option>
            <option>Casual</option>
          </select>
          <button
            className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
            disabled={!form.commanderName}
            onClick={() => create.mutate()}
          >
            Add deck
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {decks.map((d) => (
          <li
            key={d.id}
            className="border rounded p-3 bg-white hover:bg-slate-50"
          >
            <Link to={`/deck/${d.id}`} className="font-medium">
              {d.commander}
            </Link>
            <div className="text-sm text-slate-500">
              {d.format} • {d.colorIdentity.join("")} • updated{" "}
              {new Date(d.updatedAt).toLocaleDateString()}
            </div>
          </li>
        ))}
        {decks.length === 0 && (
          <li className="text-slate-500">No decks yet. Add one above.</li>
        )}
      </ul>
    </div>
  );
}
