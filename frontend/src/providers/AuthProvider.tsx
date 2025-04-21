import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

// add the token to Axios instance so we dont have to add it everytime in header
const updateApiToken = (token: string | null) => {
  if (token)
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);

  //getAdminStatus
  const { checkAdminStatus } = useAuthStore();

  //check if the user has the token or not
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        console.log(token);

        //new adminCheckStatus code
        if (token) {
          await checkAdminStatus();
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken, checkAdminStatus]);

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );

  return <>{children}</>;
};

export default AuthProvider;
