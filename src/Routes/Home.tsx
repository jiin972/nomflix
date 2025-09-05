import { useQuery } from "@tanstack/react-query";
import { getMovie, type IGetmovieResult } from "../api";
import { AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import {
  Wrapper,
  Loader,
  Banner,
  Title,
  Overview,
  Slider,
  Row,
  rowVariants,
  Box,
  boxVariants,
  Info,
  infoVariants,
  Overlay,
  BigScreenContainer,
  BigCover,
  BigTitle,
  BigOverview,
} from "../Components/styles";
const offset = 6; // Row에 보여줄 Box 갯수를 자르기 위한 상수변수

type MovieParams = {
  movieId: string;
};

function Home() {
  const navigate = useNavigate(); // url변경을 위한 변수 정의
  const bigMovieMatch = useMatch("/movies/:movieId") as {
    params: MovieParams;
  } | null;
  console.log("useMatch결과:", bigMovieMatch);
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetmovieResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: getMovie,
  });
  // console.log("데이타:", data, "로딩:", isLoading);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false); // 빠른 클릭으로 인한 버그 방지를 위해 state추가
  const incraseIndex = () => {
    //해당 함수 수정, 1번 클릭수 return하는 함수 생성
    if (data) {
      //totalMovie의 타입확정(number) 위해 타입가드 사용
      if (leaving) return;
      toggleLeaving();
      const totalMovie = data?.results.length - 1; //Banner에 사용된 무비 제외
      const maxIndex = Math.floor(totalMovie / offset) - 1; //floor를 통해 남는 영화는 반내림으로 제거
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  }; // 함수로 전달해야 함
  const toggleLeaving = () => setLeaving((prev) => !prev); // leaving을 toggle하는 함수 생성
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/"); // 오버레이 컴포넌트 클릭 시, 홈으로 가는 함수 생성
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );
  console.log("foundMovie:", clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  left: "20px",
                  fontSize: "28px",
                  fontWeight: "600",
                }}
              >
                Now playing
              </div>
              <Row
                variants={rowVariants}
                transition={{ type: "tween", duration: 0.7 }}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
              >
                {data?.results
                  .slice(1) // Banner의 영화를 제외하고 시작,
                  .slice(offset * index, offset * index + offset) //6개의 영화를 담긴 배열을 만들기 위한 수식
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      $bgPhoto={makeImagePath(movie.poster_path, "w500")} //map함수 내 있으니 movie인자 사용
                      key={movie.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigScreenContainer
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigScreenContainer>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
