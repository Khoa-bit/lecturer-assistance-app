import { useRouter } from "next/router";
import { useAuthContext } from "src/lib/auth_client";
import { useCallback, useEffect, useState } from "react";
import { IUIcon } from "../../components/icons/IUIcon";
import { MdiMicrosoft } from "../../components/icons/MdiMicrosoft";

function Login() {
  const [showInvalidEmail, setShowInvalidEmail] = useState(false);

  const router = useRouter();

  const { signInWithOAuth2AndCookie, userPerson } = useAuthContext();

  useEffect(() => {
    if (userPerson) {
      // User has already logged in
      router.push("/");
    }
  }, [router, userPerson]);

  const handleMicrosoftOAuth = useCallback(async () => {
    try {
      await signInWithOAuth2AndCookie("microsoft");
      router.push("/");
    } catch (error) {
      setShowInvalidEmail(true);
      console.error(error);
    }
  }, [router, signInWithOAuth2AndCookie]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <section className="flex flex-col items-center justify-center gap-8 rounded-2xl bg-white p-8">
        <IUIcon className="h-24 w-24 drop-shadow-md"></IUIcon>
        <h1 className="text-xl font-semibold">Log in</h1>
        {showInvalidEmail && (
          <p className="w-48 text-center text-error">
            Invalid email address <i>@hcmiu.edu.vn</i>
            <br />
            <span className="font-semibold underline">Faculty only</span>
          </p>
        )}
        <button
          className="flex items-center justify-center gap-2 rounded bg-blue-400 p-2 font-semibold text-white transition-colors hover:bg-blue-500"
          onClick={handleMicrosoftOAuth}
        >
          <MdiMicrosoft className="h-8 w-8"></MdiMicrosoft>
          Continue with Microsoft
        </button>
      </section>
    </div>
  );
}

export default Login;
