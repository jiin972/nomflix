import { useQuery } from "@tanstack/react-query";
import { getMovie, type IGetmovieResult } from "../api";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  useScroll,
  type Variants,
} from "framer-motion";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  // 로딩된 영화 배열의 첫번째 항목을 화면전체에 표시하는 banner
  height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  gap: 20px;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.$bgPhoto}); // 두가지 배경으로 텍스트 가시성 확보 및 이미지 노출
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 45%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const rowVariants: Variants = {
  hidden: { x: window.outerWidth + 5 }, // 첫 box와 마지막 box사이의 gap을 위해 + 10 추가
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 }, // 첫 box와 마지막 box사이의 gap을 위해 - 10 추가
};

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  height: 0;
  padding-bottom: 150%;
  background-image: url(${(props) => props.$bgPhoto});
  background-position: center center;
  background-size: cover;
  &:first-child {
    // 좌/우 끝단의 Box가 scale이 달라질 때 잘리는 것을 방지위해 transform-origin설정
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const boxVariants: Variants = {
  normal: { scale: 1, transition: { type: "tween" } },
  hover: {
    scale: 1.3,
    y: -40,
    transition: { delay: 0.3, type: "tween" },
  },
};

const Info = styled(motion.div)`
  padding: 10px; // 비율로 수정해야 할 지도..
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 15px;
  }
`;

const infoVariants: Variants = {
  hover: { opacity: 1, transition: { delay: 0.3, type: "tween" } },
};

const Overlay = styled(motion.div)`
  position: fixed; // 오버레이화면이 전체화면을 차지하게끔 fixed
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 80vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 35%;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 40px;
  padding: 10px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -60px;
`;

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
                <BigMovie
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
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
