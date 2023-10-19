import axios from "axios";
import * as cheerio from "cheerio";

export async function aseo_macul(rol, dv) {
  try {
    // measurement_date info
    const fechaActual = new Date();

    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();
    const hora = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();

    const fechaFormateada = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;

    // Scraping
    const response = await axios.get(
      "https://pagos.munimacul.cl/PagoAseoWeb/Pago/ListarDeuda",
      {
        params: {
          rol: `${rol}`,
          dv: `${dv}`,
        },
        headers: {
          authority: "pagos.munimacul.cl",
          accept: "text/html, */*; q=0.01",
          "accept-language": "es-ES,es;q=0.9,en;q=0.8,ja;q=0.7",
          referer: "https://pagos.munimacul.cl/PagoAseoWeb/Pago",
          "sec-ch-ua":
            '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
          "x-requested-with": "XMLHttpRequest",
        },
      }
    );

    const $ = cheerio.load(response.data);
    let total = 0;

    $("td:nth-child(8)").each((index, element) => {
      const pay = $(element).text().trim().slice(1).replace(",", "");
      const payInt = parseInt(pay);
      total = total + payInt;
    });

    console.log(total);
    if (total > 0) {
      return {data:{
        id:rol+'-'+dv,
        measurement_date:fechaFormateada,
        invoice_amount: total,
      }};
    } else {
      return {data:{
        id:rol+'-'+dv,
        invoice_amount: "Sin deuda/No registrado",
      }};
    }
  } catch {
    return {data:{
      invoice_amount: "Error al cargar página",
    }};
  }
}

export default aseo_macul;
