/* eslint-disable no-undef */
import { GetBookedDatesByCabinId, GetCabin } from "@/app/_lib/data-service";

export async function GET(request, { params }) 
{
  const { cabinId } = params;

  try 
  {
    const [cabin, bookedDates] = await Promise.all([
      GetCabin(cabinId),
      GetBookedDatesByCabinId(cabinId)
    ]);
    return Response.json({ cabin, bookedDates });
  } 
  catch (error) 
  {
    return Response.json({ message: "Cabin not found" });
  }
}