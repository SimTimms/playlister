import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

async function createLogService(
  graphqlURL: string,
  logMessage: string,
  aiResponse: string,
  sessionId: string,
  logType: string
) {
  try {
    const client = new ApolloClient({
      uri: graphqlURL,
      cache: new InMemoryCache(),
    });
    console.log(aiResponse);
    const createLog = gql`
      mutation CreateLog($input: LogInput!) {
        createLog(input: $input) {
          _id
          logMessage
          aiResponse
          sessionId
          logType
          createdAt
          updatedAt
        }
      }
    `;

    const results = await client.mutate({
      mutation: createLog,
      variables: { input: { logMessage, aiResponse, sessionId, logType } },
    });

    const data = results;

    console.log('Log created successfully:', data);
  } catch (error) {
    console.warn('Log writing failed:', error);
    return null;
  }
}

export default createLogService;
