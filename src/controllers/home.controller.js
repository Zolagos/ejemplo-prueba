import ReservationCard from "@components/ReservationCard";
import { getReservations } from "@services/reservation.service";
import { getSession } from "@/utils";

export const homeController = async () => {
  const container = document.querySelector("#reservationsContainer");

  const user = getSession();

  const reservations = await getReservations();

  console.log(reservations)
  console.log(user.id)
  const filteredReservations =
    user.role === "admin"
      ? reservations
      : reservations.filter((reservation) => reservation.userId == user.id);

  console.log(filteredReservations)
  container.innerHTML = container.innerHTML = filteredReservations?.length
    ? filteredReservations
        .map((reservation) => ReservationCard(reservation))
        .join("")
    : `
      <div class="w-full text-center py-8 col-span-2">
        <p class="text-slate-500">
          No hay reservas disponibles
        </p>
      </div>
    `;

    const botoncitoUser = document.getElementById('botonReservaU')
    botoncitoUser.addEventListener('click', (event)=>{
      
    })

};

