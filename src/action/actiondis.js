import { apiservice } from "../service/service";

export async function getalldiscount_list(token) {
  try {
    const response = await apiservice({
      method: "get",
      path: "/freepoint/getalldiscount_list",
      token: token.accessToken,
    });
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}

export async function getdiscount_list({ token, category_name }) {
  try {
    const response = await apiservice({
      method: "get",
      path: "/freepoint/getdiscount_listBycategory/" + category_name,
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getchackdatediscount({ token, discount_id }) {
  try {
    const response = await apiservice({
      method: "get",
      path: "/freepoint/getchackdatediscount/" + discount_id,
      token: token.accessToken,
    });
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}
