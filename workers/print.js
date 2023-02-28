import { parentPort, workerData } from "worker_threads";
import * as util from 'node:util';
import * as mysql from 'mysql';
import Etichetta from '../models/etichetta.js'

// console.log(workerData);
let database = mysql.createConnection(workerData.dbCredentials);
database.connect((err, args) => {
    if (err) throw err;

    // console.log(workerData);

    database.query(`
        SELECT l.id as l_id, b.id as b_id, c.id as c_id, b.peso as peso, p.codice as p_cod, l.scadenza as scadenza FROM etichetta e
        
        INNER JOIN cliente c ON (e.id_cliente = c.id)
        INNER JOIN bancale b ON (e.id_bancale = b.id)
        INNER JOIN lotti l ON (b.id_lotto = l.id)
        INNER JOIN prodotto p ON (l.id_prodotto = p.id)
        
        LIMIT ${workerData.startIndex}, ${workerData.records_per_thread}
    `, (err, res) => {
        if (err) throw err;
        // console.log(res);

        for (let r of res.map(Etichetta.formatStampa))
            console.log(r);

        parentPort.postMessage(true);
    })
});


