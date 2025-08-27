import { useQuery } from "@tanstack/react-query";
import { getMovie } from "../api";

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovie,
  });
  console.log("데이타:", data, "로딩:", isLoading);
  return <div style={{ height: "200vh" }}>Home</div>;
}
export default Home;
