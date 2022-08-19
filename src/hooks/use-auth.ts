import { showConnect } from "@stacks/connect";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import { appDetails } from "../lib/auth";
import { userDataAtom, userSessionAtom } from "../store/auth";

export const useAuth = () => {
  const userSession = useAtomValue(userSessionAtom);
  const [userData, setUserData] = useAtom(userDataAtom);

  const authenticate = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    });
  };

  const logout = () => {
    userSession.signUserOut();
    window.location.reload();
  };

  return { userSession, userData, setUserData, authenticate, logout };
};
