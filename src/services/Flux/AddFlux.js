import { useState } from "react";
import { addFlux } from "./serviceapi";

const AddFlux = () => {
    const [ips, setIps] = useState("");
    const [ports, setPorts] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ipList = ips.split(",").map(ip => ip.trim());
        const portList = ports.split(",").map(port => parseInt(port.trim()));

        await addFlux(ipList, portList);
        alert("Flux ajoutés avec succès !");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="IPs (ex: 192.168.1.1, 192.168.1.2)" value={ips} onChange={(e) => setIps(e.target.value)} required />
            <input type="text" placeholder="Ports (ex: 8080, 9090)" value={ports} onChange={(e) => setPorts(e.target.value)} required />
            <button type="submit">Ajouter</button>
        </form>
    );
};

export default AddFlux;
