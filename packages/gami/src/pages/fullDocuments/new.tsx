import Head from "next/head";
import MainLayout from "src/components/layouts/MainLayout";

function NewFullDocument() {
  return (
    <>
      <Head>
        <title>New full document</title>
      </Head>
      <h1>Creating your new full document...</h1>
    </>
  );
}
NewFullDocument.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default NewFullDocument;
