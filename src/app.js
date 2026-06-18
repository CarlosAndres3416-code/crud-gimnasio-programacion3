const express = require('express');
const path = require('path');
const { inicializarDB } = require('./config/database');

const inscripcionRoutes = require('./routes/inscripcionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/items', inscripcionRoutes);

inicializarDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error al iniciar la base de datos:', err);
});