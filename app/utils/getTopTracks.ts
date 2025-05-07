export type AlbumType = {
  album: string;
  uri: string;
};

import { ArtistDetailsType } from './getArtistDetails';

const getTopTracks = async (
  bearer: string,
  artistId: string
): Promise<AlbumType[]> => {
  try {
    const response = fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
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
        const tracks = data.tracks.map((track: any) => {
          console.log('Response:', track);
          return {
            album: track.album.name,
            uri: track.album.uri,
          };
        });
        return tracks;
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

export default getTopTracks;
