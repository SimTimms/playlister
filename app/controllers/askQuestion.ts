import { Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';
import getPlaylistDetails from '../utils/getPlaylistDetails';
import getArtistDetails from '../utils/getArtistDetails';
import getTopTracks from '../utils/getTopTracks';
import { ArtistDetailsType } from '../utils/getArtistDetails';

interface AskQuestionRequest extends Request {
  body: {
    question: string;
  };
}

const askQuestion = async (
  req: AskQuestionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //https://open.spotify.com/playlist/4z56A77P0onHJOgItRGR2W?si=f1f56fe26d484290
    // const playlistId = '4z56A77P0onHJOgItRGR2W'; //  Luke;

    //open.spotify.com/playlist/3g2AIxdNdLLcWHVOuVxBXg?si=f3a37438400742a1

    // const playlistId = '19ogylHUc5PIkdS0jH8F4V';//TGE
    //const playlistId = '3o60YYFMgopRPOXOYxpkTz'; //  Tim;
    //const playlistId = '7gobrIxFHBcPKlZfRYRBN1'; //Bean
    //const playlistId = '5syAOZdtRs7vk82rzYfq1R'; //Ed
    //const playlistId = '3gS4Gq1iv442Dp8NPkS888';
    const playlistId = '3V1tvYLZ8TodrWzJukaZzL'; //Phil
    //const playlistId = '3g2AIxdNdLLcWHVOuVxBXg'; //Yakop
    //open.spotify.com/playlist/3V1tvYLZ8TodrWzJukaZzL?si=ab3772b9e0074f31
    //open.spotify.com/playlist/3gS4Gq1iv442Dp8NPkS888?si=74d291d0042e4107
    //open.spotify.com/playlist/5syAOZdtRs7vk82rzYfq1R?si=b4f61174a92145b9
    //open.spotify.com/playlist/7gobrIxFHBcPKlZfRYRBN1?si=f26d3c104f794a1e
    //open.spotify.com/playlist/3o60YYFMgopRPOXOYxpkTz?si=c3680eb2ab144747
    getPlaylistDetails(playlistId)
      .then(async (artistIds: string[]) => {
        try {
          getArtistDetails(artistIds).then(
            async (artistDetails: ArtistDetailsType[]) => {
              const topTracksPromises = artistDetails.map(
                async (artist: ArtistDetailsType) => {
                  return await getTopTracks(artist);
                }
              );

              const topTracks = await Promise.all(topTracksPromises);
              return res.json({
                answer: '',
                data: topTracks,
              });
            }
          );
        } catch (error) {
          next(error);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    /*
    const { question } = req.body;
    const response = await client.responses.create({
      model: 'gpt-4.1',
      input:
        'What bands are playing at The Great Escape Festival 2025? Please look up the answer online and provide a list of the bands.',
    });

    console.log('Response:', response);
    */

    // return res.json({ answer: response });
  } catch (error) {
    next(error);
  }
};

export default askQuestion;
