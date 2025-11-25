import CreatableReactSelect from "react-select/creatable";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { NoteData, Tag } from "./App";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

export function NoteForm({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });

    navigate("..");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            ref={titleRef}
            required
            defaultValue={title}
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
          <CreatableReactSelect
            onCreateOption={(label) => {
              const newTag = { id: uuidv4(), label };
              onAddTag(newTag);
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
      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-slate-700"
        >
          Title
        </label>
        <textarea
          id="body"
          defaultValue={markdown}
          rows={15}
          ref={markdownRef}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500/50"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="submit"
          className="text-white bg-[#2A52BE] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
        >
          Save
        </button>
        <Link to="..">
          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  );
}
