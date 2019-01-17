var env = process.env.NODE_ENV || "development";
console.log("env ***** ", env);

if(env === "development" || env === "test"){
  //config.json is not pushed to the repository to keep the information private
  var config = require("./config.json");
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
