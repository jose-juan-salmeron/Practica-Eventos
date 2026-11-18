
const express = require('express');
const Recinto = require(__dirname + '/../models/recinto');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const recintos = await Recinto.find();
        if (recintos.length === 0) {
            return res.status(500).send({ ok: false, error: "No se han encontrado recintos" });
        }
        res.status(200).send({ ok: true, resultado: recintos });
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado recintos" });
    }
});


router.get('/localidad/:nombre', async (req, res) => {
    try {
        const recintos = await Recinto.find({ localidad: req.params.nombre });
        if (recintos.length === 0) {
            return res.status(404).send({ ok: false, error: "No se han encontrado recintos de la localidad indicada" });
        }
        res.status(200).send({ ok: true, resultado: recintos });
    } catch (error) {
        res.status(404).send({ ok: false, error: "No se han encontrado recintos de la localidad indicada" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const recinto = await Recinto.findById(req.params.id);
        if (!recinto) {
            return res.status(404).send({ ok: false, error: "Recinto " + req.params.id + " no encontrado" });
        }
        res.status(200).send({ ok: true, resultado: recinto });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Recinto " + req.params.id + " no encontrado" });
    }
});


router.post('/', async (req, res) => {
    try {
        let nuevoRecinto = new Recinto({
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            localidad: req.body.localidad,
            aforoMaximo: req.body.aforoMaximo
        });
        const recintoCreado = await nuevoRecinto.save();
        res.status(201).send({ ok: true, resultado: recintoCreado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo recinto" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const recintoEliminado = await Recinto.findByIdAndDelete(req.params.id);
        if (!recintoEliminado) {
            return res.status(404).send({ ok: false, error: "Error eliminando recinto " + req.params.id });
        }
        res.status(200).send({ ok: true, resultado: recintoEliminado });
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error eliminando recinto " + req.params.id });
    }
});

module.exports = router;

