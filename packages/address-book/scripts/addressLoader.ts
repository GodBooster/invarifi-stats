import { appFetch } from './fetch';
import sp from 'synchronized-promise';

const pathTemplate = process.env.CUBERA_ADDRESS_BOOK_TEMPLATE;

export const convertFromTemplate = (template: string, replaceKey: string, replaceValue: string) => {
  return template.replace(replaceKey, replaceValue);
};

export const convertFromChainTemplate = (template: string, chain: string) => {
  return convertFromTemplate(template, '{chain}', chain);
};

export const readFromFileIfExists = <TReturn>(
  pathTemplate: string | undefined,
  chain: string,
  defaultValue: TReturn
): TReturn => {
  if (!pathTemplate) return defaultValue;

  const path = convertFromChainTemplate(pathTemplate, chain);

  try {
    const content = sp(appFetch);
    return content(path, true) as TReturn;
  } catch (error) {
    return defaultValue;
  }
};

export const readCuberaConfigFromFileIfExists = <TReturn>(
  chain: string,
  defaultValue: TReturn
): TReturn => {
  return readFromFileIfExists<TReturn>(pathTemplate, chain, defaultValue);
};
