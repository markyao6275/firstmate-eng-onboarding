"use client";

import { useEffect, useState } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const Home = () => {
  const [fetchedFirstName, setFetchedFirstName] = useState<string | null>(null);
  const [fetchedLastName, setFetchedLastName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSavedNames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/names`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const { first_name: firstName, last_name: lastName } = data;
      setFetchedFirstName(firstName);
      setFetchedLastName(lastName);
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
    const data = await response.json();
    setFetchedFirstName(data.first_name);
    setFetchedLastName(data.last_name);
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
  fetchedFirstName: string | null;
  fetchedLastName: string | null;
  onSaveNames: (firstName: string, lastName: string) => void;
}) => {
  const { fetchedFirstName, fetchedLastName, onSaveNames } = props;
  const [firstName, setFirstName] = useState<string>(fetchedFirstName || "");
  const [lastName, setLastName] = useState<string>(fetchedLastName || "");

  const fullName = `${firstName} ${lastName}`;

  return (
    <div>
      <div className="py-[12px]">
        <div className="py-[4px]">
          <input
            className="text-black"
            placeholder={"First Name"}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="text-black"
            placeholder={"Last Name"}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button onClick={() => onSaveNames(firstName, lastName)}>Save</button>
      </div>
      <div>{fullName && <p>Hello, {fullName}!</p>}</div>
    </div>
  );
};

export default Home;
