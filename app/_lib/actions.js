"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { GetBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function SignInAction()
{
  await signIn("google", {redirectTo: "/account"});
}

export async function SignOutAction()
{
  await signOut({redirectTo: "/"});
}

export async function UpdateProfile(formData) 
{
  try 
  {
    const session = await auth();
    if (!session) throw new Error("You must be logged in!");

    const guestId = session.user?.guestId;
    if (!guestId) 
      {
      throw new Error("Guest ID is undefined. Please check the authentication session.");
    }

    const nationalID = formData.get("nationalID");
    const [nationality, countryFlag] = formData.get("nationality").split("%");

    const regex = /^[a-zA-Z0-9]{6,12}$/;
    if (!regex.test(nationalID)) throw new Error("Please provide a valid NationalID");

    const updateData = 
    { 
      nationality: nationality || '', 
      countryFlag: countryFlag || '', 
      nationalID: nationalID || '' 
    };

    const { data, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId);

    if (error) 
    {
      throw new Error('Guest could not be updated');
    }

    revalidatePath("/account/profile");
  } 
  catch (error) 
  {
    throw error;
  }
}

export async function DeleteBooking(bookingId)
{
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const guestBookings = await GetBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map(booking => booking.id);

  if(!guestBookingsIds.includes(bookingId))
  {
    console.error(error);
    throw new Error('You are not allowed to delete this booking');
  }

  const {  error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) 
  {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }

  revalidatePath("/account/reservations");
}

export async function UpdateBooking(formData)
{
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await GetBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function CreateBooking(bookingData, formData) 
{
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = 
  {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase
    .from("bookings")
    .insert([newBooking]);
  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}