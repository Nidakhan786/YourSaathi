// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  parseAppID: "uo4hPQHJdB7f6XsZj8UX1MHlFsuDFrdjbf7UwHZd",
  parseServerUrl: "https://parseapi.back4app.com/",
  PORT:4040,
  // parseAppID: "e5HKZKlw7qknBIPR6J6lmDf4G5l7EqVDBb4IJHac",
  javaScriptKey: "OSw8IwQgo4WfhrcR6Rrrt0BBP5YmIjWslaXJFwuM", //Please add for Back4App Environment else keep it empty
  IS_BACK4APP : true,
  CRYPTO_KEY: "",
  CRYPTO_ENABLE: 0,
};
export const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
