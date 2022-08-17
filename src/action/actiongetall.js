import { apiservice } from "../service/service";

export async function getallmission(token) {
  try {
    const response = await apiservice({
      path: "/event/getallmission",
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getallevent(token) {
  try {
    const response = await apiservice({
      path: "/event/getallevent",
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getalleventid({ token, id }) {
  try {
    const response = await apiservice({
      path: "/event/getevent_select/" + id,
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getalllevel(token) {
  try {
    const response = await apiservice({
      path: "/event/getallrankup",
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getmyeventid({ token, uid }) {
  try {
    const response = await apiservice({
      path: "/event/getmyEvent/" + uid,
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
