export const getEnvironmentData = async(environment: string, fetch: (...args: any[]) => any) => {
  const fileName =
    environment === 'development'
      ? 'environment.dev.json'
      : 'environment.json';
  const data = await fetch(`./${fileName}`);
  return data.json();
};
