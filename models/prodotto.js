import Model from "./model.js"

export default class Prodotto extends Model {
    codice
    descrizione
    constructor(app) {
        super(app)

        this.table = 'prodotto'
        this.title = 'Prodotto'
        this.valid_actions = this.default_actions
    }

    async action_cb(k, defaultCb) {
        switch (k) {
            case 1:
                console.log((await this.findAll()).map((v, k) => `  ${v.id}) Codice Prodotto: ${v.codice} - Descrizione: ${v.descrizione}`).join('\n'));
                break;
            default:
                if (defaultCb) await defaultCb();
                else console.log(`Invalid action chosen: ${k}`)
        }
    }

    async inputCreate() {
        const inp = await this.prompt.get([ { name: 'Codice Prodotto', pattern: /^[a-z\d]{1,}$/i, required: true }, { name: 'Descrizione', pattern: /^[a-z \d]{1,}$/i, required: true } ]);
        if ((await this.app.database.query('SELECT * FROM prodotto WHERE ?', { codice: inp[ 'Codice Prodotto' ] }))[ 0 ]) {
            console.log('Questo prodotto è già esistente');
            return;
        }
        return { codice: inp[ 'Codice Prodotto' ], descrizione: inp[ 'Descrizione' ] };
    }
}