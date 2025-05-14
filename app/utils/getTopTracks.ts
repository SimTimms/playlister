import { ArtistDetailsType } from './getArtistDetails';
import { getCachedData } from '../redis/helpers';
import { setCachedData } from '../redis/helpers';
import getBearer from './getBearerToken';

const CACHE_EXPIRATION = 86400;

export type AlbumType = string;

export type CombinedArtistType = {
  artist: ArtistDetailsType;
  tracks: AlbumType[];
};

const getTopTracks = async (
  artist: ArtistDetailsType
): Promise<CombinedArtistType> => {
  try {
    async function response(artistId: string): Promise<AlbumType[]> {
      const cacheKey = `artistTracksIdsBB:${artistId}`;
      const cachedTracks = await getCachedData(cacheKey);
      if (cachedTracks) {
        return cachedTracks.split(',');
      }
      const bearer = await getBearer();

      const tracks: AlbumType[] = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearer.token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(async (data: any): Promise<AlbumType[]> => {
          if (!data.tracks) {
            return [];
          }
          const tracks: AlbumType[] = data.tracks.map(
            (track: any): AlbumType => {
              return `${track.name}|${track.uri}`;
            }
          );
          await setCachedData(cacheKey, tracks.join(','), CACHE_EXPIRATION);
          return tracks;
        })
        .catch((error) => {
          console.error('Error:', error);
          return [];
        });

      return tracks;
    }

    const tracks = await response(artist.id);
    return { artist: { ...artist }, tracks: tracks };
  } catch (error) {
    console.error('Error:', error);
    return { artist: { ...artist }, tracks: [] };
  }
  return { artist: { ...artist }, tracks: [] };
};

export default getTopTracks;
