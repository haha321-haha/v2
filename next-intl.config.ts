import type { NextIntlConfig } from "next-intl";
import { defaultLocale, locales } from "./i18n/constants";

const config: NextIntlConfig = {
  locales,
  defaultLocale,
  localePath: "./messages",
};

export default config;
