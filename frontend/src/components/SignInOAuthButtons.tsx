import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // sign in with google then get credientials and token of user from google then navigate to auth-callback page
  //to save user to database
  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };
  return (
    <Button
      onClick={signInWithGoogle}
      variant={"secondary"}
      className="w-full text-white border-zinc-200 h-11"
    >
      Continue With Google
    </Button>
  );
};

export default SignInOAuthButtons;
