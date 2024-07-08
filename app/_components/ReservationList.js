"use client";

import { DeleteBooking } from "../_lib/actions";
import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";

export default function ReservationList({ bookings }) 
{
  const [optimisticBookings, OptimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => 
    {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function HandleDelete(bookingId) 
  {
    OptimisticDelete(bookingId);
    await DeleteBooking(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={HandleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}