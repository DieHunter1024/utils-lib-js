const { Request } = require("../dist/common");
// import {AbortController} from "node"
const resource = new Request(
  "http://127.0.0.1:1024"
);

resource
  .use("request", (params) => {
    // console.log(params);
    return params;
  })
  .use("response", (params) => {
    // console.log(params);
    return params;
  })
  .use("error", (error) => {
    // console.log(error);
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
    console.log(result,'121212')
  }).catch((err) => {
    console.log(err)
  });