import dayjs from "dayjs";

self.onmessage = function (e) {
    const { lines } = e.data;

    let parsedRows = []
    let nmiValue = ""
    let interval = 0
    let baseDate = ''

    for (const line of lines) {
        const parts = line.split(',');

        //to get the NMI second value of `200 record`
        if (parts[0] === "200") {
            nmiValue = parts[1]; // get the NMI
            interval = parseInt(parts[8]) // get the interval
        }
        else if (parts[0] === "300" && nmiValue) {
            baseDate = dayjs(parts[1], 'YYYYMMDD').startOf('day');
            const consumptionValues = parts.slice(2).map(value => parseFloat(value) || 0);

            consumptionValues.forEach((value, index) => {
                parsedRows.push({
                    nmi: nmiValue,
                    timestamp: `${baseDate.add(index * interval, 'minutes').format('YYYY-MM-DD HH:mm')}`,
                    consumption: value
                });

                // send data in batches
                if (parsedRows.length >= 1000) {
                    self.postMessage(parsedRows);
                    parsedRows = []; // reset
                }
            });
        }
    }

    if (parsedRows.length > 0) {
        self.postMessage(parsedRows);
    }

    self.postMessage("YAY");
};
