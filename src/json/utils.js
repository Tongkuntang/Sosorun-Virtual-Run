export function autolize_Lv(params) {
  try {
    console.log(params);
    let res = [];
    let maxlv = 300;

    for (let index = 0; index < maxlv; index++) {
      res = res.concat({
        lv: index + 1,
        exp: 2000 * index,
        grid: {
          uri:
            "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/" +
            (index > -1 && index < 10
              ? "1"
              : index > 9 && index < 20
              ? "10"
              : index > 19 && index < 30
              ? "20"
              : index > 29 && index < 40
              ? "30"
              : index > 39 && index < 50
              ? "40"
              : index > 49 && index < 60
              ? "50"
              : index > 59 && index < 70
              ? "60"
              : index > 69 && index < 80
              ? "70"
              : index > 79 && index < 90
              ? "80"
              : index > 89 && index < 100
              ? "90"
              : "100") +
            ".png",
        },
        rank:
          index + 1 > 0 && index + 1 < 60
            ? "D"
            : index + 1 > 60 && index + 1 < 120
            ? "C"
            : index + 1 > 120 && index + 1 < 180
            ? "B"
            : "A",
      });
    }
    const result = res.filter((item, index) => item.exp <= params).reverse()[0];
    console.log(result);
    return { ...result };
  } catch (error) {
    return {
      lv: 1,
      exp: 0,
      grid: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/1.png",
      },
    };
  }
}

export function nextautolize_Lv(params) {
  try {
    let res = [];
    let maxlv = 300;

    for (let index = 0; index < maxlv; index++) {
      res = res.concat({
        lv: index + 1,
        exp: 2000 * index,
        grid: {
          uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/1.png",
        },
        rank:
          index + 1 > 10 && index + 1 < 60
            ? "D"
            : index + 1 > 60 && index + 1 < 120
            ? "C"
            : index + 1 > 120 && index + 1 < 180
            ? "B"
            : "A",
      });
    }

    return res.filter((item, index) => item.exp > params)[0];
  } catch (error) {
    return {
      lv: 2,
      exp: 20,
      grid: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/1.png",
      },
    };
  }
}
