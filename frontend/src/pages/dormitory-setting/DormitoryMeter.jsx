import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

const DormitoryMeter = () => {  const [meters, setMeters] = useState([]);
    const token = localStorage.getItem("token");
    const { id } = useParams()
    const [waterPerUnit, setWaterPerUnit] = useState(0);
    const [waterPerMonth, setWaterPerMonth] = useState(0);
    const [electricalPerUnit, setElectricalPerUnit] = useState(0);
    const [electricalPerMonth, setElectricalPerMonth] = useState(0);
  
    const getMeter = async() => {
      try {
        const res = await axios.get(`/api/v1/get-meter-by-dormitory/${id}`, {
          headers: {
            authtoken: `${token}`,
          },
        })
        if (res.data.success) { 
          setMeters(res.data.meters)
          setWaterPerUnit(res.data.meters.waterMeter[0].price)
          setWaterPerMonth(res.data.meters.waterMeter[1].price)
          setElectricalPerUnit(res.data.meters.electricalMeter[0].price)
          setElectricalPerMonth(res.data.meters.electricalMeter[1].price)
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    const handleElectricalChange = (e) => {
      const { name, value } = e.target;
    
      setMeters((prevMeters) => ({
        ...prevMeters,
        electricalMeter: prevMeters.electricalMeter.map((meter) =>
          meter.name === name ? { ...meter, price: parseFloat(value) } : meter
        ),
      }));
    };
  
    const handleWaterChange = (e) => {
      const { name, value } = e.target;
  
      setMeters((prevMeters) => ({
        ...prevMeters,
        waterMeter: prevMeters.waterMeter.map((meter) =>
          meter.name === name ? { ...meter, price: parseFloat(value) } : meter
        ),
      }))
    }
  
    const handleElectricalUpdate = async(e, id) => {
      e.preventDefault()
      const price = meters.electricalMeter.find((meter) => meter._id === id).price
      try {
        const res = await axios.put(`/api/v1//update-meter`, {
          flag: "1",
          id: id,
          price: price
        }, {
          headers: {
            authtoken: `${token}`,
          },
        })
        if (res.data.success) {
          setTimeout(() => getMeter(), 1000)
        }
      } catch (error) {
        console.log(error);
      }
    }
    
    const handleWaterUpdate = async(e, id) => {
      e.preventDefault()
      const price = meters.waterMeter.find((meter) => meter._id === id).price
      try {
        const res = await axios.put(`/api/v1//update-meter`, {
          flag: "2",
          id: id,
          price: price
        }, {
          headers: {
            authtoken: `${token}`,
          },
        })
        if (res.data.success) {
          setTimeout(() => getMeter(), 1000)
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    useEffect(() => {
      getMeter()
    }, [])
  return (
    <div className='bg-bgForm text-colorDark rounded-lg shadow-md'>
    <div className='py-5 px-4 xl:px-16'>
      <div className="flex flex-col justify-center items-start w-full px-5 text-xl mb-5 xl:gap-x-5">
        <div className="grid grid-cols-4 w-full gap-x-2 md:gap-x-3 mt-5 px-5">
          {meters &&
            meters.electricalMeter &&
            meters.electricalMeter.map((meter, i) => (
              <div
                key={i}
                className="bg-red-300 px-3 py-2 rounded-lg shadow-lg text-center text-red-800 text-lg relative"
              >
                {meter.name === "คิดตามหน่วยจริง" ? (
                  <p className="text-sm mb-3">
                    {meter.name} หน่วยละ {electricalPerUnit} บาท
                  </p>
                ) : (
                  <p className="text-sm mb-3">
                    {meter.name} {electricalPerMonth} บาท/เดือน
                  </p>
                )}
                <input
                  type="number"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs mb-2"
                  value={meter.price}
                  name={meter.name}
                  onChange={(e) => {
                    const numericInput = e.target.value.replace(/\D/g, "");
                    handleElectricalChange(e);
                  }}
                />
                <button
                  className="text-center bg-colorBlueDark text-bgColor w-full py-2 rounded-lg text-sm shadow-sm hover:bg-slate-400 duration-300 hover:scale-110"
                  onClick={(e) => handleElectricalUpdate(e, meter._id)}
                >
                  อัพเดต
                </button>
                <div className="absolute -top-5 -left-2 bg-red-100 rounded-xl text-sm text-red-500 px-2 py-1 border border-yellow-500">
                  ค่าไฟ
                </div>
              </div>
            ))}
          {meters &&
            meters.waterMeter &&
            meters.waterMeter.map((meter, i) => (
              <div
                key={i}
                className="bg-sky-400 px-3 py-2 rounded-lg shadow-lg text-center text-sky-900 text-lg relative"
              >
                {meter.name === "คิดตามหน่วยจริง" ? (
                  <p className="text-sm mb-3">
                    {meter.name} หน่วยละ {waterPerUnit} บาท
                  </p>
                ) : (
                  <p className="text-sm mb-3">
                    {meter.name} {waterPerMonth} บาท/เดือน
                  </p>
                )}
                <input
                  type="number" // Changed from "text" to "number"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs mb-2"
                  value={meter.price}
                  name={meter.name}
                  onChange={(e) => {
                    const numericInput = e.target.value.replace(/\D/g, "");
                    handleWaterChange(e);
                  }}
                />
                <button
                  className="text-center bg-colorBlueDark text-bgColor w-full py-2 rounded-lg text-sm shadow-sm hover:bg-slate-400 duration-300 hover:scale-110"
                  onClick={(e) => handleWaterUpdate(e, meter._id)}
                >
                  อัพเดต
                </button>
                <div className="absolute -top-5 -left-2 bg-sky-100 rounded-xl text-sm text-sky-500 px-2 py-1 border border-green-500">
                  ค่าน้ำ
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default DormitoryMeter