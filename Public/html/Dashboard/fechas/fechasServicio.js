class FechasServicio {

  async enviarMails(datos, printMensaje, error, id) {
    try {
      const response = await fetch(`./enviarMails/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const rta = await response.json();

      if(rta.error) {
        printMensaje(id, rta.error)     
        console.log(rta.error)
        console.log(rta.mensaje)
      } else {
        printMensaje(id, rta.status);
        console.log("EXITO", rta);
      }

    } catch (err) {
      err ? error(id) : null;
      console.log(err);
    }
  }

  async agregarFechaDia(datos, exito, error, clean, id) {
    try {
      const response = await fetch(`./agregarFechaDia/`, {
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
      console.log(err);
    }
  }


  async updateExamenesEnFecha(datos, tipoDeLista, guardadoExitoso, error, id) {
    console.log("estamos en servicio")
    try {
      const response = await fetch(`./updateExamenesEnFecha/`, {
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
        guardadoExitoso(tipoDeLista);
      }

    } catch (err) {
      err ? error(id) : null;
      console.log(err);
    }
  }

  async elminarFechaSemana(fecha, exito, error, id) {
    let datos= { fecha: fecha }
    
    try {
      const response = await fetch(`./elminarFechaSemana/`, {
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
        exito(id);
      }

    } catch (err) {
      err ? error(id) : null;
    }
  }

  async elminarFechaDiaLs(fecha, exito, error, id) {
    let datos= { fecha: fecha }
    
    try {
      const response = await fetch(`./elminarFechaDiaLs/`, {
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
        exito(id);
      }

    } catch (err) {
      err ? error(id) : null;
    }
  }

  async elminarFechaDiaRw(fecha, exito, error, id) {
    let datos= { fecha: fecha }
    
    try {
      const response = await fetch(`./elminarFechaDiaRw/`, {
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
        exito(id);
      }

    } catch (err) {
      err ? error(id) : null;
    }
  }


  // Me trae horarios de Orales y Escritos
  async getListaHorarios(exito, error, id, accionLuegoDeGuardar, fechasAntiguas) {
    try {
      const response = await fetch(`./listarHorarios/${fechasAntiguas}`);
      const rta = await response.json();

      if (rta.error) {
        error(id)
      } else {        
        exito(rta);
        accionLuegoDeGuardar ? accionLuegoDeGuardar() : null;
      }

    } catch (err) {
      err ? error(id) : null;
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

  async asignarDiaASemanaExamenOral(datos, idSelected, exito, error, id, accion) {
    try {
      const response = await fetch(`./asignarDiaASemanaExamenOral/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const rta = await response.json();
      
      if (rta.error) {
        error(id)
      } else {        
        exito(id);
        accion(idSelected)
      }

    } catch (err) {
      console.log(err);
      err ? error(id) : null;
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



  async getListaSemanas(exito, error, id, accionLuegoDeGuardar, fechasAntiguas)  {
    try {
      const response = await fetch(`./listarSemanas/${fechasAntiguas}`);
      const rta = await response.json();

      if (rta.error) {
        error(id)
      } else {        
        exito(rta)
        accionLuegoDeGuardar ? accionLuegoDeGuardar() : null;
      }

    } catch (err) {
      err ? error(id) : null;
    }
  }

  async getExamenesEnFecha(fecha, tipo, editable, exito, error, id){
    try {
      const response = await fetch(`./listarExamenesEnFecha/${fecha}&${tipo}`);
      const rta = await response.json();

      if (rta.error) {
        error(id)
      } else {        
        exito(editable, rta, tipo)
      }

    } catch (err) {
      err ? error(id) : null;
    }
  }

  

  async getExamenesEnSemana(semana, editable, exito, error, id) {
    try {
      const response = await fetch(`./listarExamenesEnSemana/${semana}`);
      const rta = await response.json();

      if (rta.error) {
        error(id)
      } else {        
        exito(editable, rta)
      }

    } catch (err) {
      err ? error(id) : null;
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

  async getExcelAsistencia(fecha, tipo, fechaString, error, id){
    try {
      let fileName
      await fetch(`./excelAsistencia/${fecha}&${tipo}&${fechaString}`).then(
        function(response) {
          fileName= response.headers.get('content-disposition')
          return response.blob();
        }).then(function(blob) {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();    
          a.remove();         
        }
      );
    } catch (err) {
      err ? error(id) : null;
      console.log("error serviciio", err)
    }
  }

  async getExcelTrinity(fecha, tipo, exito, error, id){
    try {
      const response = await fetch(`./excelTrinity/${fecha}&${tipo}`);
     
      console.log(response)
      

      // if (rta.error) {
      //   error(id)
      // } else {        
      //   // exito(rta)
      // }

    } catch (err) {
      err ? error(id) : null;
      console.log("error serviciio", err)
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

  stringDiaEspanol(datetime){
    let anio = datetime.slice(0, 4);
    let mes = datetime.slice(5, 7);
    let dia = datetime.slice(8, 10);

    let fechaJs = new Date(anio, mes-1, dia);
 
    let numeroDia = fechaJs.getDay();


    const weekday = new Array(7);
    weekday[0] = "Domingo";
    weekday[1] = "Lunes";
    weekday[2] = "Marrtes";
    weekday[3] = "Miércoles";
    weekday[4] = "Jueves";
    weekday[5] = "Viernes";
    weekday[6] = "Sábado";

    const meses = new Array(12);
    meses['01'] = "Enero";
    meses['02'] = "Febrero";
    meses['03'] = "Marzo";
    meses['04'] = "Abril";
    meses['05'] = "Mayo";
    meses['06'] = "Junio";
    meses['07'] = "Julio";
    meses['08'] = "Agosto";
    meses['09'] = "Septiembre";
    meses['10'] = "Octubre";
    meses['11'] = "Noviembre";
    meses['12'] = "Diciembre";

    let stringDia = `${weekday[numeroDia]} ${dia} de ${meses[mes]} ${anio}`;
    return stringDia;
  }

  stringHoraEspanol(datetime){
    let hora = datetime.slice(11, 16);

    let stringHora = `${hora} hs`;
    return stringHora;
  }
}
