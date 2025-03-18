"use client";

import { useEffect, useState } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const Home = () => {
  const [fetchedFirstName, setFetchedFirstName] = useState<string>("");
  const [fetchedLastName, setFetchedLastName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSavedNames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/names`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch saved names");
        return;
      }

      const data = await response.json();
      const { first_name: firstName, last_name: lastName } = data;
      setFetchedFirstName(firstName || "");
      setFetchedLastName(lastName || "");
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNames = async (firstName: string, lastName: string) => {
    const response = await fetch(`${SERVER_URL}/api/names`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName }),
    });

    if (!response.ok) {
      console.error("Failed to fetch saved names");
      return;
    }

    const data = await response.json();
    setFetchedFirstName(data.first_name || "");
    setFetchedLastName(data.last_name || "");
  };

  useEffect(() => {
    fetchSavedNames();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLoading && (
        <NameEditor
          fetchedFirstName={fetchedFirstName}
          fetchedLastName={fetchedLastName}
          onSaveNames={saveNames}
        />
      )}
    </main>
  );
};

const NameEditor = (props: {
  fetchedFirstName: string;
  fetchedLastName: string;
  onSaveNames: (firstName: string, lastName: string) => void;
}) => {
  const { fetchedFirstName, fetchedLastName, onSaveNames } = props;
  const [firstName, setFirstName] = useState<string>(fetchedFirstName);
  const [lastName, setLastName] = useState<string>(fetchedLastName);
  const fullName = `${fetchedFirstName} ${fetchedLastName}`;

  return (
    <div className="w-[500px]">
      <div className="py-[12px] mb-2 flex justify-center flex-col">
        <div className="flex flex-col py-[4px] mb-4">
          <input
            className="text-black mb-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button
          className="py-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          onClick={() => onSaveNames(firstName, lastName)}
        >
          Save
        </button>
      </div>
      {fullName.trim() && (
        <div className="break-words">
          {fullName && <p>Hello, {fullName.trim()}!</p>}
        </div>
      )}
    </div>
  );
};

export default Home;
