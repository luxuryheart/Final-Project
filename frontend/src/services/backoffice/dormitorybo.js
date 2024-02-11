import axios from "axios";

export const    GetDormitoryByID = async (id) => {
    try {
        const res = await axios.get(`/api/v1/get-all-rooms/${id}`)
        if (res.data.success) {
            return res.data.dormitoryDetail
        }
    } catch (error) {
        console.log(error);
    }
}

export const GetRenterDetailByID = async (id) => {
    try {
        const res = await axios.get(`/api/v1/backoffice/renter-detail/${id}`)
        if (res.data.success) {
            return res.data.renter
        } else {
            return res.data.renter
        }
    } catch (error) {
        console.log(error);
    }
}