import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { fetchUser } from "./lib/api";
import type { LoginResponseType } from "./lib/types";
import { useStore } from "./store/useStore";
function App() {
  const setUser = useStore((state) => state.setUser);
  // const userLoader = useStore((state) => state.userLoader);
  const setUserLoader = useStore((state) => state.setUserLoader);
  useEffect(() => {
    fetchUser<LoginResponseType>()
      .then((resData) => {
        setUser(resData.user);
      })
      .catch((e) => console.log(e.message))
      .finally(() => {
        setUserLoader(false);
      });
  }, []);

  return <AppRoutes />;
}

export default App;
