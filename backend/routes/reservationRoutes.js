import express from "express";
import Reservation from "../models/reservation.js";

const router = express.Router();


// POST reservation
router.post("/", async (req, res) => {

  try {

    const newRes =
      new Reservation(req.body);

    await newRes.save();

    res.status(201).json({
      message:
        "Reservation saved successfully!"
    });

  }

  catch (err) {

    res.status(500).json({
      error:
        "Error saving reservation"
    });

  }

});


// GET all reservations
router.get("/", async (req, res) => {

  try {

    const reservations =
      await Reservation.find()
        .sort({ createdAt: -1 });

    res.json(reservations);

  }

  catch (err) {

    res.status(500).json({
      error:
        "Error fetching reservations"
    });

  }

});


// PATCH reservation status
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

  catch (err) {

    res.status(500).json({
      error:
        "Error updating reservation"
    });

  }

});


export default router;