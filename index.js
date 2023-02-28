import process from 'process';
import App from './services/app.js'

async function main() {
    new App();
}

process.on('uncaughtException', (error) => {
    if (error.message == 'canceled'){
        console.log('\nBye!');
        process.exit(0);
    }

    throw error;
})

main()