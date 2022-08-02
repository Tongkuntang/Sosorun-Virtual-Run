import axios from "axios";

// const BaseUrl = "https://api-ssr.wishesexistence.co/api";
// const BaseUrl = "https://api.sosorun.com/api";
const BaseUrl = "https://api.sosorun.com/api";

// api.sosorun.com;

async function apiservice({ url, method, path, body, token }) {
  try {
    let header = {
      "Content-Type": "application/json",
    };

    if (token != undefined) {
      header.Authorization = "Bearer " + token;
    }
    const response = await axios({
      method: method,
      data: body,
      url: (url || BaseUrl) + path,
      headers: header,
    });
    // console.log("responseAll", response);
    if (response.status == 200) {
      return {
        data: response.data,
        status: 200,
      };
    }
    // response
    return response;
  } catch (error) {
    return {
      data: error.response.data,
      status: error.response.status,
    };
  }
}

export { apiservice };
