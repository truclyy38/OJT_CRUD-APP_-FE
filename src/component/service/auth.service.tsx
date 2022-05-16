import axios from "axios";

const API_URL = "http://random-chat-api-server.herokuapp.com/";

/**
 * auth.service
 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */

 /**
    * login
    * @Param username, password
    * @Return token
    */
export const login = (username: any, password: any) => {
  return axios
    .post(API_URL + "users/sign_in", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

 /**
    * logout
    */
export const logout = () => {
  localStorage.removeItem("user");
};

