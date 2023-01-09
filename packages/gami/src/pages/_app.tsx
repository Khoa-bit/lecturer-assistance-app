import { type AppType } from "next/app";
import { AuthContext } from "src/contexts/AuthContext";
import AuthContextProvider from "src/contexts/AuthContextProvider";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
};

export default trpc.withTRPC(MyApp);
