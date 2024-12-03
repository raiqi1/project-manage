import Modal from "@/components/Modal";
import { useCreateProjectMutation, useGetProjectsQuery } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";
import Switch from "@mui/material/Switch";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: projects, refetch } = useGetProjectsQuery();
  const [projectName, setProjectName] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toggle, setToggle] = useState(false);
  const [team, setTeam] = useState<any[]>([]);

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    });

    const newProject = await createProject({
      name: projectName,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      userTeam: team,
    });
    refetch();
    onClose();
    router.push(`${newProject.data?.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress size={50} thickness={5} color="primary" />
      </div>
    );
  }

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };

  const handleSwitch = () => {
    setToggle(!toggle);
    if (!toggle && team.length === 0) {
      setTeam([""]);
    } else {
      setTeam([]);
    }
  };

  const handleAddTeam = () => {
    setTeam([...team, ""]);
  };
  const handleRemoveTeam = (index: number) => {
    if (team.length > 1) {
      const newTeam = team.filter((_, i) => i !== index);
      setTeam(newTeam);
    }
  };
  const handleTeamChange = (index: any, value: string) => {
    const newTeamMembers = [...team];
    newTeamMembers[index] = Number(value);
    setTeam(newTeamMembers);
  };

  console.log("team", team);

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                control={<Switch color="primary" />}
                label="Add Team"
                labelPlacement="end"
                onClick={handleSwitch}
              />
            </FormGroup>
          </FormControl>
        </div>
        {toggle && (
          <div className="flex gap-3">
            <div className="flex w-full flex-col gap-2">
              {team.map((t, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    key={index}
                    type="number"
                    className={`${inputStyles} no-spinner`}
                    placeholder="Enter Id of the user to add to the project"
                    value={t}
                    onChange={(e) => handleTeamChange(index, e.target.value)}
                    required
                  />
                  <div className="mt-1 flex justify-center gap-3">
                    <FaPlusCircle
                      size={25}
                      onClick={handleAddTeam}
                      className="cursor-pointer"
                    />
                    <FaCircleMinus
                      size={25}
                      className="cursor-pointer"
                      onClick={() => handleRemoveTeam(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
