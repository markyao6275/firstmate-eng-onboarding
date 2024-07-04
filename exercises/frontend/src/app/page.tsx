"use client"

import { useEffect, useState } from "react";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const Home = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSavedNames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/names`, {
          headers: {
            "Content-Type": "application/json"
          }
      });
      const data = await response.json();
      const { first_name: firstName, last_name: lastName } = data;
      setFirstName(firstName);
      setLastName(lastName);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const saveNames = async () => {
    const response = await fetch(`${SERVER_URL}/api/names`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName })
    });
    const data = await response.json();
    setFirstName(data.first_name);
    setLastName(data.last_name);
  }

  useEffect(() => {
    fetchSavedNames()
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      { !isLoading && (
        <NameEditor
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          onSaveNames={saveNames}
        />
      )
      }
    </main>
  )
}

const NameEditor = (props: {
  firstName: string | null,
  setFirstName: (firstName: string) => void,
  lastName: string | null,
  setLastName: (lastName: string) => void,
  onSaveNames: () => void,
}) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    onSaveNames,
  } = props;
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="py-[12px]">
        <div className="py-[4px]">
          <input
            className="text-black"
            placeholder={"First Name"}
            value={firstName || ""}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="text-black"
            placeholder={"Last Name"}
            value={lastName || ""}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button onClick={onSaveNames}>Save</button>
      </div>
      <div>
        {fullName && (<p>Hello, {fullName}!</p>)}
      </div>
    </div>
  );
}

export default Home;
