const { Request } = require("../dist/common");
const resource = new Request(
  "http://127.0.0.1:1024"
);

resource
  .use("request", (params) => {
    return params;
  })
  .use("response", (params) => {
    return params;
  })
  .use("error", (error) => {
    console.log(error);
    return error;
  });
  // resource
  resource
  .GET(
    "/getList",
    {
      name: "hello",
      age: 22,
    },
    {},
    {}
  ).then((result) => {
    console.log(result)
  }).catch((err) => {
    console.log(err)
  });