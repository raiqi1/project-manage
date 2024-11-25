"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  useGetProjectsQuery,
  useGetProjectTeamsQuery,
  useGetTasksQuery,
} from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const token = localStorage.getItem("token");
  const [showProjects, setShowProjects] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPriority, setShowPriority] = useState(true);
  const [showTeamProjects, setShowTeamProjects] = useState(true);

  const { data: projects, isLoading, refetch } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const {
    data: projectTeams,
    isLoading: projectTeamsLoading,
    isError: projectTeamsError,
  } = useGetProjectTeamsQuery();

  console.log("projectTeams", projectTeams);

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  console.log("projects", projects);

  // console.log("token from sidebar", token);

  return (
    <div>
      <div className={sidebarClassNames}>
        <div className="flex h-[100%] w-full flex-col justify-start">
          {/* TOP LOGO */}
          <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
            <div className="text-xl font-bold text-gray-800 dark:text-white">
              RAYIQI
            </div>
            {isSidebarCollapsed ? null : (
              <button
                className="py-3"
                onClick={() => {
                  dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
                }}
              >
                <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
              </button>
            )}
          </div>
          {/* TEAM */}
          <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
            <Image
              src="https://pm-s3-images1.s3.amazonaws.com/logo.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <div>
              <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
                RAYIQI TEAM
              </h3>
              <div className="mt-1 flex items-start gap-2">
                <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
                <p className="text-xs text-gray-500">Private</p>
              </div>
            </div>
          </div>
          {/* NAVBAR LINKS */}
          <nav className="z-10 w-full">
            {/* <SidebarLink icon={Home} label="Home" href="/" />
            <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
            <SidebarLink icon={Search} label="Search" href="/search" />
            <SidebarLink icon={Settings} label="Settings" href="/settings" />
            <SidebarLink icon={User} label="Users" href="/users" />
            <SidebarLink icon={Users} label="Teams" href="/teams" /> */}
            <SidebarLink icon={Home} label="Home" href="/dashboard" />
            <SidebarLink
              icon={Briefcase}
              label="Timeline"
              href="/dashboard/timeline"
            />
            <SidebarLink
              icon={Search}
              label="Search"
              href="/dashboard/search"
            />
            <SidebarLink
              icon={Settings}
              label="Settings"
              href="/dashboard/settings"
            />
            <SidebarLink icon={User} label="Users" href="/dashboard/users" />
            <SidebarLink icon={Users} label="Teams" href="/dashboard/teams" />
          </nav>

          {/* PROJECTS LINKS */}
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
          >
            <span className="">My Projects</span>
            {showProjects ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {/* PROJECTS LIST */}
          {showProjects &&
            !isLoading &&
            projects?.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/dashboard/projects/${project.id}`}
              />
            ))}

          {/* PROJECT TEAM */}
          <button
            onClick={() => setShowTeamProjects((prev) => !prev)}
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
          >
            <span className="">Projects Team</span>
            {showTeamProjects ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {showTeamProjects &&
            !projectTeamsLoading &&
            projectTeams?.map((project: any) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/dashboard/projects/${project.id}?team=true`}
              />
            ))}

          {/* PRIORITIES LINKS */}
          <button
            onClick={() => setShowPriority((prev) => !prev)}
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
          >
            <span className="">Priority</span>
            {showPriority ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {showPriority && (
            <>
              <SidebarLink
                icon={AlertCircle}
                label="Urgent"
                href="/dashboard/priority/urgent"
              />
              <SidebarLink
                icon={ShieldAlert}
                label="High"
                href="/dashboard/priority/high"
              />
              <SidebarLink
                icon={AlertTriangle}
                label="Medium"
                href="/dashboard/priority/medium"
              />
              <SidebarLink
                icon={AlertOctagon}
                label="Low"
                href="/dashboard/priority/low"
              />
              <SidebarLink
                icon={Layers3}
                label="Backlog"
                href="/dashboard/priority/backlog"
              />
            </>
          )}
          <div className="md: z-10 mt-5 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black">
            <div className="flex w-full items-center">
              <button
                className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
                // onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Cek jika path dasar cocok, dan tidak selalu cocok jika hanya "/"
  const isPathMatch =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href.split("?")[0]));

  // Cek jika "team=true" ada di query, jika diperlukan
  const isTeamParam = searchParams.get("team") === "true";

  // Tentukan kondisi `isActive` dengan mempertimbangkan kedua kemungkinan
  const isActive =
    isPathMatch &&
    ((href.includes("?team=true") && isTeamParam) ||
      !href.includes("?team=true"));

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
