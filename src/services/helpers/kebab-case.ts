/**
 * Kebab Case
 * @param word string
 * @returns string
 */
export function kebabCase(word: string): string {
  if (word) {
    const newWord = word.replace(/[A-Z ]/g, s => (s !== ' ' ? '-' + s.toLowerCase() : ''));
    if (newWord.startsWith('-')) {
      return newWord.slice(1);
    } else {
      return newWord;
    }
  } else {
    return '';
  }
}
