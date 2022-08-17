import { apiservice } from "../service/service";

export async function getAllbanner(token) {
  try {
    const response = await apiservice({
      path: "/banner/getAllbanner",
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getBanNer({ token, page }) {
  try {
    const response = await apiservice({
      path: "/banner/getbanner/" + page,
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
