import { store, generateId, findListingById, findReservationById } from "../data/store.js";

const toReservationResponse = (reservation) => ({
        ...reservation,
        guests: Number(reservation.guests || 1),
});

export const getReservations = async (req, res) => {
        return res.status(200).json({
                success: true,
                data: store.reservations.map(toReservationResponse),
        });
};

export const createReservation = async (req, res) => {
        const payload = req.body || {};
        const listingId = payload.listingId;

        if (!listingId || !findListingById(listingId)) {
                return res.status(400).json({
                        success: false,
                        message: "A valid listingId is required to create a reservation",
                });
        }

        const reservation = {
                id: generateId("reservation"),
                listingId,
                guestName: payload.guestName || "Guest",
                guestEmail: payload.guestEmail || "guest@example.com",
                guests: payload.guests ?? 1,
                startDate: payload.startDate || new Date().toISOString().slice(0, 10),
                endDate: payload.endDate || new Date().toISOString().slice(0, 10),
                status: payload.status || "pending",
                notes: payload.notes || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
        };

        store.reservations.unshift(reservation);

        return res.status(201).json({
                success: true,
                data: toReservationResponse(reservation),
        });
};

export const getReservationById = async (req, res) => {
        const reservation = findReservationById(req.params.id);

        if (!reservation) {
                return res.status(404).json({
                        success: false,
                        message: "Reservation not found",
                });
        }

        return res.status(200).json({
                success: true,
                data: toReservationResponse(reservation),
        });
};

export const updateReservation = async (req, res) => {
        const reservation = findReservationById(req.params.id);

        if (!reservation) {
                return res.status(404).json({
                        success: false,
                        message: "Reservation not found",
                });
        }

        const payload = req.body || {};

        if (payload.listingId && !findListingById(payload.listingId)) {
                return res.status(400).json({
                        success: false,
                        message: "Provided listingId does not exist",
                });
        }

        reservation.listingId = payload.listingId ?? reservation.listingId;
        reservation.guestName = payload.guestName ?? reservation.guestName;
        reservation.guestEmail = payload.guestEmail ?? reservation.guestEmail;
        reservation.guests = payload.guests ?? reservation.guests;
        reservation.startDate = payload.startDate ?? reservation.startDate;
        reservation.endDate = payload.endDate ?? reservation.endDate;
        reservation.status = payload.status ?? reservation.status;
        reservation.notes = payload.notes ?? reservation.notes;
        reservation.updatedAt = new Date().toISOString();

        return res.status(200).json({
                success: true,
                data: toReservationResponse(reservation),
        });
};

export const deleteReservation = async (req, res) => {
        const reservationIndex = store.reservations.findIndex((reservation) => reservation.id === req.params.id);

        if (reservationIndex === -1) {
                return res.status(404).json({
                        success: false,
                        message: "Reservation not found",
                });
        }

        store.reservations.splice(reservationIndex, 1);

        return res.status(200).json({
                success: true,
                message: "Reservation cancelled",
        });
};
