async function getAccessToken(): Promise<string | null> {
  const client_id = process.env.SPOTIFY_API_ID; // Your client id
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID || '',
      client_secret: process.env.CLIENT_SECRET || '',
    }),
  })
    .then((response) => response.json())
    .then((data: any) => {
      console.log('TOKEN:', data);
      return 'asdasd';
    });

  return '';
}
export default getAccessToken;
