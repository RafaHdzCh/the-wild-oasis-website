import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import { GetBookedDatesByCabinId, GetSettings } from "../_lib/data-service";
import { auth } from "../_lib/auth";
import LoginMessage from "./LoginMessage";

export default async function Reservation({cabin})
{
  const [settings, bookedDates] = await Promise.all(
    [
      GetSettings(),
      GetBookedDatesByCabinId(cabin.id)
    ]
  );

  const session = await auth();

  return(
    <div className="
      grid 
      grid-cols-2 
      border 
      border-primary-800 
      min-h-[400px]"
    > 
      <DateSelector 
        cabin={cabin}
        settings={settings}
        bookedDates={bookedDates}
      />
      {session?.user ? <ReservationForm cabin={cabin} user={session.user}/> : <LoginMessage />}
    </div>
  )
}