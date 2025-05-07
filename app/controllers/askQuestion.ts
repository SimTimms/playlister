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

const bearer =
  'BQDb8F8C0khfckmTvFojPt72hKuFNOs91xPREDiE-t_ZSBhzDBKHpD5yatp7du1agck4mBz5zn2YkjvNeXtHPRkaJi6KNUsngwG4ecTAty4F_SvYiiW-hLRZd-Sbo36Xq7Nm1dHuxFoeEgBAYdI5qYMr24OjNzi99TSOJJFkGuSVGW1asa1cd79uD3QKRy_eduKE-gw3_d-cqECKLatnGk76RlfM_hcNPZBZjm4cGHohKdi3jcxXB_00xGqkLet6qSMyX0Vv--Jec8WyPNkikN3FB7rscCXCrbZoL6kFEEcOMw';

const askQuestion = async (
  req: AskQuestionRequest,
  res: Response,
  next: NextFunction
) => {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    getPlaylistDetails(bearer)
      .then((artists: any[]) => {
        const artistIds = artists.map((artist: any) => artist.id).slice(0, 49);

        try {
          getArtistDetails(bearer, artistIds).then(
            async (artistDetails: ArtistDetailsType[]) => {
              const topTracksPromises = artistDetails.map(
                async (artist: ArtistDetailsType) => {
                  return await getTopTracks(bearer, artist.id);
                }
              );

              const topTracks = await Promise.all(topTracksPromises);
              console.log('Top Tracks:', topTracks);
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
    return res.json({
      answer: 'This is a test response',
    });
    // return res.json({ answer: response });
  } catch (error) {
    next(error);
  }
};

export default askQuestion;
