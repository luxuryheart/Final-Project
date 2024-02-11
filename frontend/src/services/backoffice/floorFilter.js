import axios from "axios"

export const GetFloorFilter = async(floorId) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/floor-filter/${floorId}`);
        if (res.data.success) {
            return res.data.floors.rooms;
        }
    } catch (error) {
        console.log(error);
    }
    
}

export const GetFloorByDormitoryID = async (id) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/floors/${id}`)
        if (res.data.success) {
            return res.data.floors
        }
    } catch (error) {
        console.log(error);
    }
}