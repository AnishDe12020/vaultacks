import { UserData, UserSession } from "@stacks/connect";
import { atom } from "jotai";
import { appConfig } from "../lib/auth";

export const userSessionAtom = atom(() => new UserSession({ appConfig }));

export const userDataAtom = atom<UserData | null>(null);
