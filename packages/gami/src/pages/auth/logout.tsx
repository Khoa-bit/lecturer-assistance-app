import type { NextPage } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthContext } from "src/lib/auth_client";

interface LoginInputs {
  email: string;
  password: string;
}

const Logout: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const router = useRouter();

  const { signOut } = useAuthContext();

  const onSignOut = () => {
    signOut();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4 overflow-hidden px-4 sm:px-0">
        <div className="relative h-96">
          <div>
            <h1>App Sign Out</h1>
            <button
              className="border bg-indigo-800 p-2 text-white hover:bg-indigo-700"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
