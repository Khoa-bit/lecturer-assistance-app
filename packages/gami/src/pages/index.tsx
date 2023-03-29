import { GetServerSidePropsContext, type NextPage } from "next";
import Link from "next/link";
import { useAuthContext } from "src/lib/auth_client";
import SuperJSON from "superjson";

const Home: NextPage = () => {
  const { userPerson } = useAuthContext();

  return (
    <>
      <h1>Redirecting...</h1>
      <p className="flex gap-2">
        <Link className="text-blue-700 underline" href={"eventDocuments"}>
          Event documents
        </Link>
        <Link className="text-blue-700 underline" href={"fullDocuments"}>
          Full documents
        </Link>
        <Link className="text-blue-700 underline" href={"auth/login"}>
          Auth Page
        </Link>
      </p>
      <p>{JSON.stringify(userPerson)}</p>
    </>
  );
};

export default Home;
