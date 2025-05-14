function chunkArray(
  array: string[],
  chunkSize: number,
  offset: number = 0
): string[][] {
  const result: string[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export default chunkArray;
