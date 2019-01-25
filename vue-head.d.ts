import Vue, { PluginObject } from 'vue';
declare const VueHead: PluginObject<{}>;
export = VueHead;
interface TitleOptions {
  inner?: string;
  separator?: string;
  complement?: string;
}
interface ElementOptions extends Object {
  /** Shorthand of `charset` */
  ch?: string;
  charset?: string;
  /** Shorthand of `target` */
  tg?: string;
  target?: string;
  /** Shorthand of `name` */
  n?: string;
  name?: string;
  /** Shorthand of `http-equiv` */
  he?: string;
  'http-equiv'?: string;
  /** Shorthand of `itemprop` */
  ip?: string;
  itemprop?: string;
  /** Shorthand of `content` */
  c?: string;
  content?: string;
  /** Shorthand of `property` */
  p?: string;
  property?: string;
  /** Shorthand of `scheme` */
  sc?: string;
  scheme?: string;
  /** Shorthand of `rel` */
  r?: string;
  rel?: string;
  /** Shorthand of `href` */
  h?: string;
  href?: string;
  /** Shorthand of `sizes` */
  sz?: string;
  sizes?: string;
  /** Shorthand of `type` */
  t?: string;
  type?: string;
  /** Shorthand of `src` */
  s?: string;
  src?: string;
  /** Shorthand of `async` */
  a?: boolean;
  async?: boolean;
  /** Shorthand of `defer` */
  d?: string;
  defer?: string;
  /** Shorthand of `inner` */
  i?: string;
  inner?: string;
  /**
   * Option for undo tag when leave the component
   * https://github.com/ktquez/vue-head#undo-elements
   */
  undo?: boolean;
  /**
   * Id for element updating
   * https://github.com/ktquez/vue-head#replace-content-the-elements
   */
  id?: string;
  /**
   * Insert element in body
   */
  body?: boolean;
}
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    head?: {
      title?: TitleOptions | (() => TitleOptions);
      meta?: ElementOptions[] | (() => ElementOptions[]);
      link?: ElementOptions[] | (() => ElementOptions[]);
      script?: ElementOptions[] | (() => ElementOptions[]);
      style?: ElementOptions[] | (() => ElementOptions[]);
    };
  }
}
