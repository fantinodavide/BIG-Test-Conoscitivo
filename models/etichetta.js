import Model from "./model.js"
import { Worker } from "worker_threads";
import * as util from 'node:util';
import { setTimeout as wait } from 'timers/promises'

export default class Etichetta extends Model {
    id_cliente
    id_bancale

    constructor(app) {
        super(app)

        this.table = 'etichetta'
        this.title = 'Etichetta'
        this.valid_actions = [ ...this.default_actions, 'Stampa Multithreading' ]
    }

    async action_cb(k, defaultCb) {
        switch (k) {
            case 1:
                console.log((await this.findAll()).map((v, k) => `  ${v.id}) Codice Cliente: ${v.id_cliente} - Codice Bancale: ${v.codice} - Data: ${v.data.toLocaleDateString()}`).join('\n'));
                break;
            case 2:
                await this.createPrint();
                break;
            case this.default_actions.length + 1:
                await this.stampaMultithreading();
                console.log('\nStampa completata.\nVuoi tornare al menu principale?');
                if ((await this.prompt.get([ '[Si/No (esci)]' ]))[ '[Si/No (esci)]' ].toLowerCase().startsWith('n'))
                    process.exit(0);
                break;
            default:
                if (defaultCb) await defaultCb();
                else console.log(`Invalid action chosen: ${k}`)
        }
    }

    findAll() {
        return this.app.database.query(`SELECT e.id, e.*, b.codice FROM ${this.table} e INNER JOIN bancale b ON (e.id_bancale = b.id)`)
    }

    async inputCreate(editId) {
        const inp = await this.prompt.get([ { name: 'Codice Cliente', pattern: /^\d{1,}$/, required: true }, { name: 'Codice Bancale', pattern: /^[a-z\d]{1,}$/i, required: true } ]);

        const bancale = (await this.app.database.query(`
            SELECT b.id, b.*, e.id as e_id FROM bancale b
            LEFT JOIN etichetta e ON (e.id_bancale = b.id)
            WHERE (b.codice = '${inp[ 'Codice Bancale' ]}')
        `))[ 0 ]
        if (!bancale) {
            console.log('Questo bancale non esiste')
            return;
        }
        if (bancale[ 'e_id' ] != editId) {
            console.log('Questo bancale è già utilizzato')
            return;
        }
        return { id_cliente: inp[ 'Codice Cliente' ], id_bancale: bancale.id };
    }

    async createPrint() {
        const insert = await this.inputCreate();
        const exCheck = (await this.app.database.query(`SELECT * FROM etichetta WHERE id_cliente = '${insert.id_cliente}' AND id_bancale = '${insert.id_bancale}'`))[ 0 ];
        if (exCheck) {
            this.stampa(exCheck.id)
            return;
        }

        let res = await this.create(insert)
        if (!res) return;

        await this.stampa(res.insertId)
        return;
    }

    async stampa(id) {
        const e = (await this.app.database.query(`
            SELECT l.id as l_id, b.id as b_id, c.id as c_id, b.peso as peso, p.codice as p_cod, l.scadenza as scadenza FROM etichetta e
            
            INNER JOIN cliente c ON (e.id_cliente = c.id)
            INNER JOIN bancale b ON (e.id_bancale = b.id)
            INNER JOIN lotti l ON (b.id_lotto = l.id)
            INNER JOIN prodotto p ON (l.id_prodotto = p.id)
            
            WHERE e.id = ${id}
        `))[ 0 ]
        if (!e) {
            console.log('Etichetta non trovata');
            return;
        }

        console.log('\n' + Etichetta.formatStampa(e))
        return;
    }

    static formatStampa(e) {
        let o = '';
        const keys = Object.keys(e);
        for (let k in e)
            o += (e[ k ] instanceof Date ? e[ k ].toLocaleDateString() : e[ k ]) + (k == 'peso' ? 'Kg' : '') + (k == keys[ keys.length - 1 ] ? '' : '|')

        return o;
    }

    async stampaMultithreading(thread_count = 4) {
        const countRecords = (await this.app.database.query(`SElECT COUNT(1) as c FROM etichetta`))[ 0 ].c;

        console.log(`Inizio stmapa di ${countRecords} etichette\n`);

        const needed_threads = Math.min(countRecords, thread_count);
        const records_per_thread = countRecords / needed_threads;
        // console.log('records_per_thread', records_per_thread);

        let workersArr = [];
        for (let i = 0; i < needed_threads; i++) {
            workersArr.push(this.createPrintWorker(needed_threads, i * records_per_thread, records_per_thread))
        }

        await Promise.all(workersArr);
    }

    createPrintWorker(thread_count, startIndex, records_per_thread) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./workers/print.js', {
                workerData: {
                    thread_count: thread_count,
                    dbCredentials: this.app.database.connCredentials,
                    startIndex: startIndex,
                    records_per_thread: records_per_thread
                }
            });
            worker.on("message", (dt) => {
                // console.log(dt);
                resolve();
            })
            worker.on("error", reject)
        })
    }
}