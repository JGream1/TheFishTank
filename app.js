async function loadData() {
  const res = await fetch('data/games.json');
  return await res.json();
}

function round5(x) {
  return Math.round(x / 5) * 5;
}

async function calculate() {
  const base = Number(document.getElementById('baseBuyIn').value);
  const out = document.getElementById('output');
  const data = await loadData();

  const totals = {};   // lifetime net winnings per player

  // Build totals dynamically
  data.games.forEach(game => {
    game.results.forEach(r => {
      if (!totals[r.player]) totals[r.player] = 0;
      totals[r.player] += (r.cashOut - r.buyIn);
    });
  });

  // Calculate handicaps
  const handicaps = {};

  Object.keys(totals).forEach(player => {
    let raw = base + totals[player];
    let rounded = round5(raw);

    let min = base * 0.5;
    let max = base * 1.5;

    let final = Math.min(Math.max(rounded, min), max);

    handicaps[player] = {
      net: totals[player],
      suggestedBuyIn: final
    };
  });

  out.textContent = JSON.stringify(handicaps, null, 2);
}
