import axios from "axios";

export const GetWaterMeter = async(id) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/water-units/${id}`, {
            headers: {
                authtoken: `${localStorage.getItem("token")}`,
            },
        })
        if (res.data.success) {
            return res.data.waterUnits
        }
    } catch (error) {
        console.log(error);
    }
}

export const GetElectricalMeter = async(id) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/electric-units/${id}`, {
            headers: {
                authtoken: `${localStorage.getItem("token")}`,
            },
        })
        if (res.data.success) {
            return res.data.electricUnits
        }
    } catch (error) {
        console.log(error);
    }
}