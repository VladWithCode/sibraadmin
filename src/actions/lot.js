import { redTypes } from "../types/reduxTypes";
import { staticURL } from "../url";
import { uiFinishLoading, uiStartLoading } from "./ui";


export const setLot = lot => ({
    type: redTypes.setLot,
    payload: lot
})

export const getLot = id => {
    const url = `${staticURL}/lots/${id}`;

    console.log('obteniendo lote');

    return (dispatch) => {
        dispatch(uiStartLoading());
        fetch(url)
            .then(resp => {
                return resp.json();
            })
            .then(data => {
                dispatch(uiFinishLoading());
                dispatch(setLot(data.lot));
                console.log('Lote obtenido: ', data.lot);
            })
            .catch(err => console.log(err))
    }
}