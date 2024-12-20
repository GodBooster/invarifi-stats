import fs from 'fs';

export const isLocalPath = path => {
  return !/http|https|www/.test(path);
};

export const readFromFile = (path, toJson = true) => {
  const data = fs.readFileSync(path, 'utf-8');
  if (toJson) return JSON.parse(data);
  return data;
};

export const readFromNetwork = (endpoint, toJson = true) => {
  return fetch(endpoint).then(res => {
    if (toJson) return res.json();
    return res;
  });
};

export const appFetch = async (endpoint, toJson = true) => {
  if (isLocalPath(endpoint)) {
    return readFromFile(endpoint, toJson);
  } else {
    return await readFromNetwork(endpoint, toJson);
  }
};
