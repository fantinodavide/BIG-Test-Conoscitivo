import prompt from "prompt";

export default class Model {
    id

    constructor(app) {
        this.app = app;
        this.prompt = prompt;
        this.prompt.message = this.table;

        this.title = 'Menu';
        this.default_actions = [ 'Visualizza', 'Crea', 'Elimina', 'Modifica' ];
        this.valid_actions = [ 'Bancali', 'Clienti', 'Etichette', 'Prodotti', 'Lotti' ]
    }

    async actions() {
        // this.prompt.message = 'Scegli Model:\n1) Bancali\n2) Clienti\n3) Etichette\n4) Prodotti\n5) Lotti\n';
        console.log('')
        if (this.valid_actions[ 0 ] != 'Esci') this.valid_actions.unshift('Esci');
        let message = `=======================\n ${this.title}\n=======================\n`;
        message += this.valid_actions.map((v, k) => ` ${+k}) ${v}`).join('\n');
        message += `\n=======================`;
        console.log(message)

        const res = (await this.prompt.get([ {
            name: 'N. Scelta',
            pattern: /^\d+$/,
            before: (v) => +v,
            default: 1
        } ]))[ 'N. Scelta' ];
        if (this.action_cb) await this.action_cb(res, async () => {
            switch (res) {
                case 0:
                    break;
                case 1:
                    console.log((await this.findAll()).map((v, k) => `  ${v.id}) ${JSON.stringify(v)}`,).join('\n'));
                    break;
                case 2:
                    await this.create(await this.inputCreate());
                    break;
                case 3:
                    await this.delete()
                case 4:
                    const editId = (await this.prompt.get([ {
                        name: 'Id da modificare',
                        pattern: /^\d+$/,
                        before: (v) => +v,
                    } ]))[ 'Id da modificare' ];
                    await this.update(await this.inputCreate(editId), editId)
                    break;
                default:
                    console.log(`Invalid action chosen: ${k}`)
            }
        });
        return res;
    }

    findAll() {
        return this.app.database.query(`SELECT * FROM ${this.table}`)
    }

    async delete(id) {
        if (!id) id = (await this.prompt.get([ {
            name: 'Id da eliminare',
            pattern: /^\d+$/,
            before: (v) => +v,
        } ]))[ 'Id da eliminare' ];
        let res;

        try {
            res = await this.app.database.query(`DELETE FROM ${this.table} WHERE ?`, { id: id });
        } catch (error) {
            if (error) console.log('Errore:', error.message);
            return;
        }

        // console.log(res);
        if (res.affectedRows > 0) {
            console.log('Eliminazione effettuata')
            return;
        }

        console.log('Nessun elemento eliminato');
        return;
    }

    async create(data) {
        if (!data) return;

        let err = false;
        let res;
        try {
            res = await this.app.database.query(`INSERT INTO ${this.table} SET ?`, data);
        } catch (error) {
            err = error;
            console.error('Error', error.sqlMessage)
        }
        if (err) return;

        console.log('Creazione eseguita. Id', res.insertId);
        return res;
    }

    async update(data, id) {
        if (!data) return;

        let err = false;
        let res;
        try {
            res = await this.app.database.query(`UPDATE ${this.table} SET ? WHERE id = ${id}`, data);
        } catch (error) {
            err = error;
            console.error('Error', error.sqlMessage)
        }
        if (err) return;

        console.log('Modifica eseguita');
        return res;
    }
}