import * as mysql from 'mysql';
import Model from '../models/model.js';
import Bancale from '../models/bancale.js';
import Cliente from '../models/cliente.js';
import Etichetta from '../models/etichetta.js';
import Prodotto from '../models/prodotto.js';
import Lotto from '../models/lotto.js';
import * as util from 'node:util';

export default class App {
    constructor() {
        const connCredentials = {
            host: 'localhost',
            user: 'root',
            password: 'toor',
            database: 'test_BIG'
        }
        this.database = mysql.createConnection(connCredentials);
        this.database.connCredentials = connCredentials
        this.database.connect();
        this.database.query = util.promisify(this.database.query)
        console.log('DB Connected');
        this.basemodel = new Model();

        this.completed();
    }

    async completed() {
        while (true) {
            const action_chosen = await this.basemodel.actions()
            let mod;
            switch (action_chosen) {
                case 0:
                    console.log('Bye!');
                    process.exit(0);
                case 1:
                    mod = new Bancale(this);
                    await mod.actions();
                    break;
                case 2:
                    mod = new Cliente(this);
                    await mod.actions();
                    break;
                case 3:
                    mod = new Etichetta(this);
                    await mod.actions();
                    break;
                case 4:
                    mod = new Prodotto(this);
                    await mod.actions();
                    break;
                case 5:
                    mod = new Lotto(this);
                    await mod.actions();
                    break;
                default:
                    console.log(`Invalid action chosen: ${action_chosen}`)
            }
        }
    }
}