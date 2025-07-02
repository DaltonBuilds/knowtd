import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthSession } from "./AuthSessionContext";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { session } = useAuthSession();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("CHeck your email for the login link!");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)] text-white">
      <div className="gap-3">
        <h1 className=" text-7xl font-bold text-center text-blue-600 m-1">
          Knowtd
        </h1>
        <p className="text-center text-gray-400 text-2xl m-1">
          AI notetaking app that helps you write and organize your thoughts.
        </p>
        <p className="text-center mb-5">
          Sign in via magic link with your email below...
        </p>
        {loading ? (
          "Sending magic link..."
        ) : (
          <form
            className="flex gap-3 items-center justify-center"
            onSubmit={handleLogin}
          >
            <input
              className="border-2 border-blue-600 rounded p-2 w-full max-w-xs"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
            <button className="justify-center bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded px-4 py-2 font-bold cursor-pointer">
              Send Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
