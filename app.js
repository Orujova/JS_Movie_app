const API_KEY = "1c107ac0fc3773c6b752c2fb2bb7c62f";
const search = document.getElementById("search");
const resultsDiv = document.getElementById("results");

let activeLanguage = window.localStorage.getItem("lang") || "en-US";
const languageSelect = document.getElementById("language");
languageSelect.value = activeLanguage;
const movieContainer = document.querySelector(".movies");
const pagination = document.querySelector("#pagination");
let activePage = 1;
let totalPageCount = 0;
languageSelect.addEventListener("change", (e) => {
  activeLanguage = e.target.value;
  window.localStorage.setItem("lang", activeLanguage);
  getMovies();
});
const makePagination = () => {
  pagination.innerHTML = "";
  const firsPage = document.createElement("li");
  firsPage.innerHTML = "&larr;";

  pagination.append(firsPage);
  if (activePage === 1) {
    firsPage.remove();
  }
  let start = activePage - 4 > 0 ? activePage - 4 : 1;
  let end = activePage + 4;

  const lastPage = document.createElement("li");
  lastPage.innerHTML = "&rarr;";
  if (activePage === totalPageCount) {
    lastPage.remove();
  }
  for (let i = start; i <= end && i <= totalPageCount; i++) {
    let page = document.createElement("li");
    page.textContent = i;

    if (i === activePage) {
      page.classList.add("active");
    }
    firsPage.addEventListener("click", () => {
      activePage = i - 5 > 0 ? i - 5 : 1;
      makePagination();
      getMovies();
    });
    page.addEventListener("click", () => {
      activePage = i;
      makePagination();
      getMovies();
    });

    pagination.append(page);
    lastPage.addEventListener("click", () => {
      activePage = i - 3 > 0 ? i - 3 : 1;
      makePagination();
      getMovies();
    });
    pagination.append(lastPage);
  }
};
const getMovies = () => {
  movieContainer.innerHTML = "";
  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=${activeLanguage}&page=${activePage}`
  )
    .then((a) => a.json())
    .then((data) => {
      totalPageCount = data.total_pages;
      data.results.map((movie) => {
        const div = document.createElement("div");
        div.classList.add("movie");
        const title = document.createElement("h4");
        title.textContent = movie.title;
        const poster = document.createElement("img");

        poster.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/original/${movie.poster_path}`
        );
        div.append(poster, title);
        movieContainer.append(div);
      });
      makePagination();
    });
};
getMovies();

search.addEventListener("keyup", function () {
  const searchText = search.value;
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&include_adult=false&language=${activeLanguage}&query=${searchText}`
  )
    .then((res) => res.json())
    .then((searchdata) => {
      resultsDiv.innerHTML = "";
      searchdata.results.map((a) => {
        const list = document.createElement("li");
        list.classList.add("list");

        const img = document.createElement("img");
        img.src = `https://image.tmdb.org/t/p/original/${a.poster_path}`;
        img.classList.add("search_image");

        const span = document.createElement("span");
        span.classList.add("span");
        span.textContent = a.title;

        list.append(img, span);

        resultsDiv.append(list);
      });
    });
});
