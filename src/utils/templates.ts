export const convertFromTemplate = (template: string, replaceKey: string, replaceValue: string) => {
  return template.replace(replaceKey, replaceValue);
};

export const convertFromChainTemplate = (template: string, chain: string) => {
  return convertFromTemplate(template, '{chain}', chain);
};
