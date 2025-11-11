import { Link } from "react-router-dom";
import { useNote } from "./NoteLayout";

export function Note() {
  const note = useNote();

  return (
    <>
      <div className="mb-4 flex flex-col items-center">
        <h1 className="text-2xl font-semibold">{note.title}</h1>

        {note.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {note.tags.map((tag) => (
              <span
                key={tag.id}
                className="text-truncate rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-8">
          <Link to={`/${note.id}/edit`}>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
          </Link>
          <button
            type="button"
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 shadow-sm
                           hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          <Link to="/">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm
                           hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Back
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
