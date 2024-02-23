import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RenterManagement = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);

  // pagination for rooms
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;
  const lastIndex = currentPage * recordsPerPage; // 1 * 3 = 3
  const firstIndex = lastIndex - recordsPerPage; // 3 - 3 = 0
  const records = users.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(users.length / recordsPerPage);
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  const GetRenterByDormitoryID = async () => {
    try {
      const res = await axios.get(`/api/v1/backoffice/renter/${id}`);
      if (res.data.success) {
        setUsers(res.data.renter)
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const changePage = (id) => {
    setCurrentPage(id);
  }

  useEffect(() => {
    GetRenterByDormitoryID();
  }, []);
  return (
    <div className="px-5 mt-6">
      <div className="flex flex-col justify-center text-colorBlueDark">
        <div className="text-2xl font-bold mb-5">ผู้เช่า</div>
        <div id="table">
          {users.length > 0 ? (
            <div>
              <div className="overflow-x-auto mb-5 max-h-[80vh]">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr className="bg-base-300 text-base text-center">
                      <th>ชื่อ - นามสกุล</th>
                      <th>อีเมล</th>
                      <th>เบอร์โทร</th>
                      <th>ตำแหน่ง</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((user, i) => (
                      <tr
                        className={`${
                          i % 2 !== 0 ? "bg-base-300" : " "
                        } text-center`}
                        key={i}
                      >
                        <td>
                          {user.userId?.profile?.firstname} {user.userId?.profile?.lastname}
                        </td>
                        <td>{user.userId?.email}</td>
                        <td>{user.userId?.tel === "" ? "-" : user.userId?.tel}</td>
                        <td>{"ผู้เช่า"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="join text-sm">
                <button
                  className="join-item bg-colorBlueDark/10 px-2 py-1 text-center text-xs hover:bg-colorBlueDark/20"
                  onClick={prePage}
                >
                  Prev
                </button>
                {numbers.map((n, i) => (
                  <button
                    className={`join-item bg-colorBlueDark/10 px-3 py-1 text-center hover:bg-colorBlueDark/20${
                      currentPage === n
                        ? " active:bg-colorBlueDark/20 focus:bg-colorBlueDark/20 "
                        : " "
                    }`}
                    key={i}
                    onClick={() => changePage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="join-item bg-colorBlueDark/10 px-2 py-1 text-center text-xs hover:bg-colorBlueDark/20"
                  onClick={nextPage}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xl font-semibold mb-5 text-center text-colorBlueGray mt-10">
              ไม่พบผู้เช่า
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenterManagement;
