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

export const GetRoomByMeterUnit = async(floorId, date, dormitoryId) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/room-by-meter-units/${floorId}?date=${date}&dormitoryId=${dormitoryId}`)
        if (res.data.success) {
            return res.data.meterUnitRoom
        } else {
            return res.data.meterUnitRoom   
        }
    } catch (error) {
        console.log(error);
    }
}
export const GetRoomByElectricalMeterUnit = async(floorId, date, dormitoryId) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/room-by-elec-meter-units/${floorId}?date=${date}&dormitoryId=${dormitoryId}`)
        if (res.data.success) {
            return res.data.electricalMeterUnitRoom
        } else {
            return res.data.electricalMeterUnitRoom
        }
    } catch (error) {
        console.log(error);
    }
}