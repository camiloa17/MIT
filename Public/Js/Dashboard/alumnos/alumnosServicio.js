class AlumnosServicio {
    constructor() {
    }

    async getAlumnos(filtro, valor, todos, mostrar, error, id) {
        try {
            const response = await fetch(`/dashboard/listarAlumnos/${filtro}&${valor}&${todos}`);
            const rta = await response.json();

            if (rta.error) {
                console.log(rta.error)
                error(id)
            } else {
                mostrar(rta)
            }

        } catch (err) {
            console.log(err)
            err ? error(id) : null;
        }
    }

}