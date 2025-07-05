"use client";

import api from "@/config/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Error from "@/components/modals/Error";
import { LogIn } from "lucide-react";

export default function AuthPage() {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await api.post("/auth", {
                username: username,
                password: password
            });
            if (response.status === 200) {
                localStorage.setItem("user", response.data.user);
                router.push("/");
            }
        } catch (error: any) {
            setIsError(true);
            setErrorMessage(error.response?.data?.error || "Failed to login");
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className="flex min-h-screen bg-black">
            <div className="flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-md p-8 border border-slate-700 rounded-xl">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Log in as Superuser
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Access the database management system
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-2.5 bg-black border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 text-white placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full px-4 py-2.5 bg-black border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500/40 text-white placeholder:text-slate-400"
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 bg-sky-700/50 border border-sky-500/30 rounded-lg text-white hover:bg-sky-700/60 transition-colors duration-200"
                        >
                            <LogIn className="w-4 h-4" />
                            Log In
                        </button>
                    </div>
                </div>
            </div>
            <Error isOpen={isError} onClose={() => setIsError(false)} message={errorMessage} />
        </div>
    );
}