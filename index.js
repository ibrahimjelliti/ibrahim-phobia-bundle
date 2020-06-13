const express = require('express');
const app = express();
const cors = require("cors");
const validate = require('validate-npm-package-name');
const packagePhobia = require('./app/packagePhobia');

require("rimraf").sync('tmp'); // delete tmp folder wherer packages is installed

const port = 4000;
app.use(cors());

//healthz
app.get('/', (req, res) =>
  res.send('Entry point: search?package={package name}')
);

/**
 * API to get cost of module of a package:
 * req.query.package: package name
 * 
 * return: package name, description, minified size, gzipped size 
 */
app.get('/search', async function (req, res) {
  const packageName = req.query.package;
  // assert that packageName is valid and exist in npm registry to proceed 
  const validateResults = validate(packageName);
  if (validateResults.errors) {
    res.status(500).send({ error: 'Package name not valid' });
  } else {
    try {
      const packagePhobiaResult = await packagePhobia(packageName);
      res.send(packagePhobiaResult);
    } catch (err) {
      res.status(500).send({
        error: err.toString()
      });
    }
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
