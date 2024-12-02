"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [debounceSearch, setDebounceSearch] = useState(searchTerm);
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  // Perbarui Url saat debounce
  useEffect(() => {
    if (debounceSearch.length > 3) {
      const params = new URLSearchParams();
      params.set("query", debounceSearch);
      router.push(`/dashboard/search?${params.toString()}`);
    } else if (debounceSearch === "") {
      router.push("/dashboard/search");
    }
  }, [debounceSearch, router]);

  // debounce saat ketikan selesai delay 1 detik
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(searchTerm.trim());
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // const handleSearch = debounce(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchTerm(event.target.value);
  //   },
  //   500,
  // );

  // useEffect(() => {
  //   return handleSearch.cancel;
  // }, [handleSearch.cancel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-8">
      <Header name="Search" />
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-1/2 rounded border p-3 shadow"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="p-5">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div>
            {searchResults.tasks && searchResults.tasks?.length > 0 && (
              <h2>Tasks</h2>
            )}
            {searchResults.tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {searchResults.projects && searchResults.projects?.length > 0 && (
              <h2>Projects</h2>
            )}
            {searchResults.projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}

            {searchResults.users && searchResults.users?.length > 0 && (
              <h2>Users</h2>
            )}
            {searchResults.users?.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </div>
        )}
        {debounceSearch === "" && (
          <div>Silahkan masukkan kata kunci pencarian</div>
        )}
      </div>
    </div>
  );
};

export default Search;
