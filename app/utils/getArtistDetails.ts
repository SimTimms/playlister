export type ArtistDetailsType = {
  id: string;
  name: string;
  genres: string[];
  image: string;
  followers: number;
  popularity: number;
};

const getArtistDetails = async (
  bearer: string,
  artistIds: string[]
): Promise<ArtistDetailsType[]> => {
  try {
    const response = fetch(
      `https://api.spotify.com/v1/artists?ids=${artistIds.join(',')}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearer}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data: any) => {
        const genres = data.artists.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            genres: item.genres,
            image: item.images[0],
            followers: item.followers.total,
            popularity: item.popularity,
          };
        });
        return genres;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    return await response;
  } catch (error) {
    console.error('Error:', error);
  }
  return [];
};

export default getArtistDetails;
