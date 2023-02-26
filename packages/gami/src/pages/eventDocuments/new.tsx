import Head from "next/head";
import MainLayout from "src/components/layouts/MainLayout";

function NewEventDocument() {
  return (
    <>
      <Head>
        <title>New event document</title>
      </Head>
      <h1>Creating your new event document...</h1>
    </>
  );
}
NewEventDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewEventDocument;
