import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ReactSelect from "react-select/creatable";
import { useMemo, useState } from "react";
import { Note, Tag } from "./App";

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
};

export function NoteList({ availableTags, notes }: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notes</h1>

        <div className="flex items-center gap-2">
          <Link to="/new">
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create
            </button>
          </Link>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Tags
          </button>
        </div>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-slate-700"
            >
              Tags
            </label>
            <ReactSelect
              onCreateOption={(label) => {
                const newTag = { id: uuidv4(), label };
                setSelectedTags((prev) => [...prev, newTag]);
              }}
              value={selectedTags.map((tag) => ({
                label: tag.label,
                value: tag.id,
              }))}
              options={availableTags.map((tag) => ({
                label: tag.label,
                value: tag.id,
              }))}
              onChange={(tags) => {
                setSelectedTags(
                  tags.map((tag) => ({ label: tag.label, id: tag.value }))
                );
              }}
              isMulti
              unstyled
              classNames={{
                // outer control (the "input" shell)
                control: (state) =>
                  [
                    "mt-1 w-full rounded-md border text-sm shadow-sm",
                    state.isFocused
                      ? "border-blue-500 ring-2 ring-blue-500/50"
                      : "border-slate-300",
                  ].join(" "),

                // padding to match your other inputs
                valueContainer: () => "px-3 py-2 gap-2",

                // placeholder + typed text
                placeholder: () => "text-slate-400",
                input: () => "m-0 p-0 leading-normal",

                // tags (for isMulti)
                multiValue: () => "bg-blue-100 text-blue-700 rounded px-1",
                multiValueLabel: () => "text-blue-700",
                multiValueRemove: () => "hover:text-blue-800",

                // dropdown menu
                menu: () => "mt-1 border border-slate-200 rounded-md shadow-lg",
                option: (state) =>
                  `cursor-pointer px-3 py-2 ${
                    state.isSelected
                      ? "bg-blue-500 text-white"
                      : state.isFocused
                      ? "bg-blue-50"
                      : ""
                  }`,

                // indicators
                indicatorsContainer: () => "pr-2",
                indicatorSeparator: () => "hidden",
                clearIndicator: () => "px-2",
                dropdownIndicator: () => "px-2",
              }}
            />
          </div>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredNotes.map((note) => (
          <div key={note.id}>
            <NoteCard />
          </div>
        ))}
      </div>
    </>
  );
}
