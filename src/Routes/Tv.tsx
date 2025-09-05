import { useQuery } from "@tanstack/react-query";
import { getTvshow, type IGetTvshowResult } from "../api";
import { makeImagePath } from "../utils";
import {
  Banner,
  Box,
  Loader,
  Overview,
  Row,
  rowVariants,
  Slider,
  Title,
  Wrapper,
} from "../Components/styles";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

function Tv() {
  const { data, isLoading } = useQuery<IGetTvshowResult>({
    queryKey: ["tvShow", "popular"],
    queryFn: getTvshow,
  });
  const [index, setIndex] = useState(0);
  const incraseIndex = () => setIndex((prev) => prev + 1);
  // console.log(data); fetcher FN으로 받은 data 확인.
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
            <AnimatePresence initial={false}>
              <Row
                variants={rowVariants}
                transition={{ type: "tween", duration: 0.7 }}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>testBox</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
