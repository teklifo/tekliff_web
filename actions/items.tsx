import Cookies from "js-cookie";
import { isAxiosError } from "axios";
import api from "../utils/api";
import { Item } from "../types";
import Failure from "../utils/errors/failure";
import ServerError from "../utils/errors/serverError";
import getErrorMessage from "../utils/errors/getErrorMessage";

export const downloadItems = async (
  token: string,
  company_id: number,
  items: Item[]
) => {
  const locale = Cookies.get("NEXT_LOCALE");

  const config = {
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  };

  try {
    const response = await api.post<Item[]>(
      "/api/items",
      { company_id, items },
      config
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.code === "500")
      throw new ServerError(error.message);
    else {
      throw new Failure(getErrorMessage(error));
    }
  }
};
