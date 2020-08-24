/**
 * @typedef {Object} ParseFilesOutput
 * @property {Array<FileObject>} parsedFileNames
 * @property {boolean} pass - Are the files pass name checking?
 */

/**
 * @typedef {Object} FileObject
 * @property {string} name Image's name
 * @property {string} subject Subject of the exercise
 * @property {string} coverRange Cover range of the exercise
 * @property {string} itemSN ItemSN of the exercise
 * @property {string} qid Qid of the exercise
 */

/**
 * Extract subject, cover range and itemSN from filename of files
 * @param {File[]} files - files named (subject)(coverRange)(itemSN).png|jp(e)g
 * @returns {ParseFilesOutput} parsedFileNames and pass
 */
const parseFiles = (files) => {
  const re = /\(([^\\)]*)\)\(([^\\)]*)\)\(([^\\)]*)\)/;
  let parsedFileNames = [];
  let pass = true;

  for (let i = 0; i < files.length; i++) {
    const { name } = files[i];
    const result = re.exec(name);
    if (result) {
      const [_, subject, coverRange, itemSN] = result;
      parsedFileNames = [
        ...parsedFileNames,
        {
          name,
          subject,
          coverRange,
          itemSN,
          qid: "",
        },
      ];
    } else {
      pass = false;
      parsedFileNames = [
        ...parsedFileNames,
        {
          name,
          subject: "",
          coverRange: "",
          itemSN: "",
          qid: "",
        },
      ];
    }
  }

  return { parsedFileNames, pass };
};

/**
 * Download a csv file named "image-to-perseus.csv"
 * @param {Array<FileObject>} parsedFileNames
 */
const generateCSVThenDownload = (parsedFileNames) => {
  const filename = "image-to-perseus.csv";
  const data = [
    "name,subject,cover range,itemSN,qid",
    ...parsedFileNames.map(
      ({ name, subject, coverRange, itemSN, qid }) =>
        `${name},${subject},${coverRange},${itemSN},${qid}`
    ),
  ].join("\n");

  const blob = new Blob([data], {
    type: "application/octet-stream",
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = href;
  link.download = filename;
  link.click();
};

export { parseFiles, generateCSVThenDownload };
