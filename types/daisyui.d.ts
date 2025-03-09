declare module "daisyui" {
  import { PluginCreator } from "tailwindcss/types/config";
  const daisyui: PluginCreator;
  export default daisyui;
}

declare module "tailwindcss/types/config" {
  export interface Config {
    daisyui?: {
      themes?: Array<
        | string
        | {
            [key: string]: {
              primary?: string;
              secondary?: string;
              accent?: string;
              neutral?: string;
              "base-100"?: string;
              "base-200"?: string;
              "base-300"?: string;
              "base-content"?: string;
              info?: string;
              success?: string;
              warning?: string;
              error?: string;
              [key: string]: string | undefined;
            };
          }
      >;
      darkTheme?: string;
      base?: boolean;
      styled?: boolean;
      utils?: boolean;
      prefix?: string;
      logs?: boolean;
      themeRoot?: string;
    };
  }
}
