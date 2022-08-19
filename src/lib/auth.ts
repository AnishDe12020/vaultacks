import { AppConfig, AuthOptions } from "@stacks/connect";

export const appConfig = new AppConfig(["store_write", "publish_data"]);

export const appDetails: AuthOptions["appDetails"] = {
  name: "Vaultacks",
  icon: "/vercel.svg",
};
