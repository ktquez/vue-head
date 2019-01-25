import Vue, { PluginObject } from 'vue';
declare const VueHead: PluginObject<{}>;
export = VueHead;

declare module 'vue/types/options' {
  interface TitleOptions {
    inner?: string;
    separator?: string;
    complement?: string;
  }
  interface MetaOptions {
    itemprop?: string;
    property?: string;
    content?: string;
    id?: string;
    name?: string;
  }
  interface ComponentOptions<V extends Vue> {
    head?: {
      title?: TitleOptions | (() => TitleOptions);
      meta?: MetaOptions[] | (() => MetaOptions[]);
      link?: any[];
      script?: any[];
      style?: any[];
    };
  }
}
