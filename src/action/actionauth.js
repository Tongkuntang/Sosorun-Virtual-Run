import { apiservice } from "../service/service";

export async function authActionLogin(body1) {
  try {
    const response = await apiservice({
      path: "/authen/login",
      method: "post",
      body: body1,
    });

    if (response.status == 200) {
      return response.data;
    } else {
      alert("Username หรือ Password ไม่ถูกต้อง ");
      return null;
    }
  } catch (error) {
    throw error;
  }
}
export async function getActionUser(Login) {
  try {
    const response = await apiservice({
      path: "/user/getuser",
      method: "get",
      token: Login.accessToken,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function actionEditprofile({ body, token }) {
  // console.log("33", body);
  try {
    const response = await apiservice({
      path: "/user/edit-profile",
      method: "put",
      body,
      token: token.accessToken,
    });

    console.log(response);

    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

export async function actionregister(body) {
  try {
    const response = await apiservice({
      path: "/authen/register",
      method: "post",
      body,
    });
    return response.data;
  } catch (error) {
    return false;
  }
}

export async function actionEditwal({ body, token }) {
  try {
    const response = await apiservice({
      path: "/user/edit_wallet",
      method: "put",
      body,
      token: token.accessToken,
    });

    if (response.status == 200) {
      return response;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
