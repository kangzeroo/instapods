const os = require("os");
const https = require("https");
const Stream = require("stream").Transform;
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");
import { FIREBASE_STORAGE_BUCKET } from "../constants";

const bucket = admin.storage().bucket(FIREBASE_STORAGE_BUCKET);

const downloadFile = async (url: string, fileName: string): Promise<string> => {
  const p = new Promise<string>((res, rej) => {
    https
      .request(url, function(response: any) {
        const data = new Stream();

        response.on("data", function(chunk: any) {
          data.push(chunk);
        });

        response.on("end", async () => {
          const tempFilePath = path.join(os.tmpdir(), fileName);
          await fs.writeFileSync(tempFilePath, data.read());
          res(tempFilePath);
        });
      })
      .end();
  });
  return p;
};

const uploadFile = async (
  tempFilePath: string,
  destinationPathName: string,
  metadata: { [key: string]: any }
): Promise<string> => {
  const x = await bucket.upload(tempFilePath, {
    destination: destinationPathName,
    metadata,
    public: true
  });
  await fs.unlinkSync(tempFilePath);
  return x[0].metadata.mediaLink;
};

export const saveImageToCloudStorage = async (
  url: string,
  imagePath: string,
  fileName: string
): Promise<string> => {
  const tempFilePath = await downloadFile(url, fileName);
  const metadata = {
    contentType: "image/png"
  };
  const mediaPath = await uploadFile(
    tempFilePath,
    `${imagePath}/${fileName}`,
    metadata
  );
  return mediaPath;
};

export const getJSONFromCloudStorage = async ({
  filePath,
  fileName
}: {
  filePath: string;
  fileName: string;
}): Promise<any> => {
  console.log(`--------------- getJSONFromCloudStorage ---------------`);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  await bucket
    .file(`${filePath}/${fileName}`)
    .download({ destination: tempFilePath });
  const json = require(tempFilePath);
  await fs.unlinkSync(tempFilePath);
  return json;
};

export const saveJSONToCloudStorage = async ({
  filePath,
  fileName,
  jsonString
}: {
  filePath: string;
  fileName: string;
  jsonString: string;
}): Promise<string> => {
  console.log(`--------------- saveJSONToCloudStorage ---------------`);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  console.log(tempFilePath);
  console.log(JSON.stringify(jsonString));
  console.log(`--------------- Writing to tempFilePath ---------------`);
  await fs.writeFileSync(tempFilePath, JSON.stringify(jsonString));
  console.log(`--------------- Reading from tempFilePath ---------------`);
  const data = require(tempFilePath);
  console.log(data);
  const metadata = {
    contentType: "application/json"
  };
  console.log(`--------------- uploading file... ---------------`);
  const mediaPath = await uploadFile(
    tempFilePath,
    `${filePath}/${fileName}`,
    metadata
  );
  console.log(`--------------- successfully uploaded file! ---------------`);
  console.log(mediaPath);
  console.log(`--------------- unlinking tempFilePath ---------------`);
  return mediaPath;
};

export const checkIfJSONAlreadyExists = async ({
  filePath,
  fileName
}: {
  filePath: string;
  fileName: string;
}) => {
  const p = new Promise((res, rej) => {
    console.log(`--------------- checkIfJSONAlreadyExists ---------------`);
    getJSONFromCloudStorage({ filePath, fileName })
      .then(json => {
        console.log(json);
        res(json);
      })
      .catch(e => {
        console.log(`--------------- ERROR: no JSON exists ---------------`);
        console.log(e);
        res(false);
      });
  });
  return p;
};
