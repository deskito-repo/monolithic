export const generateRandomCharacters = (length = 8) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let randomAlphabetList = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    randomAlphabetList += alphabet[randomIndex];
  }

  return randomAlphabetList;
};
