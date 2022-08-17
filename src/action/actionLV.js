import { apiservice } from "../service/service";
export async function getLV(token) {
  try {
    const response = await apiservice({
      path: "/banner/getLv_ListAll",
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
