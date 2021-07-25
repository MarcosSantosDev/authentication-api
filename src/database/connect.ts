import { createConnection } from 'typeorm';

createConnection().then(() => {
    console.log('Successfully connected with database');
}).catch(e => console.log(e));
