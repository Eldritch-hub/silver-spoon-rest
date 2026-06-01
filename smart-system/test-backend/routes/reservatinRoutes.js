
import express from "express";

import Reservation from "../models/Reservation.js";

const router = express.Router();


// ==============================
// GET ALL RESERVATIONS
// ==============================

router.get("/", async (req, res) => {

  try {

    const reservations =
      await Reservation.find();

    res.json(reservations);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ==============================
// CREATE NEW RESERVATION
// ==============================

router.post("/", async (req, res) => {

  try {

    const reservation =
      new Reservation(req.body);

    const savedReservation =
      await reservation.save();

    res.status(201).json(savedReservation);

  }

  catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});


// ==============================
// UPDATE RESERVATION STATUS
// ==============================

router.patch("/:id", async (req, res) => {

  try {

    const updatedReservation =
      await Reservation.findByIdAndUpdate(

        req.params.id,

        {
          status: req.body.status
        },

        {
          new: true
        }

      );

    res.json(updatedReservation);

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


export default router;