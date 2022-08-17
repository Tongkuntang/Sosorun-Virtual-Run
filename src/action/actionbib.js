import { apiservice } from "../service/service";

export async function getbibevent({ token, id }) {
  try {
    const response = await apiservice({
      path: "/event/getbibevent/" + id,
      method: "get",
      token: token.accessToken,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}
// bibevent
export async function postbib_event({ body, token }) {
  try {
    const response = await apiservice({
      path: "/event/postbib_event",
      method: "post",
      body,
      token: token.accessToken,
    });
    if (response.status == 200) {
      return response;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
// ส่งได้เลยถ้าเป็น[] ถ้ามีข้อมูลให้ทำเส้นput event/updatebib_event
export async function updatebib_event({ body, token }) {
  try {
    const response = await apiservice({
      path: "/event/updatebib_event",
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
// getbibที่ได้ไปแสดง (ไอดีเทเบิ่ล)
export async function getbibselect({ token, id }) {
  try {
    const response = await apiservice({
      path: "/event/getbibselect/" + id,
      method: "get",
      token: token.accessToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getbib_Byevent({ token, id }) {
  try {
    const response = await apiservice({
      path: "/event/getbib_Byevent/" + id,
      method: "get",
      token: token.accessToken,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function updatebib({ body1, token }) {
  try {
    const response = await apiservice({
      path: "/event/updatebibrunning",
      method: "put",
      body: body1,
      token: token.accessToken,
    });

    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    throw error;
  }
}
