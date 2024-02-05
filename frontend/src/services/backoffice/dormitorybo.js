import axios from "axios";

export const GetDormitoryByID = async (id) => {
    try {
        const res = await axios.get(`/api/v1/get-all-rooms/${id}`)
        if (res.data.success) {
            return res.data.dormitoryDetail
        }
    } catch (error) {
        console.log(error);
    }
}