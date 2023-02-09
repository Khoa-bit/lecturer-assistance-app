import { type NextPage } from "next";
import Link from "next/link";
import { useAuthContext } from "src/lib/auth_client";

const Home: NextPage = () => {
  const { user } = useAuthContext();

  return (
    <>
      <h1>Redirecting...</h1>
      <p className="flex gap-2">
        <Link className="text-blue-700 underline" href={"events"}>
          Events
        </Link>
        <Link className="text-blue-700 underline" href={"auth/login"}>
          Auth Page
        </Link>
      </p>
      <p>{JSON.stringify(user)}</p>
    </>
  );
};

export default Home;
