import { google } from "googleapis";

function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string;
const SHEET = "Sheet1";

async function getAllRows(): Promise<string[][]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!A2:D`,
  });
  return (res.data.values as string[][] | null | undefined) ?? [];
}

export async function addUserEmail(email: string): Promise<void> {
  const rows = await getAllRows();
  const alreadyActive = rows.some(
    (row) => row[1]?.toLowerCase() === email.toLowerCase() && row[3] === "TRUE"
  );
  if (alreadyActive) {
    throw new Error("DUPLICATE_EMAIL");
  }

  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!A:D`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[crypto.randomUUID(), email, new Date().toISOString(), "TRUE"]],
    },
  });
}

export async function getUserEmail(): Promise<string> {
  const rows = await getAllRows();
  return rows
    .filter((row) => row[3] === "TRUE")
    .map((row) => row[1])
    .join(", ");
}

export async function removeUserEmail(email: string): Promise<void> {
  const sheets = getSheets();
  const rows = await getAllRows();

  const rowIndex = rows.findIndex(
    (row) => row[1]?.toLowerCase() === email.toLowerCase()
  );
  if (rowIndex === -1) return;

  // +2: 1-indexed + skip header row
  const sheetRowNumber = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!D${sheetRowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [["FALSE"]] },
  });
}
