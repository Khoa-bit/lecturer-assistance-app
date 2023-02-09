import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type { DocumentsRecord } from "raito";
import { DocumentsPriorityOptions, DocumentsStatusOptions } from "raito";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import MainLayout from "src/components/layouts/MainLayout";

function NewEvent({}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { register, handleSubmit } = useForm<DocumentsRecord>();

  const onSubmit: SubmitHandler<DocumentsRecord> = (data) => console.log(data);

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <h1>Events</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true })} />
        <input {...register("thumbnail", {})} />
        <select {...register("priority", { required: true })}>
          {Object.entries(DocumentsPriorityOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
        <select {...register("status", { required: true })}>
          {Object.entries(DocumentsStatusOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
        <input type="submit" />
      </form>
    </>
  );
}
("Event Doc 01 - KhoaBit");
export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};

NewEvent.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewEvent;
