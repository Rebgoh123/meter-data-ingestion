var express = require('express');
var db = require('../db');
const crypto = require("crypto");

const validateSessionKey = (req, res, next) => {
  // Ensure session exists
  if (!req.sessionID || !req.session) {
    return res.status(401).json({ error: 'Unauthorized: Session is missing or expired' });
  }

  next(); // Move to next middleware if session is valid
};


function fetchMeterReading(req, res, next) {
  db.all('SELECT * FROM meter_readings', [

  ], function(err, rows) {
    if (err) { return next(err); }
    var meterReadings = rows.map(function(row) {
      return {
        id: row.id,
        nmi: row.nmi,
        timestamp: row.timestamp,
        consumption: row.consumption,
      }
    });
    res.meterReadings = meterReadings;
    next();
  });
}

var router = express.Router();

/* GET home page. */
router.get('/meter-readings', fetchMeterReading,
    validateSessionKey,
    function(req, res, next) {
      next();
    },
    fetchMeterReading,
    function(req, res, next) {
      res.json({
        meterReadings: res.meterReadings
      });
    }
);

router.post('/meter-readings', function(req, res, next) {
  const meterReadings = req.body; //an array

  if (!Array.isArray(meterReadings) || meterReadings.length === 0) {
    return res.status(400).json({ error: "Invalid input: Must be an array of readings." });
  }

  const stmt = db.prepare(`
      INSERT OR IGNORE INTO meter_readings (nmi, timestamp, consumption) VALUES (?, ?, ?)
  `);

  db.serialize(() => {
    meterReadings.forEach(({ nmi, timestamp, consumption }) => {
      stmt.run(nmi, timestamp, consumption);
    });

    stmt.finalize();
    res.json({
      success: true,
      message: "Meter readings inserted successfully",
      insertedRows: meterReadings.length
    });
  });
});

module.exports = router;
