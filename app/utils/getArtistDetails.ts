import chunkArray from './chunkArray';
import { getCachedData } from '../redis/helpers';
import { setCachedData } from '../redis/helpers';
import getMoreDetails from './getMoreDetails';
import getBearer from './getBearerToken';

const CACHE_EXPIRATION = 86400;

export type ArtistDetailsType = {
  id: string;
  name: string;
  genres: string[];
  image: string;
  followers: number;
  popularity: number;
};

const getArtistDetails = async (
  artistIds: string[]
): Promise<ArtistDetailsType[]> => {
  try {
    const bearer = await getBearer();
    const chunkedArtistIds = chunkArray(artistIds, 50);
    const artistDetailsPromises = chunkedArtistIds.map(async (chunk, index) => {
      const cacheKey = `artistDetailsChunkBBCD:${chunkedArtistIds[0]}-${index}`;
      const cachedChunk = await getCachedData(cacheKey);
      //  const performanceDetails = await getMoreDetails('d');
      //   console.log(performanceDetails);
      if (cachedChunk) {
        return JSON.parse(cachedChunk);
      }

      return fetch(
        `https://api.spotify.com/v1/artists?ids=${chunk.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearer.token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(async (data: any) => {
          const genres = data.artists.map(async (item: any): Promise<any[]> => {
            const moreDetails = await getMoreDetails(item.name);

            const events = moreDetails.events;
            const eventArr = [];
            for (let i = 0; i < events.length; i++) {
              eventArr.push({
                id: item.id,
                name: item.name,
                genres: item.genres,
                image: item.images[0],
                followers: item.followers.total,
                popularity: item.popularity,
                href: item.href,
                events: moreDetails.events[i],
                description: moreDetails.description,
              });
            }

            return eventArr;
          });

          const resolvedGenres: any[] = await Promise.all(genres);
          await setCachedData(
            cacheKey,
            JSON.stringify(resolvedGenres),
            CACHE_EXPIRATION
          );
          return resolvedGenres;
        })
        .catch((error) => {
          console.error('Error 1:', error);
          return [];
        });
    });
    const artistDetailsArray = await Promise.all(artistDetailsPromises);
    const artistDetails = artistDetailsArray.flat();
    const spreadArray: any[] = [];

    for (let i = 0; i < artistDetails.length; i++) {
      const events = artistDetails[i];

      events.forEach((element: any) => {
        spreadArray.push(element);
      });
    }
    return spreadArray;
  } catch (error) {
    console.error('Error 2 :', error);
    return [];
  }

  return [];
};

export default getArtistDetails;
