function onOpen() {
  SpreadsheetApp.getActive().toast('Hello');
  Logger.log(process.version);
}
