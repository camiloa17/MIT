class FechasServicio {
  async agregarFechaDia(dataNuevaFecha) {
    try {
      const response = await fetch(`./agregarFechaDia/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataNuevaFecha)
      });
      const rta = await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async agregarExamenFechaDia(datos) {
    try {
      const response = await fetch(`./agregarExamenFechaDia/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const rta = await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async agregarFechaSemana(datos, exito, error, clean, id) {
    try {
      const response = await fetch(`./agregarFechaSemana/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const rta = await response.json();
      
      if(rta.error) {
        error(id)
      } else {
        clean();
        exito(id);
      }

    } catch (err) {
      err ? error(id) : null;
    }
  }

  // Me trae horarios de Orales y Escritos
  async getListaHorarios() {
    try {
      const response = await fetch("./listarHorarios/");
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Me trae horarios de Orales
  async getListaHorariosOrales() {
    try {
      const response = await fetch("./listarHorariosOrales/");
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async asignarDiaASemanaExamenOral(datos) {
    try {
      const response = await fetch(`./asignarDiaASemanaExamenOral/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const rta = await response.json();
      console.log(response.body)
    } catch (err) {
      console.log(err);
    }
  }



  
  async getElementosListaReservasEnSemanasLs(semana) {
    try {
      const response = await fetch(`./listarReservaSemanasLs/${semana}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async getElementosListaReservasEnDiaRw(fecha) {
    try {
      const response = await fetch(`./listarReservaDiaRw/${fecha}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async getElementosListaReservasEnDiaLs(fecha) {
    try {
      const response = await fetch(`./listarReservaDiaLs/${fecha}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }



  async getListaSemanas() {
    try {
      const response = await fetch("./listarSemanas/");
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async getExamenesEnFecha(fecha, tipo) {
    try {
      const response = await fetch(`./listarExamenesEnFecha/${fecha}&${tipo}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  

  async getExamenesEnSemana(semana) {
    try {
      const response = await fetch(`./listarExamenesEnSemana/${semana}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async getListaExamenes() {
    try {
      const response = await fetch("./listarExamenes/");
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  stringDiaHoraEspanol(datetime) {
    let anio = datetime.slice(0, 4);
    let mes = datetime.slice(5, 7);
    let dia = datetime.slice(8, 10);
    let hora = datetime.slice(11, 16);

    let fechaJs = new Date(anio, mes-1, dia);
 
    let numeroDia = fechaJs.getDay();


    const weekday = new Array(7);
    weekday[0] = "Dom";
    weekday[1] = "Lun";
    weekday[2] = "Mar";
    weekday[3] = "Mie";
    weekday[4] = "Jue";
    weekday[5] = "Vie";
    weekday[6] = "Sab";

    const meses = new Array(12);
    meses['01'] = "Ene";
    meses['02'] = "Feb";
    meses['03'] = "Mar";
    meses['04'] = "Abr";
    meses['05'] = "May";
    meses['06'] = "Jun";
    meses['07'] = "Jul";
    meses['08'] = "Ago";
    meses['09'] = "Sep";
    meses['10'] = "Oct";
    meses['11'] = "Nov";
    meses['12'] = "Dic";

    let stringDia = `${weekday[numeroDia]} ${dia} de ${meses[mes]} ${anio} - ${hora} hs`;
    return stringDia;
  }

  uuid() {
    var uuid = "",
      i,
      random;
    for (i = 0; i < 32; i++) {
      random = (Math.random() * 16) | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-";
      }

      uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
    }
    return uuid;
  }
}
