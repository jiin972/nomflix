import { styled } from "styled-components";
import { motion, type Variants } from "framer-motion";

export const Wrapper = styled.div`
  background-color: black;
  /* overflow-x: hidden; */
  padding: 10px;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ $bgPhoto: string }>`
  // 로딩된 영화 배열의 첫번째 항목을 화면전체에 표시하는 banner
  min-height: 100vh;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  gap: 20px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto}); // 두가지 배경으로 텍스트 가시성 확보 및 이미지 노출
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 68px;
`;

export const Overview = styled.p`
  font-size: 30px;
  width: 45%;
`;

export const Slider = styled.div`
  position: relative;
  top: -100px;
`;

export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

export const rowVariants: Variants = {
  hidden: { x: window.outerWidth + 5 }, // 첫 box와 마지막 box사이의 gap을 위해 + 10 추가
  visible: { x: 0 },
  exit: { x: -window.outerWidth - 5 }, // 첫 box와 마지막 box사이의 gap을 위해 - 10 추가
};

export const Box = styled(motion.div)<{ $bgPhoto: string }>`
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

export const boxVariants: Variants = {
  normal: { scale: 1, transition: { type: "tween" } },
  hover: {
    scale: 1.3,
    y: -40,
    transition: { delay: 0.3, type: "tween" },
  },
};

export const Info = styled(motion.div)`
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

export const infoVariants: Variants = {
  hover: { opacity: 1, transition: { delay: 0.3, type: "tween" } },
};

export const Overlay = styled(motion.div)`
  position: fixed; // 오버레이화면이 전체화면을 차지하게끔 fixed
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
`;

export const BigScreenContainer = styled(motion.div)`
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

export const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 35%;
`;

export const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 40px;
  padding: 10px;
  position: relative;
  top: -60px;
`;

export const BigOverview = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -60px;
`;
