const calculateMatches = (userScores, winningNumbers) => {
  let matches = 0;

  const safeWinningNumbers = winningNumbers.map(n => Number(n));

  userScores.forEach((score) => {
    // Only count if it's a valid Number match
    if (safeWinningNumbers.includes(Number(score.value))) {
      matches++;
    }
  });

  return matches;
};

module.exports = calculateMatches;