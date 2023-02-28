import Model from "./model.js"

export default class Lotto extends Model {
    id_prodotto
    scadenza
    spedito

    constructor(app) {
        super(app)

        // this.createBancale = this.createBancale.bind(this);

        this.table = 'lotti'
        this.title = 'Lotto'
        this.valid_actions = this.default_actions
    }

    async action_cb(k, defaultCb) {
        switch (k) {
            case 1:
                console.log((await this.findAll()).map((v, k) => `  ${v.l_id}) Codice Prodotto: ${v.id_prodotto} - Scadenza: ${v.scadenza.toLocaleDateString()} - Spedito: ${v.indirizzo ? `${v.nome} ${v.cognome}, ${v.indirizzo}` : 'No'}`).join('\n'));
                break;
            default:
                if (defaultCb) await defaultCb();
                else console.log(`Invalid action chosen: ${k}`)
        }
    }

    async findAll() {
        return this.app.database.query(`
            SELECT l.id as l_id, l.*, c.* FROM lotti l
                LEFT JOIN bancale b ON (b.id_lotto = l.id)
                LEFT JOIN etichetta e ON (e.id_bancale = b.id)
                LEFT JOIN cliente c ON (e.id_cliente = c.id)
        `)
    }

    async inputCreate() {
        const inp = await this.prompt.get([
            { name: 'Codice Prodotto', pattern: /^[a-z\d]{1,}$/i, required: true },
            {
                name: "Scadenza",
                pattern: /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
                required: true,
                before: (v) => v.split(/\//g).reverse().join('/'),
                default: new Date(Date.now() + Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000) + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
        ]);
        const prodotto = (await this.app.database.query('SELECT * FROM prodotto WHERE ?', { codice: inp[ 'Codice Prodotto' ] }))[ 0 ]
        if (!prodotto) {
            console.log('Prodotto non trovato');
            return;
        }
        return { id_prodotto: prodotto.id, scadenza: inp[ 'Scadenza' ] };
        // await this.create()
    }
}