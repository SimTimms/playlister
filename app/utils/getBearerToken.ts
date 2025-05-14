let bearer: { token: string | null; expires: Date } = {
  token: null,
  expires: new Date(),
};

const getBearer = async (): Promise<{
  token: string | null;
  expires: Date;
}> => {
  if (!bearer.token || new Date() > bearer.expires) {
    var urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('client_id', 'd14b6131ffa04327935cebc05ceda948');
    urlencoded.append('client_secret', 'e89db983f4ca4e0b93cf3fac57e4c2da');

    var requestOptions = {
      method: 'POST',
      body: urlencoded,
    };

    await fetch(
      'https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=d14b6131ffa04327935cebc05ceda948&client_secret=e89db983f4ca4e0b93cf3fac57e4c2da',
      requestOptions
    )
      .then((response) => response.json())
      .then((result: any) => {
        let timeObject = new Date();
        const milliseconds = 3600 * 1000; // 10 seconds = 10000 milliseconds
        timeObject = new Date(timeObject.getTime() + milliseconds);
        bearer = { token: result.access_token, expires: timeObject };
      })
      .catch((error) => console.log('error', error));
  }
  return bearer;
};

export default getBearer;
