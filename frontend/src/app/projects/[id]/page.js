"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SingleProject({ params }) {
  const router = useRouter();
  const [takadata, setData] = useState("");
  const [project, setProject] = useState("");
  const [tasks, setTasks] = useState("");

  useEffect(() => {
    let value = JSON.parse(localStorage.getItem("takadata")) || "";

    if (!value) {
      redirect("/");
    } else {
      setData(value);
      const userId = value.userId;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${value.token}`,
      };

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}`, {
          headers,
        })
        .then((response) => {
          setProject(response.data.project);
        })
        .catch((error) => {
          console.log(error);
        });

      axios
        .get(`http://localhost:5000/projects/${params.id}/tasks`, { headers })
        .then((response) => {
          setTasks(response.data.tasks);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return project ? (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {project.name}
        </h2>

        <h3 className="text-xl font-semibold mb-6"> About the project </h3>
        <p>{project.description}</p>
        <hr className="bg-neutral-500 h-0.5" />

        <h3 className="text-xl font-semibold mb-6 mt-6"> Project status </h3>
        <span
          className={`${project.status === "On track" && "bg-blue-600"} ${
            project.status === "Finished" && "bg-green-600"
          } ${
            project.status === "Late" && "bg-red-600"
          } rounded-md p-2 text-white font-bold`}
        >
          {project.status}
        </span>
        <hr className="bg-neutral-500 h-0.5 my-2" />

        <h3 className="text-xl font-semibold mb-6 mt-8"> Project tasks </h3>
        {tasks ? (
          <ul className="list-none">
            {tasks.map((task) => {
              return (
                <li
                  key={task._id}
                  className="shadow-gray-400 shadow-md p-5 rounded-md my-4 hover:bg-blue-300 hover:shadow cursor-pointer"
                  onClick={() => router.push(`/tasks/${task._id}`)}
                >
                  {" "}
                  <button>{task.name}</button>{" "}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No tasks yet</p>
        )}
        <hr className="bg-neutral-500 h-0.5" />

        <button className="mx-auto p-3 bg-green-600 rounded-md text-white font-bold mt-8">
          Go to project chat &rarr;
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}
