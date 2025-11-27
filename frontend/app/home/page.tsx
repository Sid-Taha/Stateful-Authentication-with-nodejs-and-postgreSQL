"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/user/home", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);




  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials: "include"
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };






  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#276465]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Welcome to website!
        </h1>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
