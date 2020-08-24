import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgressWithLabel from "./Process";
import Table from "./Table";
import Stepper from "./Stepper";

import { parseFiles, generateCSVThenDownload } from "./utils";

const useStyles = makeStyles(
  {
    root: {
      padding: "0 10%",
    },

    button: {
      margin: "0 10px",
    },

    actions: {
      margin: "32px 0",
    },

    progress: {
      marginTop: "32px",
    },
  },
  { name: "image-bulk-uploader" }
);

function App() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [files, setFiles] = useState(null);
  /**
   * parsedFiles []parsedFile
   *
   * parsedFile example
   * {
   *   subject: 'Math',
   *   coverRange: 'math-n1-2',
   *   itemSN: '範例 1-2',
   *   qid: 'id-1234'
   * }
   * qid 要等到上傳完圖片才會拿到, 一開始為空字串
   */
  const [parsedFiles, setParsedFiles] = useState([]);
  const [uploadProcess, setUploadProcess] = useState(0);

  const uploadFiles = async () => {
    const fileCount = files.length;
    for (let i = 0; i < fileCount; i++) {
      // TODO(leo.lin): 這邊要接左哥的 API
      const qid = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(`qid-${i}`);
        }, 500);
      });

      const newParsedFiles = [...parsedFiles];
      newParsedFiles[i].qid = qid;
      setParsedFiles(newParsedFiles);

      setUploadProcess((100 * (i + 1)) / fileCount);
    }
  };

  const handleFileChange = (e) => {
    setParsedFiles([]);
    setUploadProcess(0);

    if (e.target.files.length === 0) {
      setFiles(null);
      setActiveStep(0);
    } else {
      setFiles(e.target.files);
      setActiveStep(1);
    }
  };

  const handleCheckFilenameBtnClick = () => {
    setUploadProcess(0);
    const { parsedFileNames, pass } = parseFiles(files);
    setParsedFiles(parsedFileNames);
    if (pass) {
      setActiveStep(2);
    }
  };

  const handleUploadBtnClick = async () => {
    // need to wait for image uploading one by one,
    // and update the qid for each file
    await uploadFiles();
    setActiveStep(3);
  };

  const handleCsvBtnClick = () => {
    generateCSVThenDownload(parsedFiles);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} />
      <div className={classes.actions}>
        <input type="file" onChange={handleFileChange} multiple />
        {activeStep >= 1 && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleCheckFilenameBtnClick}
          >
            檢查檔名
          </Button>
        )}
        {activeStep >= 2 && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleUploadBtnClick}
          >
            開始建題
          </Button>
        )}
        {activeStep >= 3 && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={handleCsvBtnClick}
          >
            下載 CSV 檔
          </Button>
        )}
        {activeStep >= 2 && (
          <div className={classes.progress}>
            <LinearProgressWithLabel value={uploadProcess} />
          </div>
        )}
      </div>
      <Table rows={parsedFiles} />
    </div>
  );
}

export default App;
