const API_KEY = "a0853dac7be056950373836b6fa3350c";
const BAST_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetmovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[]; // 현재 페이지에 있는 영화 목록
  total_pages: number;
  total_results: number; // 서버에 있는 전체 영화 수
}

export interface ITvshow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  original_name: string;
  overview: string;
}

export interface IGetTvshowResult {
  page: number;
  results: ITvshow[];
  total_pages: number;
  total_results: number;
}

export function getMovie() {
  return fetch(`${BAST_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export const getTvshow = () => {
  return fetch(`${BAST_PATH}/tv/popular?api_key=${API_KEY}`).then((respons) =>
    respons.json()
  );
};
