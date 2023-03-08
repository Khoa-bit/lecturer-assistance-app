import ErrorPage from "next/error";

const NotFound = () => {
  return <ErrorPage statusCode={404}></ErrorPage>;
};

export default NotFound;
