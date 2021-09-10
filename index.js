let diffEl = document.getElementById("diff");
let playEl = document.getElementById("play");

let diff;

const updateDiff = () => {
  diff = Number.parseInt(diffEl.value);
  console.log(diff);
};

const navigateToGame = () => {
  window.location.href = `https://ashtonsprunger.github.io/ai-games/checkers.html?diff=${diff}`;
};

diffEl.addEventListener("change", updateDiff);
playEl.addEventListener("click", navigateToGame);

updateDiff();
