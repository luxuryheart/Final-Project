import { useState } from 'react';
import axios from 'axios';
import { ImCross } from 'react-icons/im';
import { MdApartment } from "react-icons/md";

const SearchDormitoryModal = ({ setSearchModal }) => {
    const [numberId, setNumberId] = useState("");
    const [dormitory, setDormitory] = useState({});
    const [connectionSuccess, setConnectionSuccess] = useState(false);
    const [haveDormitory, setHaveDormitory] = useState(false);

    const searchDormitory = async () => {
        try {
            if (numberId) {
                const res = await axios.post(`/api/v1/dormitory-search`, {
                    numberId: numberId
                }, {
                    headers: {
                        authtoken: localStorage.getItem("token"),
                    },
                });
                if (res.data.success) {
                    setDormitory(res.data.dormitory);
                    setHaveDormitory(true);
                }
            } else {
                console.error("numberId is undefined");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const ConnectDormitory = async () => {
        try {
            if (dormitory) {
                const res = await axios.post(`/api/v1/dormitory-connection`, {
                    dormitoryId: dormitory._id
                }, {
                    headers: {
                        authtoken: localStorage.getItem("token"),
                    },
                });
                if (res.data.success) {
                    setConnectionSuccess(true);
                    setTimeout(() => setSearchModal(false), 1500);
                }
            } else {
                console.error("dormitory is undefined");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='bg-colorBlueDark/30 z-20 w-screen h-screen absolute'>
            <div className='relative'>
                <div className='absolute bg-bgForm rounded-md shadow-lg top-28 xl:right-[450px] lg:right-[300px] py-4 w-2/5'>
                    <div className='flex items-center justify-end px-3'>
                        <ImCross className='text-colorBlueGray h-5 w-5 hover:scale-105 duration-300 cursor-pointer' onClick={() => setSearchModal(false)} />
                    </div>
                    <div className='text-center text-xl text-colorDark mb-3' onClick={searchDormitory}>ค้นหาหอพัก</div>
                    <div className='text-center mb-5'>
                        <input type="number" placeholder="ไอดีหอพัก" className="input input-bordered input-sm w-full max-w-xs" name='numberId' onChange={(e) => setNumberId(e.target.value)} value={numberId} />
                        <button className="btn btn-sm bg-colorBlueDark text-bgColor ml-3" onClick={searchDormitory}>ค้นหา</button>
                    </div>
                    {dormitory && haveDormitory && (
                        <div className='mt-5 px-3 text-colorBlueDark'>
                            <div className='flex items-center xl:justify-center gap-x-1 mb-5'>
                                <MdApartment className='h-5 w-5'/> หอพัก: {dormitory.name}
                            </div>
                            <div>
                                <button className="btn btn-success text-bgColor btn-sm w-full" onClick={ConnectDormitory}>เชื่อมต่อหอพัก</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchDormitoryModal;
