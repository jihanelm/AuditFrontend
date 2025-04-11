import { useEffect, useState } from "react";
import { closeFlux } from "./serviceapi";
import axios from "axios";

const FluxList = () => {
    const [fluxList, setFluxList] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/flux/").then((res) => setFluxList(res.data));
    }, []);

    const handleClose = async (id) => {
        await closeFlux(id);
        alert("Flux fermé !");
    };

    return (
        <ul>
            {fluxList.map((flux) => (
                <li key={flux.id}>
                    {flux.ip}:{flux.port} - {flux.status ? "Ouvert" : "Fermé"}
                    {flux.status && <button onClick={() => handleClose(flux.id)}>Fermer</button>}
                </li>
            ))}
        </ul>
    );
};

export default FluxList;
