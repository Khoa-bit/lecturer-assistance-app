import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { type AppType } from "next/app";
import type { ReactElement, ReactNode } from "react";
import AuthContextProvider from "src/contexts/AuthContextProvider";
import localFont from "next/font/local";
import "../styles/globals.css";

const inter = localFont({
  src: "../../public/fonts/Inter-VariableFont_slnt,wght.ttf",
  variable: "--font-inter",
});

const materialSymbolsRounded = localFont({
  src: "../../public/fonts/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].woff2",
  variable: "--font-materialSymbolsRounded",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);

  return (
    <AuthContextProvider>
      <div
        className={`${inter.variable} font-sans ${materialSymbolsRounded.variable} min-h-screen bg-gray-100`}
      >
        {layout}
      </div>
    </AuthContextProvider>
  );
};

export default MyApp;
