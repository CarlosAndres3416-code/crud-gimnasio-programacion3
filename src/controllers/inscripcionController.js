const { conexionDB } = require('../config/database');

exports.obtenerTodos = async (req, res) => {
    try {
        const db = await conexionDB();
        const inscritos = await db.all('SELECT * FROM inscripciones ORDER BY id DESC');
        res.json(inscritos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de inscripciones.' });
    }
};

exports.crear = async (req, res) => {
    const { nombre_cliente, plan_gimnasio, monto_pago, estado } = req.body;

    if (!nombre_cliente || nombre_cliente.trim() === '') {
        return res.status(400).json({ error: 'El nombre del cliente es obligatorio.' });
    }
    if (!plan_gimnasio || plan_gimnasio.trim() === '') {
        return res.status(400).json({ error: 'Debes seleccionar un plan de entrenamiento.' });
    }
    if (!monto_pago || isNaN(monto_pago) || Number(monto_pago) <= 0) {
        return res.status(400).json({ error: 'El monto de pago debe ser un número mayor a 0.' });
    }

    try {
        const db = await conexionDB();
        await db.run(
            'INSERT INTO inscripciones (nombre_cliente, plan_gimnasio, monto_pago, estado) VALUES (?, ?, ?, ?)',
            [nombre_cliente.trim(), plan_gimnasio.trim(), Number(monto_pago), estado || 'Activo']
        );
        res.status(201).json({ mensaje: '¡Inscripción registrada con éxito!' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al guardar en la base de datos.' });
    }
};

exports.actualizar = async (req, res) => {
    const { id } = req.params;
    const { nombre_cliente, plan_gimnasio, monto_pago, estado } = req.body;

    if (!nombre_cliente || nombre_cliente.trim() === '') {
        return res.status(400).json({ error: 'El nombre del cliente no puede quedar vacío.' });
    }
    if (!monto_pago || isNaN(monto_pago)) {
        return res.status(400).json({ error: 'El monto de pago ingresado no es válido.' });
    }

    try {
        const db = await conexionDB();
        const resultado = await db.run(
            'UPDATE inscripciones SET nombre_cliente = ?, plan_gimnasio = ?, monto_pago = ?, estado = ? WHERE id = ?',
            [nombre_cliente.trim(), plan_gimnasio, Number(monto_pago), estado, id]
        );

        if (resultado.changes === 0) {
            return res.status(404).json({ error: 'La inscripción especificada no existe.' });
        }

        res.json({ mensaje: 'Datos de membresía actualizados correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar los datos en el servidor.' });
    }
};

exports.eliminar = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await conexionDB();
        const resultado = await db.run('DELETE FROM inscripciones WHERE id = ?', [id]);

        if (resultado.changes === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada para eliminar.' });
        }

        res.json({ mensaje: 'Inscripción eliminada correctamente del historial.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al intentar eliminar el registro.' });
    }
};