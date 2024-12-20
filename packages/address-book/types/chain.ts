import { Cubera } from './cubera';
import type Token from './token';

export default interface Chain {
  readonly platforms: Record<string, Record<string, string>> & {
    cubera: Cubera;
  };
  readonly tokens: Record<string, Token>;
  readonly tokenAddressMap: Record<string, Token>;
}
