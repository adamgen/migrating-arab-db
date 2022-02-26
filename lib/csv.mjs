import { parse } from "csv-parse/sync";
import { knex } from "./knex.mjs";

import fs from "fs";
import readline from "readline";
import { chalk } from "zx";

async function readFileLines(filePath, lines) {
  const fileStream = fs.createReadStream(filePath);

  const promisableLine = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  let i = 0;
  let contents = "";

  for await (const line of promisableLine) {
    contents = contents + line + "\n";

    i++;
    if (i === lines) {
      // return contents;
    }
  }
  return contents;
}

const getCsvContents = async (dbName) => {
  const buffer = await readFileLines(
    path.join("csv-files", `${dbName}.csv`),
    100
  );
  const rows = parse(buffer, { relax_quotes: true, relax_column_count: true });
  const columns = rows.splice(0, 1);
  return { rows, columns: columns[0] };
};

export const importSingleTable = async (tableName, rowMapFunction) => {
  console.log(chalk.blue(`Importing table ${tableName}`));
  const { rows, columns } = await getCsvContents(tableName);
  for (let i = 0; i < rows.length; i++) {
    const row = rowMapFunction(rows[i]);
    const insertObj = columns.reduce((prev, next, i) => {
      prev[next] = row[i];
      return prev;
    }, {});
    try {
      await knex(tableName).insert(insertObj);
    } catch (e) {
      console.error(e);
      throw new Error(`index ${i} has bad value of: "${JSON.stringify(row)}`);
    }
  }
};

const intify = (row, intsArray) => {
  intsArray.forEach((columnNumber) => {
    row[columnNumber] = parseInt(row[columnNumber], 10);
    row[columnNumber] = isNaN(row[columnNumber]) ? null : row[columnNumber];
  });
  return row;
};

