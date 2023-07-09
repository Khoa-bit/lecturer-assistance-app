import { useRouter } from "next/router";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useAuthContext } from "src/lib/auth_client";
import { useCallback, useState } from "react";
import { MdiMicrosoft } from "../../components/icons/MdiMicrosoft";
import { IUIcon } from "../../components/icons/IUIcon";

interface LoginInputs {
  email: string;
  password: string;
}

function LoginSecret() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();
  const [showInvalidEmail, setShowInvallidEmail] = useState(false);

  const router = useRouter();

  const { signInWithPassword, signInWithOAuth2AndCookie, userPerson, signOut } =
    useAuthContext();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await signInWithPassword(data.email, data.password);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMicrosoftOAuth = useCallback(async () => {
    try {
      await signInWithOAuth2AndCookie("microsoft");
      router.push("/");
    } catch (error) {
      setShowInvallidEmail(true);
      console.error(error);
    }
  }, [router, signInWithOAuth2AndCookie]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <section className="flex flex-col items-center justify-center gap-8 rounded-2xl bg-white p-8">
        <IUIcon className="h-24 w-24 drop-shadow-md"></IUIcon>
        <h1 className="text-xl font-semibold">Dev Log in</h1>
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <input
            className="input-bordered input border"
            type="email"
            {...register("email", { required: true })}
            placeholder="Username / Email"
          />
          {errors.email && <span>Email is required</span>}

          <input
            className="input-bordered input border"
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
          />
          {errors.password && <span>Password is required</span>}

          <input className="btn" type="submit" value={"Sign in"} />
        </form>
        <button className="btn" onClick={signOut}>
          Sign out
        </button>

        <p>{JSON.stringify(userPerson)}</p>
      </section>
    </div>
  );
}

export default LoginSecret;
