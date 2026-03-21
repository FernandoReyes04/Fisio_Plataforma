import {defineStore} from "pinia";
import moment from 'moment'

export const clavesStore = defineStore('claves', {
    state: () => ({
        modificacionCita: false,
        vigencias: [],
        timeoutIds: [],
    }),
    actions: {
        programarEjecucion(vigencia) {
            const now = moment().toISOString();

            const diferencia = moment.duration(moment(vigencia).diff(now)).asMilliseconds();

            if (diferencia > 0) {
                const timeoutId = setTimeout(() => {
                    this.executeMethod(vigencia);
                }, diferencia);

                this.timeoutIds[vigencia] = timeoutId;
            }
        },
        executeMethod(vigencia) {
            this.modificacionCita = true;
            this.clearTimeoutId(vigencia);
        },
        clearTimeoutId(vigencia) {
            const timeoutId = this.timeoutIds[vigencia];
            if (timeoutId) {
                clearTimeout(timeoutId);
                delete this.timeoutIds[vigencia];
            }
        },
        setVigencia(vigencia) {
            this.vigencias.push(vigencia);
        }
    }
})