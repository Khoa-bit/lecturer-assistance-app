import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import type { DocumentsRecord, FullDocumentsRecord } from "raito";
import { FullDocumentsCategoryOptions } from "raito";
import { DocumentsPriorityOptions, DocumentsStatusOptions } from "raito";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import MainLayout from "src/components/layouts/MainLayout";

type FullDocumentInput = DocumentsRecord & FullDocumentsRecord;

function NewFullDocument({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const { register, handleSubmit } = useForm<FullDocumentInput>();

  const onSubmit: SubmitHandler<FullDocumentInput> = (data) =>
    console.log(data);

  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <h1>Events</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true })} />
        <input {...register("thumbnail", {})} />
        <select {...register("category")}>
          {Object.entries(FullDocumentsCategoryOptions).map(([stringValue]) => (
            <option key={stringValue} value={stringValue}>
              {stringValue}
            </option>
          ))}
        </select>
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

export const getServerSideProps = async ({}: GetServerSidePropsContext) => {
  return {
    props: {},
  };
};

NewFullDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewFullDocument;
