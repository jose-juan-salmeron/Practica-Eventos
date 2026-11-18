
const express = require('express');
const Evento = require(__dirname + '/../models/evento');
const Recinto = require(__dirname + '/../models/recinto');

const router = express.Router();



router.get('/localidad/:nombre', async (req, res) => {
    try {
        const recintos = await Recinto.find({ localidad: req.params.nombre });
        const idsRecintos = recintos.map(r => r._id);

        const eventos = await Evento.find({
            recinto: { $in: idsRecintos },
            fecha: { $gte: new Date() }
        }).populate('recinto');

        if (eventos.length === 0) {
            return res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
        }
        res.status(200).send({ ok: true, resultado: eventos });
    } catch (error) {
        res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        if (!evento) {
            throw new Error('Evento no encontrado');
        }

        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
        if (!entrada) {
            throw new Error('Tipo de entrada no encontrado');
        }

        res.status(200).send({ ok: true, resultado: { precio: entrada.precio, disponibles: entrada.disponibles } });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    }
});

router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.idEvento);
        if (!evento) {
            throw new Error('Evento no encontrado');
        }

        const entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
        if (!entrada) {
            throw new Error('Tipo de entrada no encontrado');
        }

        const cantidad = Number(req.params.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            throw new Error('Cantidad no válida');
        }

        if (entrada.disponibles < cantidad) {
            throw new Error('No hay suficientes entradas disponibles');
        }

        entrada.disponibles -= cantidad;
        const eventoActualizado = await evento.save();

        res.status(200).send({ ok: true, resultado: eventoActualizado });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error actualizando entradas del evento " + req.params.idEvento });
    }
});



router.get('/', async (req, res) => {
    try {
        const eventos = await Evento.find().populate('recinto');
        if (eventos.length === 0) {
            return res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
        }
        res.status(200).send({ ok: true, resultado: eventos });
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id).populate('recinto');
        if (!evento) {
            return res.status(404).send({ ok: false, error: "Evento " + req.params.id + " no encontrado" });
        }
        res.status(200).send({ ok: true, resultado: evento });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Evento " + req.params.id + " no encontrado" });
    }
});

router.post('/', async (req, res) => {
    try {
        let nuevoEvento = new Evento({
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            entradas: req.body.entradas,
            recinto: req.body.recinto
        });
        const eventoCreado = await nuevoEvento.save();
        res.status(201).send({ ok: true, resultado: eventoCreado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo evento" });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let camposActualizar = {};
        if (req.body.nombre !== undefined) camposActualizar.nombre = req.body.nombre;
        if (req.body.fecha !== undefined) camposActualizar.fecha = req.body.fecha;
        if (req.body.entradas !== undefined) camposActualizar.entradas = req.body.entradas;
        if (req.body.recinto !== undefined) camposActualizar.recinto = req.body.recinto;

        const eventoActualizado = await Evento.findByIdAndUpdate(
            req.params.id,
            { $set: camposActualizar },
            { returnDocument: 'after', runValidators: true }
        );

        if (!eventoActualizado) {
            return res.status(404).send({ ok: false, error: "Error actualizando evento " + req.params.id });
        }
        res.status(200).send({ ok: true, resultado: eventoActualizado });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error actualizando evento " + req.params.id });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);
        if (!eventoEliminado) {
            return res.status(404).send({ ok: false, error: "Error eliminando evento " + req.params.id });
        }
        res.status(200).send({ ok: true, resultado: eventoEliminado });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error eliminando evento " + req.params.id });
    }
});

module.exports = router;

