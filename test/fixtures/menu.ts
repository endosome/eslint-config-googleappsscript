function onOpen(_event: GoogleAppsScript.Events.SheetsOnOpen): void {
  SpreadsheetApp.getUi().createMenu('Tools').addItem('Run', 'runReport').addToUi();
}

function runReport(): void {
  const unused = 1;

  Logger.log('done');
}

function readLocale(): string {
  try {
    return Session.getActiveUserLocale();
  } catch (_) {
    const [_first, second] = ['a', 'b'];

    return second;
  }
}
