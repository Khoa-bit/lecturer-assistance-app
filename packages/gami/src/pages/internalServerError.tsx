import ErrorPage from "next/error";

const InternalServerError = () => {
  return <ErrorPage statusCode={500}></ErrorPage>;
};

export default InternalServerError;
