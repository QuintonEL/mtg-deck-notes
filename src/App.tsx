export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-3">
          <span className="font-semibold">Commander Deck Notes</span>
          <span className="text-xs text-slate-500">alpha</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <p className="text-slate-600">
          You’re set up. Next step: deck list index here, detail view on
          `/deck/:id`.
        </p>
      </main>
    </div>
  );
}
