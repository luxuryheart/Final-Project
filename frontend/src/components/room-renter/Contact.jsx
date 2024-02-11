import React, { useEffect, useState } from "react";
import ContactCreate from "./ContactCreate";
import ContactPayment from "./ContactPayment";
import axios from "axios";

const Contact = ({ floorId, roomId, getRenterDetail }) => {
  const [next, setNext] = useState(0);
  const [contactData, setContactData] = useState({
    name: "",
    personalId: "",
    startDate: "",
    endDate: "",
    durationInMonth: 0,
    deposit: 0.0,
    refundAmount: 0.0,
    haveDeposit: false,
    waterMeter: 0,
    electricalMeter: 0,
    note: "",
    tel: "",
    address: "",
    floorId: floorId,
    roomId: roomId,
  });

  console.log(contactData);

  const [list, setList] = useState([
    {
        name: "",
        price: "",
    }
  ])

  const [users, setUsers] = useState([]);

  const getUser = async () => {
    try {
      const res = await axios.get("/api/v1/users", {
        headers: {
          authtoken: `${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {next === 0 ? (
        <ContactCreate
          next={next}
          setNext={setNext}
          contactData={contactData}
          setContactData={setContactData}
          users={users}
          floorId={floorId}
          roomId={roomId}
        />
      ) : next === 1 ? (
        <ContactPayment
          next={next}
          setNext={setNext}
          contactData={contactData}
          setContactData={setContactData}
          users={users}
          list={list}
          setList={setList}
          floorId={floorId}
          roomId={roomId}
          getRenterDetail={getRenterDetail}
          setRoomModal={setRoomModal}
        />
      ) : null}
    </>
  );
};

export default Contact;
