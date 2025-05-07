export const connectionURLValidator = (connectionURL: string) => {
  if (!connectionURL) {
    throw new Error("Redis connection URL is not defined");
  }
};

export const passwordValidator = (password: string) => {
  if (!password) {
    throw new Error("Redis connection URL is not defined");
  }
};
