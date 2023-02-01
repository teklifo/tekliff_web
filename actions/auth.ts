import { Dispatch } from "react";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";
import api from "../utils/api";
import { Types } from "../store/reducers";
import { AuthContext, User } from "../types";
import Failure from "../utils/errors/failure";
import ServerError from "../utils/errors/serverError";
import getErrorMessage from "../utils/errors/getErrorMessage";

export const loadUser = () => {
  return async (
    dispatch: Dispatch<{
      type: Types.LoadUser;
      payload: AuthContext;
    }>
  ) => {
    const token = Cookies.get("token");
    const locale = Cookies.get("NEXT_LOCALE");

    if (!token) {
      dispatch({
        type: Types.LoadUser,
        payload: { isInit: true },
      });
    }

    const config = {
      headers: {
        Authorization: `JWT ${token}`,
        "Accept-Language": locale,
      },
    };

    try {
      const response = await api.get<User>(`/api/auth`, config);
      dispatch({
        type: Types.LoadUser,
        payload: { user: response.data, token, isInit: true },
      });
    } catch (error) {
      Cookies.remove("token");
      dispatch({
        type: Types.LoadUser,
        payload: { isInit: true },
      });
    }
  };
};

export const loadUserOnServer = async (token: string) => {
  const locale = Cookies.get("NEXT_LOCALE");

  const config = {
    headers: {
      Authorization: `JWT ${token}`,
      "Accept-Language": locale,
    },
  };

  try {
    const result = await api.get<User>(`/api/auth`, config);
    return result.data;
  } catch (error) {
    return undefined;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const locale = Cookies.get("NEXT_LOCALE");

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  };

  try {
    await api.post("/api/users", { name, email, password }, config);
  } catch (error) {
    if (isAxiosError(error) && error.code === "500")
      throw new ServerError(error.message);
    else {
      throw new Failure(getErrorMessage(error));
    }
  }
};

export const loginUser = (email: string, password: string) => {
  return async (
    dispatch: Dispatch<{ type: Types.LoginUser; payload: string }>
  ) => {
    const locale = Cookies.get("NEXT_LOCALE");

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": locale,
      },
    };

    try {
      const response = await api.post<{ token: string }>(
        "/api/auth",
        { email, password },
        config
      );
      Cookies.set("token", response.data.token, { expires: 365 });
      dispatch({ type: Types.LoginUser, payload: response.data.token });
    } catch (error) {
      if (isAxiosError(error) && error.code === "500")
        throw new ServerError(error.message);
      else {
        throw new Failure(getErrorMessage(error));
      }
    }
  };
};

export const verifyUser = (activationToken: string) => {
  return async (
    dispatch: Dispatch<{
      type: Types.VerifyUser;
      payload: string;
    }>
  ) => {
    const locale = Cookies.get("NEXT_LOCALE");

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": locale,
      },
    };

    try {
      const response = await api.post<{ token: string }>(
        "/api/auth/verification",
        { activationToken },
        config
      );
      Cookies.set("token", response.data.token, { expires: 365 });
      dispatch({ type: Types.VerifyUser, payload: response.data.token });
    } catch (error) {
      if (isAxiosError(error) && error.code === "500")
        throw new ServerError(error.message);
      else {
        throw new Failure(getErrorMessage(error));
      }
    }
  };
};

export const logout = () => {
  Cookies.remove("token");
  return async (
    dispatch: Dispatch<{
      type: Types.Logout;
      payload: null;
    }>
  ) => {
    dispatch({
      type: Types.Logout,
      payload: null,
    });
  };
};

export const updateUser = async (token: string, data: { name: string }) => {
  const locale = Cookies.get("NEXT_LOCALE");

  const config = {
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  };

  try {
    await api.put("/api/users", data, config);
  } catch (error) {
    if (isAxiosError(error) && error.code === "500")
      throw new ServerError(error.message);
    else {
      throw new Failure(getErrorMessage(error));
    }
  }
};

export const changeUserPassword = async (
  token: string,
  data: { password: string; newPassword: string }
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
    await api.put("/api/users/change_password", data, config);
  } catch (error) {
    if (isAxiosError(error) && error.code === "500")
      throw new ServerError(error.message);
    else {
      throw new Failure(getErrorMessage(error));
    }
  }
};

export const deleteUser = (token: string) => {
  return async (
    dispatch: Dispatch<{
      type: Types.DeleteUser;
      payload: null;
    }>
  ) => {
    const locale = Cookies.get("NEXT_LOCALE");

    const config = {
      headers: {
        Authorization: `JWT ${token}`,
        "Accept-Language": locale,
      },
    };

    try {
      await api.delete("/api/users", config);
      Cookies.remove("token");
      dispatch({
        type: Types.DeleteUser,
        payload: null,
      });
    } catch (error) {
      if (isAxiosError(error) && error.code === "500")
        throw new ServerError(error.message);
      else {
        throw new Failure(getErrorMessage(error));
      }
    }
  };
};

export const createResetPasswordToken = async (email: string) => {
  const locale = Cookies.get("NEXT_LOCALE");

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  };

  try {
    await api.post("/api/auth/create_reset_password_token", { email }, config);
  } catch (error) {
    if (isAxiosError(error) && error.code === "500")
      throw new ServerError(error.message);
    else {
      throw new Failure(getErrorMessage(error));
    }
  }
};

export const verifyResetPasswordToken = async (
  email: string,
  resetPasswordToken: string
) => {
  const locale = Cookies.get("NEXT_LOCALE");

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
  };

  try {
    await api.post(
      "/api/auth/check_reset_password_token",
      { email, resetPasswordToken },
      config
    );
  } catch (error) {
    if (isAxiosError(error) && error.code === "500")
      throw new ServerError(error.message);
    else {
      throw new Failure(getErrorMessage(error));
    }
  }
};

export const resetPassword = (
  email: string,
  resetPasswordToken: string,
  password: string
) => {
  return async (
    dispatch: Dispatch<{
      type: Types.VerifyUser;
      payload: string;
    }>
  ) => {
    const locale = Cookies.get("NEXT_LOCALE");

    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": locale,
      },
    };

    try {
      const response = await api.post<{ token: string }>(
        "/api/auth/reset_password",
        { email, resetPasswordToken, password },
        config
      );

      Cookies.set("token", response.data.token, { expires: 365 });
      dispatch({ type: Types.VerifyUser, payload: response.data.token });
    } catch (error) {
      if (isAxiosError(error) && error.code === "500")
        throw new ServerError(error.message);
      else {
        throw new Failure(getErrorMessage(error));
      }
    }
  };
};
