import { apiservice } from "../service/service";

export async function RequestFriend({ body, token }) {
  try {
    const response = await apiservice({
      path: "/friend/request-friend",
      method: "post",
      body,
      token: token.accessToken,
    });
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
export async function actionEditprofile({ body, token }) {
  // console.log("33", body);
  try {
    const response = await apiservice({
      path: "/user/edit-profile",
      method: "put",
      body,
      token: token.accessToken,
    });

    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}
//รับเพื่อน
export async function getfriendreq(token) {
  try {
    const response = await apiservice({
      path: "/friend/getfriendreq",
      method: "get",
      token: token.accessToken,
    });

    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}

//รอเพื่อนรับ
export async function getreqfriend(token) {
  try {
    const response = await apiservice({
      path: "/friend/getreqfriend",
      method: "get",
      token: token.accessToken,
    });

    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}
export async function Delfriend({ body, token }) {
  try {
    const response = await apiservice({
      path: "/friend/cancelled-friend",
      method: "delete",
      body,
      token: token.accessToken,
    });
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}
export async function actionAcceptFriend({ body1, token }) {
  try {
    const response = await apiservice({
      path: "/friend/accept-friend",
      method: "put",
      body: body1,
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    return error;
  }
}
export async function actionMyfriend({ token, uid }) {
  try {
    const response = await apiservice({
      path: "/friend/getMyfriend/" + uid,
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
