const calculateMatches = (userScores, winningNumbers) => {
  let matches = 0;

  userScores.forEach((score) => {
    if (winningNumbers.includes(score.value)) {
      matches++;
    }
  });

  return matches;
};

module.exports = calculateMatches;