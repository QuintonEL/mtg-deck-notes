import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ReactSelect from "react-select/creatable";
import { useMemo, useState } from "react";
import { Tag } from "./App";
import styles from "./NoteList.module.css";

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

type EditTagsModalProps = {
  show: boolean;
  handleClose: () => void;
  availableTags: Tag[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalOpen, setEditTagsModalOpen] = useState(false);

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
            onClick={() => setEditTagsModalOpen(true)}
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
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/50 bg-[#dd9bcf]"
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
                    "mt-1 w-full rounded-md border text-sm shadow-sm bg-[#dd9bcf]",
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
                // menu list (inside menu)
                menuList: () => "bg-white",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-8">
        {filteredNotes.map((note) => (
          <div key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </div>
        ))}
      </div>
      <EditTagsModal
        onDeleteTag={onDeleteTag}
        onUpdateTag={onUpdateTag}
        show={editTagsModalOpen}
        handleClose={() => setEditTagsModalOpen(false)}
        availableTags={availableTags}
      />
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Link
      to={`/${id}`}
      className={`block h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm 
              text-slate-900 no-underline transition hover:-translate-y-[2px] hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 
              dark:bg-slate-900 dark:text-slate-100 ${styles.card}`}
    >
      <div className="flex flex-col items-center justify-center gap-2 h-full">
        <span className="fs-5">{title}</span>
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onUpdateTag,
  onDeleteTag,
}: EditTagsModalProps) {
  if (!show) return null; // modal hidden

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 z-10 space-y-4">
        {availableTags.map((tag) => (
          <div key={tag.id} className="flex items-center gap-3">
            <input
              type="text"
              value={tag.label}
              onChange={(e) => onUpdateTag(tag.id, e.target.value)}
              className="flex-1 rounded border border-gray-300 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => onDeleteTag(tag.id)}
              className="px-3 py-2 border border-red-500 text-red-500 rounded
                         hover:bg-red-500 hover:text-white transition"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
