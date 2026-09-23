import Landing from "@/components/Landing";
import { useStore } from "@/store/useStore";

export default function Home() {
const User =  useStore(state=>state.user)
console.log(User)
  return (
    <>
      <Landing />
      
    </>
  );
}
