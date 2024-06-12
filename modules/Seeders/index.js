const fs = require('fs')

const fileName = process.argv[2];
const path = __dirname + '/' + fileName + '.js';

(async function () {
    try {
        console.log(path)
        if (fs.existsSync(path)) {
            const className = require(path);
            const obj = new className();
            if (obj.run) {
                console.log("\x1b[31m", "==== START TERMINAL OPERATION ====", "\x1b[37m \n");
                await obj.run();
                console.log("\x1b[31m", "==== TERMINAL OPRATION COMPLETED ====", "\x1b[37m \n");
            }
            else
                console.log("\x1b[31m", "Run function not found.", "\x1b[37m \n");
        } else {
            console.log("\x1b[31m", "Class not found.", "\x1b[37m \n");
        }
    } catch (err) {
        console.log("\x1b[31m", err, "\x1b[37m \n");
    }
    process.exit();
})();
