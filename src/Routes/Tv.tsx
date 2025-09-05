import { useQuery } from "@tanstack/react-query";
import { getTvshow, type IGetTvshowResult } from "../api";
import { makeImagePath } from "../utils";
import {
  Banner,
  BigCover,
  BigOverview,
  BigScreenContainer,
  BigTitle,
  Box,
  boxVariants,
  Info,
  infoVariants,
  Loader,
  Overlay,
  Overview,
  Row,
  rowVariants,
  Slider,
  Title,
  Wrapper,
} from "../Components/styles";
import { AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

const offset = 6;
type TvShowParams = {
  tvshowId: string;
};

function Tv() {
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetTvshowResult>({
    queryKey: ["tvShow", "popular"],
    queryFn: getTvshow,
  });
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const bigTvShowMatch = useMatch("/tv/:tvshowId") as {
    params: TvShowParams; // URL에서 추출된 아이디 (문자열 타입)
  } | null;

  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTvShow = data?.results.length - 1;
      const maxIndex = Math.floor(totalTvShow / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  // console.log(data); fetcher FN으로 받은 data 확인.
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvshowId: number) => {
    //API로부터 인자로 숫자 타입의 영화 ID를 받음
    navigate(`/tv/${tvshowId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedTvShow =
    bigTvShowMatch?.params.tvshowId &&
    data?.results.find(
      (tvshow) => String(tvshow.id) === bigTvShowMatch.params.tvshowId
    );
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
            <Title>{data?.results[0].original_name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  left: "0px",
                  fontSize: "28px",
                  fontWeight: "600",
                }}
              >
                Popular
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
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tvshow) => (
                    <Box
                      layoutId={tvshow.id + ""}
                      variants={boxVariants}
                      whileHover={"hover"}
                      initial="normal"
                      key={tvshow.id}
                      onClick={() => onBoxClicked(tvshow.id)}
                      $bgPhoto={makeImagePath(tvshow.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tvshow.original_name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvShowMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigScreenContainer
                  layoutId={bigTvShowMatch.params.tvshowId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedTvShow && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTvShow.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />

                      <BigTitle>{clickedTvShow.original_name}</BigTitle>
                      <BigOverview>{clickedTvShow.overview}</BigOverview>
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

export default Tv;
