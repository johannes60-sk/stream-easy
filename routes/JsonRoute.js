const express = require("express");
const sftp = require("ssh2-sftp-client");
const SftpClient = require("ssh2-sftp-client");
require('dotenv').config()

const router = express.Router();

router.post("/send-data-on-server", async (req, res) => {
  try {
    const sftp = new SftpClient();

    await sftp.connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    const fileName = req.body.fileName.replace(/\s+/g, "_");
    const channels = req.body.jsonChannels;
    const data = JSON.stringify(channels, null, 4);
    const remotePath = "/var/www/html/JHO/" + fileName + ".json";

    const exists = await sftp.exists(remotePath);

    if (exists) {
      console.log("Le fichier existe déjà sur le serveur FTP");
      res.status(400).send("Le Ficher Json existe deja!");
    } else {
      await sftp.put(Buffer.from(data), remotePath);
      await sftp.end();
      console.log(data);
      res.status(200).send("Ficher Json creer avec success");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Une erreur s'est produite lors de l'envoi des données.");
  }
});

router.post("/send-modified-file-on-server", async (req, res) => {
  const sftp = new SftpClient();

  try {
    await sftp.connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    const fileName = req.body.fileName;
    const data = req.body.jsonChannels;

    const remotePath = "/var/www/html/JHO/" + fileName;

    await sftp.put(Buffer.from(data), remotePath, { flags: "w" });
    await sftp.end();
    res.status(200).send("Ficher Json modifier avec success");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/get-jsonfilname-on-serve", async (req, res) => {
  const sftp = new SftpClient();

  sftp
    .connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    })
    .then(() => sftp.list("/var/www/html/JHO"))
    .then((data) => {
      const jsonFiles = data.filter((file) => file.name.endsWith(".json"));

      res.status(200).json({
        msg: "Success",
        jsonFilename: jsonFiles,
      });
    })
    .catch((err) => console.log(err))
    .finally(() => sftp.end());
});

router.get("/get-jsonFile-on-serve/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;

    const sftp = new SftpClient();

    await sftp.connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    const remoteFilePath = `/var/www/html/JHO/${fileName}`;
    const remoteFileContent = await sftp.get(remoteFilePath);

    await sftp.end();

    res.status(200).json({
      message: "sucess",
      fileContent: remoteFileContent.toString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to load file",
      error: error.message,
    });
  }
});

router.post("/delete-file-on-serve/:fileName", async (req, res) => {
  const sftp = new SftpClient();
  const { fileName } = req.params;
  const remotePath = "/var/www/html/JHO/" + fileName;
  
  await sftp
  .connect({
    host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
  })
  .then(() => {
    console.log('Connected to SFTP server');
    return sftp.list('/var/www/html/JHO/');
  })
  .then((data) => {
    console.log('List of files:', data);
    return sftp.delete(remotePath);
  })
  .then(() => {
    console.log('File deleted:', remotePath);
    sftp.end();
    res.status(200).send("Ficher Json supprimer avec success");
  })
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).json({
      message: "Un probleme est survenu! Veillez contater l'admin ",
      error: error.message,
    });
  });

});

module.exports = router;
