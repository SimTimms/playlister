import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { ChatHistory } from "../../types/";

async function getChatHistory(
  graphqlURL: string,
  sessionId: string
): Promise<ChatHistory[]> {
  try {
    const client = new ApolloClient({
      uri: graphqlURL,
      cache: new InMemoryCache(),
    });

    const getChatHistory = gql`
      query FilterLogs($filter: LogFilter) {
        filterLogs(filter: $filter) {
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

    const results = await client.query({
      query: getChatHistory,
      variables: { filter: { sessionId } },
    });

    const data = results;
    return data.data.filterLogs;
  } catch (error) {
    console.warn("Unable to get chat history:", error);
    return [];
  }
}

export default getChatHistory;
