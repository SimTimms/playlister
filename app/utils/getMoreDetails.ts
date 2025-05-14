import chunkArray from './chunkArray';
import { getCachedData } from '../redis/helpers';
import { setCachedData } from '../redis/helpers';
const CACHE_EXPIRATION = 86400;

export type ArtistDetailsType = {
  id: string;
  name: string;
  genres: string[];
  image: string;
  followers: number;
  popularity: number;
};

type EventType = {
  venue: string;
  time: string;
};

const getMoreDetails = async (
  artistName: string
): Promise<{ events: EventType[]; description: string }> => {
  try {
    const cacheKey = `moreDetailsBB:${artistName}`;
    const cachedChunk = await getCachedData(cacheKey);
    if (cachedChunk) {
      console.log('cached chunk F');
      return JSON.parse(cachedChunk);
    }

    const getData = async (
      artistName: string
    ): Promise<{ events: EventType[]; description: string }> => {
      const newName = artistName.replace(/ /g, '-');
      return await fetch(`https://greatescapefestival.com/artists/${newName}`, {
        method: 'GET',
      })
        .then(async (response) => {
          try {
            const responseText = await response.text();
            try {
              const events = responseText.split('event grid');
              const eventArr = [];
              for (let i = 0; i < events.length; i++) {
                const thisEvent = events[i];
                let venue = thisEvent.split(
                  `<a href="https://greatescapefestival.com/festival-venue/`
                )[1];

                if (venue) {
                  venue = venue.split('<')[0].split('>')[1];
                } else {
                  continue;
                }

                const time = thisEvent
                  .split('</div>')[1]
                  .split('</div>')[0]
                  .split(`">`)[1]
                  .trim();

                eventArr.push({
                  venue: venue,
                  time: time,
                });
              }

              const description = responseText
                .split('cont isgigs')[1]
                .split('<p>')[1]
                .split('</p>')[0];

              await setCachedData(
                cacheKey,
                JSON.stringify({ events: eventArr, description }),
                CACHE_EXPIRATION
              );
              return { events: eventArr, description };
            } catch (error) {
              return { events: [], description: '' };
            }
          } catch (error) {
            console.log(error);
            return { events: [], description: '' };
          }
        })
        .catch((error) => {
          console.error('Error 1:', error);
          return { events: [], description: '' };
        });
    };
    const result = await getData(artistName);
    return result;
  } catch (error) {
    console.error('Error 2 :', error);
    return { events: [], description: '' };
  }
};

export default getMoreDetails;
