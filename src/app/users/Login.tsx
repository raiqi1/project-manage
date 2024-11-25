import { useLoginMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginModal = ({
  setShowSidebar,
}: {
  setShowSidebar: (value: boolean) => void;
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState<string | null>(null); // Untuk menyimpan nama pengguna setelah login
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk mengontrol modal
  const [login, { isLoading, error }] = useLoginMutation(); // Gunakan useLoginMutation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.user.username);
      setUserName(result.user.username);
      setIsModalOpen(false);
      console.log("Login berhasil:", result);
      setShowSidebar(true);
      router.push("/");
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  // Hapus token dan username dari localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUserName(null);
    setShowSidebar(false);
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center">
      {/* Tombol Login atau Nama Pengguna */}
      {userName ? (
        <>
          <span className="text-lg font-semibold">
            Selamat datang, {userName}
          </span>
          {/* <button
            onClick={handleLogout}
            className="ml-4 text-red-500 hover:underline"
          >
            Logout
          </button> */}
        </>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Login
        </button>
      )}

      {/* Modal untuk login */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              {error && (
                <p className="mt-2 text-sm text-red-500">
                  Login gagal, coba lagi.
                </p>
              )}
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-blue-500 hover:underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
