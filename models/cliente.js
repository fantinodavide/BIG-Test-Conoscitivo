import Model from "./model.js"

export default class Cliente extends Model {
    nome
    cognome
    indirizzo
    constructor(app) {
        super(app)

        // this.createBancale = this.createBancale.bind(this);

        this.table = 'cliente'
        this.title = 'Cliente'
        this.valid_actions = this.default_actions
    }

    async action_cb(k, defaultCb) {
        switch (k) {
            case 1:
                console.log((await this.findAll()).map((v, k) => `  ${v.id}) Nome: ${v.nome} - Cognome: ${v.cognome} - Indirizzo: ${v.indirizzo}`).join('\n'));
                break;
            default:
                if (defaultCb) await defaultCb();
                else console.log(`Invalid action chosen: ${k}`)
        }
    }

    async inputCreate() {
        const inp = await this.prompt.get([ { name: 'Nome', pattern: /^[a-z]{1,}$/i, required: true }, { name: 'Cognome', pattern: /^[a-z]{1,}$/i, required: true }, { name: 'Indirizzo', pattern: /^[a-z \d\,\(\)]{3,}$/i, required: true } ]);
        await this.create({ nome: inp.Nome, cognome: inp.Cognome, indirizzo: inp.Indirizzo })
    }
}