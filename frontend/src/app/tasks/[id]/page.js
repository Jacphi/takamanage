"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SingleTask({ params }) {
  const router = useRouter();
  const [takadata, setData] = useState("");
  const [task, setTask] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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
        .get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${params.id}`, {
          headers,
        })
        .then((response) => {
          setTask(response.data.task);
        })
        .catch((error) => {
          console.log(error);
        });

      // axios
      //   .post(
      //     `${process.env.NEXT_PUBLIC_API_URL}/projects/is-admin`,
      //     { project: params.id },
      //     { headers }
      //   )
      //   .then((response) => {
      //     setIsAdmin(response.data.data);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    }
  }, []);

  return task ? (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <span className="flex justify-between max-w-5xl w-full my-4">
        <button
          type="button"
          className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 font-bold"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </button>

        {/* {isAdmin && (
          <button
            type="button"
            className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 font-bold"
            onClick={() => router.push(`/projects/${project._id}/create-task`)}
          >
            Add task
          </button>
        )} */}

        {/* {isAdmin && (
          <button
            type="button"
            className="bg-blue-500 p-2 rounded-md hover:bg-blue-600 font-bold"
            onClick={() => router.push("/dashboard")}
          >
            Add member
          </button>
        )} */}
      </span>

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {task.name}
        </h2>

        <h3 className="text-xl font-semibold mb-6"> About the task </h3>
        <p>{task.description}</p>
        <hr className="bg-neutral-500 h-0.5" />

        <h3 className="text-xl font-semibold mb-6 mt-6"> Task status </h3>
        <span
          className={`${task.status === "On track" && "bg-blue-600"} ${
            task.status === "Finished" && "bg-green-600"
          } ${
            task.status === "Late" && "bg-red-600"
          } rounded-md p-2 text-white font-bold`}
        >
          {task.status}
        </span>
        <hr className="bg-neutral-500 h-0.5 my-2" />

        <h3 className="text-xl font-semibold mb-6 mt-8"> Task priority </h3>
        <span
          className={`${task.priority === "High" && "bg-red-600"} ${
            task.priority === "Medium" && "bg-blue-600"
          } ${
            task.priority === "Low" && "bg-green-600"
          } rounded-md p-2 text-white font-bold`}
        >
          {task.priority}
        </span>
        <hr className="bg-neutral-500 h-0.5 my-2" />
      </div>
    </div>
  ) : (
    ""
  );
}
