const API_KEY = "a0853dac7be056950373836b6fa3350c";
const BAST_PATH = "https://api.themoviedb.org/3";

export function getMovie() {
  return fetch(`${BAST_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
