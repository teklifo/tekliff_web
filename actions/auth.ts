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

    if (!token) {
      dispatch({
        type: Types.LoadUser,
        payload: { isInit: true },
      });
    }

    const config = {
      headers: {
        Authorization: `JWT ${token}`,
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
  const config = {
    headers: {
      Authorization: `JWT ${token}`,
    },
  };

  try {
    const result = await api.get<User>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`,
      config
    );
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
  const config = {
    headers: {
      "Content-Type": "application/json",
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
    const config = {
      headers: {
        "Content-Type": "application/json",
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

export const verifyUser = (email: string, activationToken: string) => {
  return async (
    dispatch: Dispatch<{
      type: Types.VerifyUser;
      payload: string;
    }>
  ) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await api.post<{ token: string }>(
        "/api/auth/verification",
        { email, activationToken },
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
  const config = {
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
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
  const config = {
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
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
    const config = {
      headers: {
        Authorization: `JWT ${token}`,
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
  const config = {
    headers: {
      "Content-Type": "application/json",
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
  const config = {
    headers: {
      "Content-Type": "application/json",
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
    const config = {
      headers: {
        "Content-Type": "application/json",
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
