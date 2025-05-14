import { getCachedData } from '../redis/helpers';
import { setCachedData } from '../redis/helpers';
import getBearer from './getBearerToken';

const CACHE_EXPIRATION = 600;

type ArtistType = string;

const getPlaylistDetails = async (playlistId: string): Promise<string[]> => {
  const cacheKey = `playlistIdBBC:${playlistId}`;
  const cachedUniqueIds = await getCachedData(cacheKey);
  if (cachedUniqueIds) {
    return cachedUniqueIds.split(',');
  }

  async function fetchDetail(
    limit: number,
    offset: number
  ): Promise<ArtistType[]> {
    try {
      const bearer = await getBearer();
      const response = fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearer.token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data: any) => {
          if (!data || !data.items) {
            console.error('Invalid data format:', data);
          }
          const artists: string[] = data.items.map((item: any) => {
            const artist = item.track.artists[0];
            return artist.id;
          });

          return artists;
        });

      return await response;
    } catch (error) {
      return [];
    }
  }

  const detailsArray = await Promise.all([
    ...(await fetchDetail(100, 0)),
    ...(await fetchDetail(100, 100)),
    ...(await fetchDetail(100, 200)),
    ...(await fetchDetail(100, 300)),
    ...(await fetchDetail(100, 400)),
    ...(await fetchDetail(100, 500)),
    ...(await fetchDetail(100, 600)),
    ...(await fetchDetail(100, 700)),
  ]);
  const uniqueArtistIds = [...new Set(detailsArray)];
  await setCachedData(cacheKey, uniqueArtistIds.join(','), CACHE_EXPIRATION);
  return uniqueArtistIds;
};

export default getPlaylistDetails;
