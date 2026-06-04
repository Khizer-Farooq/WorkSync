"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { useGetProjectsQuery } from "@/redux/services/projectApi";
import { useDebounce } from "@/hooks/useDebounce";
import type { Project } from "@/types/project";

type Props = {
  selectedProject: Project | null;
  onChange: (project: Project | null) => void;
  title?: string;
};

export default function ProjectSearchSelect({
  selectedProject,
  onChange,
  title = "Select Project",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const shouldSearch = debouncedSearch.trim().length > 0 && !selectedProject;

  const { data, isLoading, isError } = useGetProjectsQuery(
    {
      page: 1,
      limit: 20,
      status: "ACTIVE",
      search: debouncedSearch,
      sortBy: "title",
      sortOrder: "ASC",
    },
    {
      skip: !shouldSearch,
    }
  );

  const projects = data?.data.projects || [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;

      if (!wrapperRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    onChange(null);

    if (value.trim().length > 0) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  }

  function selectProject(project: Project) {
    onChange(project);
    setSearch(project.title);
    setDropdownOpen(false);
  }

  function clearProject() {
    onChange(null);
    setSearch("");
    setDropdownOpen(false);
  }

  useEffect(() => {
    if (selectedProject) {
      setSearch(selectedProject.title);
    }
  }, [selectedProject]);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-sm font-medium text-gray-700">{title}</label>

      <div className="relative mt-1">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (search.trim().length > 0 && !selectedProject) {
              setDropdownOpen(true);
            }
          }}
          className="w-full rounded-lg border bg-white py-2 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Search project by name or description..."
        />

        {(search || selectedProject) && (
          <button
            type="button"
            onClick={clearProject}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {dropdownOpen && !selectedProject && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border bg-white p-2 shadow-lg">
          {isLoading && (
            <p className="px-3 py-2 text-sm text-gray-500">
              Searching projects...
            </p>
          )}

          {isError && (
            <p className="px-3 py-2 text-sm text-red-600">
              Failed to search projects.
            </p>
          )}

          {!isLoading &&
            !isError &&
            debouncedSearch.trim().length > 0 &&
            projects.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">
                No project found.
              </p>
            )}

          {!isLoading && !isError && projects.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => selectProject(project)}
                  className="w-full rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {project.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {project.description || "No description"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {project.status} · {project.deadline || "No deadline"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}