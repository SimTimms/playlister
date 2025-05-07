const getPlaylistDetails = async (bearer: string): Promise<any[]> => {
  try {
    const response = fetch(
      'https://api.spotify.com/v1/playlists/19ogylHUc5PIkdS0jH8F4V?si=d3b9dda41b7c4538',
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
        const artists = data.tracks.items.map((item: any) => {
          const artist = item.track.artists[0];
          return {
            name: artist.name,
            id: artist.id,
            href: artist.href,
            uri: artist.uri,
          };
        });

        return artists;
      });
    return await response;
  } catch (error) {
    console.error('Error:', error);
  }
  return [];
};

export default getPlaylistDetails;
