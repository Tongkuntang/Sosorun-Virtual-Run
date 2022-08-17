import { apiservice } from "../service/service";

export async function getAllfreepoint(token) {
  try {
    const response = await apiservice({
      path: "/freepoint/getAllfreepoint",
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
//+freepoint_id ไอดีเทเบล
export async function getfreepointUser({ token, id }) {
  try {
    const response = await apiservice({
      path: "/freepoint/getfreepointByid/" + id,
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function postuseraddfreepoint({ body, token }) {
  try {
    const response = await apiservice({
      path: "/freepoint/postuseraddfreepoint",
      method: "post",
      body,
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getfreepoint({ token, ID }) {
  try {
    const response = await apiservice({
      path: "/freepoint/getfreepointUser/" + ID,
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
