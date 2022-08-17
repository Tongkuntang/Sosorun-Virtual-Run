import { apiservice } from "../service/service";

export async function authHistrory({ body, token }) {
  try {
    const response = await apiservice({
      path: "/event/posthistory",
      method: "post",
      body,
      token: token.accessToken,
    });
    console.log(">>>>>>>>>>", response);
    if (response.status == 200) {
      // console.log("login", response);
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
export async function getHistrory({ token, id, date }) {
  try {
    const response = await apiservice({
      path: "/event/gethistory/" + id + "/" + date,
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getallhistory(token) {
  try {
    const response = await apiservice({
      path: "/event/getallhistory",
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function resultsrunning({ body, token }) {
  try {
    const response = await apiservice({
      path: "/event/resultsrunning",
      method: "post",
      body,
      token: token.accessToken,
    });
    if (response.status == 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
// /event/resultsrunning
export async function getresultsrunning({ token, ID }) {
  try {
    const response = await apiservice({
      path: "/event/getresultsrunning" + "?joinEvent_id=" + ID,
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getsucceed(token) {
  try {
    const response = await apiservice({
      path: "/event/getuserjoineventtrue",
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
