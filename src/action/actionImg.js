import * as ImagePicker from "expo-image-picker";
import { apiservice } from "../service/service";
export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true,
  });

  if (!result.cancelled) {
    try {
      const response = await apiservice({
        path: "/imaged/create",
        method: "post",
        body: {
          name: new Date().getTime(),
          base64: result.base64,
          // .replace("data:image/png;base64,", "")
          // .replace("data:image/jpg;base64,", "")
          // .replace("data:image/jpeg;base64,", ""),
        },
      });

      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }
};
export async function DelImg(propf) {
  try {
    const response = await apiservice({
      path: "/image/delete/" + propf,
      method: "delete",
    });
    if (response.status == 200) {
      // console.log(response.data);
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}
