import { Dispatch, SetStateAction, useState } from "react";

const useLoading = () => {
  const [isLoading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return { isLoading, startLoading, stopLoading, setLoading };
};

export default useLoading;
