import type {GetServerSidePropsContext, InferGetServerSidePropsType,} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";

// Cors href links to open with HTTP Only cookies from the client-side sending to the backend
function Redirect({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  useEffect(() => {
    router.replace(data.destination).then((r) => r);
  }, [data.destination, router]);
  return <></>;
}

export const getServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const queryUrl = query.url;
  if (typeof queryUrl !== "string") {
    return {
      redirect: {
        destination: "/notFound",
        permanent: false,
      },
    };
  }

  const originalUrl = new URL(decodeURI(queryUrl));
  originalUrl.searchParams.delete("emailLink");

  return {
    props: {
      data: { destination: originalUrl.toString() },
    },
  };
};

export default Redirect;