const csvHistory = async () => {
  await importSingleTable("history", (row) =>
    intify(
      row,
      [0, 1, 3, 4, 5, 6, 9, 10, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
    )
  );
  // `ID`  int,
  // `word`  int,
  // `actionUTC`  nvarchar (510),
  // `action`  int,
  // `user`  int,
  // `statusOld`  int,
  // `statusNew`  int,
  // `errorTypes`  nvarchar (510),
  // `explain`  nvarchar (510),
  // `showOld`  int,
  // `showNew`  int,
  // `hebrewOld`  nvarchar (100),
  // `hebrewNew`  nvarchar (100),
  // `hebrewDefOld`  nvarchar (200),
  // `hebrewDefNew`  nvarchar (100),
  // `arabicOld`  nvarchar (100),
  // `arabicNew`  nvarchar (100),
  // `arabicWordOld`  nvarchar (100),
  // `arabicWordNew`  nvarchar (100),
  // `pronunciationOld`  nvarchar (100),
  // `pronunciationNew`  nvarchar (100),
  // `searchStringOld`  nvarchar (400),
  // `searchStringNew`  nvarchar (400),
  // `rootOld`  int,
  // `rootNew`  int,
  // `partOfSpeachOld`  int,
  // `partOfSpeachNew`  int,
  // `binyanOld`  int,
  // `binyanNew`  int,
  // `genderOld`  int,
  // `genderNew`  int,
  // `numberOld`  int,
  // `numberNew`  int,
  // `infoOld`  nvarchar (510),
  // `infoNew`  nvarchar (510),
  // `exampleOld`  nvarchar (510),
  // `exampleNew`  nvarchar (510),
  // `imgLinkOld`  nvarchar (510),
  // `imgLinkNew`  nvarchar (510),
  // `imgCreditOld`  nvarchar (510),
  // `imgCreditNew`  nvarchar (510),
  // `linkDescOld`  nvarchar (200),
  // `linkDescNew`  nvarchar (200),
  // `linkOld`  nvarchar (510),
  // `linkNew`  nvarchar (510),
  // `labelsOld`  nvarchar (200),
  // `labelsNew`  nvarchar (200)
};
const csvLabels = async () => {
  await importSingleTable("labels", (row) => intify(row, [1]));
  // `ID`  int,
  // `labelName`  nvarchar (510),
  // `fbIMG`  nvarchar (510)
};
const csvLists = async () => {
  await importSingleTable("lists", (row) => intify(row, [0, 1, 4, 7, 8]));
  // `ID`  int,
  // `creator`  int,
  // `listName`  nvarchar (100),
  // `listDesc`  nvarchar (510),
  // `viewCNT`  int,
  // `creationTimeUTC`  nvarchar (100),
  // `lastUpdateUTC`  nvarchar (100),
  // `privacy`  int,
  // `type`  int
};
const csvListsUsers = async () => {
  await importSingleTable("listsUsers", (row) => intify(row, [0, 1, 2]));
  //     `list`  int,
  //     `user`  int,
  //     `pos`  int
};
const csvLog = async () => {
  await importSingleTable("log", (row) => intify(row, [0, 7]));
  //     `ID`  int,
  //     `opType`  nvarchar (2),
  //     `afDB`  nvarchar (510),
  //     `afPage`  nvarchar (510),
  //     `opNum`  nvarchar (510),
  //     `userIP`  nvarchar (510),
  //     `opTimestamp`  nvarchar (510),
  //     `durationMs`  int,
  //     `sStr`  nvarchar (510)
};
const csvMedia = async () => {
  await importSingleTable("media", (row) => intify(row, [0, 1, 6, 7, 8]));
  //     `id`  int,
  //     `mType`  int,
  //     `mLink`  nvarchar (510),
  //     `description`  nvarchar (510),
  //     `credit`  nvarchar (510),
  //     `creditLink`  nvarchar (510),
  //     `speaker`  int,
  //     `uploader`  int,
  //     `school`  int,
  //     `creationTime`  nvarchar (100),
  //     `creationTimeUTC`  nvarchar (100),
  //     `lastUpdateUTC`  nvarchar (100)
};
const csvSentences = async () => {
  await importSingleTable("sentences", (row) => intify(row, [0, 1, 2, 10]));
  //     `id`  int,
  //     `show`  int,
  //     `status`  int,
  //     `hebrew`  nvarchar (510),
  //     `hebrewClean`  nvarchar (510),
  //     `arabic`  nvarchar (510),
  //     `arabicClean`  nvarchar (510),
  //     `arabicHeb`  nvarchar (510),
  //     `arabicHebClean`  nvarchar (510),
  //     `info`  nvarchar (510),
  //     `creator`  int,
  //     `creationTimeUTC`  nvarchar (100)
};
const csvWords = async () => {
  await importSingleTable("words", (row) =>
    intify(row, [0, 1, 2, 4, 19, 20, 21, 22, 23, 26])
  );
  //     `id`  int,
  //     `show`  int,
  //     `status`  int,
  //     `lockedUTC`  nvarchar (100),
  //     `isLocked`  int,
  //     `hebrewTranslation`  nvarchar (100),
  //     `hebrewClean`  nvarchar (100),
  //     `hebrewCleanMore`  nvarchar (510),
  //     `hebrewDef`  nvarchar (200),
  //     `sndxHebrewV1`  nvarchar (510),
  //     `arabic`  nvarchar (510),
  //     `arabicClean`  nvarchar (100),
  //     `arabicCleanMore`  nvarchar (510),
  //     `sndxArabicV1`  nvarchar (510),
  //     `arabicWord`  nvarchar (100),
  //     `arabicHebClean`  nvarchar (100),
  //     `arabicHebCleanMore`  nvarchar (510),
  //     `pronunciation`  nvarchar (100),
  //     `searchString`  nvarchar (400),
  //     `originWordID`  int,
  //     `partOfSpeach`  int,
  //     `gender`  int,
  //     `number`  int,
  //     `binyan`  int,
  //     `info`  nvarchar (510),
  //     `example`  nvarchar (510),
  //     `creatorID`  int,
  //     `creationTimeUTC`  nvarchar (100),
  //     `imgLink`  nvarchar (510),
  //     `imgCredit`  nvarchar (510)
};
const csvWordsLabels = async () => {
  await importSingleTable("wordsLabels", (row) => intify(row, [0, 1]));
  //     `wordID`  int,
  //     `labelID`  int
};
const csvWordsLists = async () => {
  await importSingleTable("wordsLists", (row) => intify(row, []));
  //     `wordID`  int,
  //     `listID`  int,
  //     `pos`  int
};
const csvWordsMedia = async () => {
  await importSingleTable("wordsMedia", (row) => intify(row, []));
  //     `wordID`  int,
  //     `mediaID`  int
};
const csvWordsRelations = async () => {
  await importSingleTable("wordsRelations", (row) => intify(row, []));
  //     `word1`  int,
  //     `word2`  int,
  //     `relationType`  int
};
const csvWordsSentences = async () => {
  await importSingleTable("wordsSentences", (row) =>
    intify(row, [0, 1, 2, 3, 4])
  );
  //     `word`  int,
  //     `sentence`  int,
  //     `location`  int,
  //     `relevance`  int,
  //     `merge`  int
};
const csvWordsShort = async () => {
  await importSingleTable("wordsShort", (row) => intify(row, [0, 2]));
  //     `ID`  int,
  //     `sStr`  nvarchar (10),
  //     `wordID`  int
};

export const csv = async () => {
  // sql
  //   .split("\n")
  //   .map((v, i) => {
  //     return v.indexOf("int") > -1 ? i : null;
  //   })
  //   .filter((a) => a !== null);

  await csvHistory();
  await csvLabels();
  await csvLists();
  await csvListsUsers();
  await csvLog();
  await csvMedia();
  await csvSentences();
  await csvWords();
  await csvWordsLabels();
  await csvWordsLists();
  await csvWordsMedia();
  await csvWordsRelations();
  await csvWordsSentences();
  await csvWordsShort();
};
