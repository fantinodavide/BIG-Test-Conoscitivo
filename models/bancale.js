import Model from "./model.js"

export default class Bancale extends Model {
    id_lotto
    peso

    constructor(app) {
        super(app)

        this.table = 'bancale'
        this.title = 'Bancale'
        this.valid_actions = this.default_actions
    }

    async action_cb(k, defaultCb) {
        switch (k) {
            case 1:
                console.log((await this.findAll()).map((v, k) => `  ${v.id}) Codice: ${v.codice} - Peso: ${v.peso}Kg - Codice Lotto: ${v.id_lotto}`).join('\n'));
                break;
            default:
                if (defaultCb) await defaultCb();
                else console.log(`Invalid action chosen: ${k}`)
        }
    }

    async inputCreate() {
        const inp = await this.prompt.get([ { name: 'Numero Bancale', pattern: /^[a-z\d]{2,25}$/i, required: true }, { name: 'Codice Lotto', pattern: /^\d{1,}$/, required: true }, { name: 'Peso', pattern: /^\d{1,}$/, required: true } ]);
        const insert = { codice: inp[ 'Numero Bancale' ], id_lotto: inp[ 'Codice Lotto' ], peso: inp[ 'Peso' ] };

        const exCheck = (await this.app.database.query(`SELECT * FROM bancale WHERE codice = '${insert.codice}'`))[ 0 ];
        if (exCheck) {
            console.log('Questo bancale è già stato registrato');
            return;
        }
        return insert;
    }
}