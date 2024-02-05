const { populate } = require("dotenv");
const {
  dormitoryModel,
  floorsModel,
  roomsModel,
  waterModel,
  electricalModel,
  bankModel,
  statusModel,
} = require("../../models/dormitory/dormitory.model");
const ErrorHandler = require("../../utils/ErrorHandler");

const DormitoryCreate = async (data, user, res) => {
  try {
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }
    const dormitory = await dormitoryModel.create({
      name: data.name,
      address: data.address,
      contact: data.contact,
      userID: user._id,
    });
    
    return dormitory;
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// add floor
const Addfloor = async (id, amount, res) => {
  try {
    // ลูปสร้างชั้นตามจำนวนที่ input
    let floorIds = [];
    for (let i = 0; i < amount; i++) {
      const floor = await floorsModel.create({
        name: i + 1,
      });
      floorIds.push(floor._id);
    }

    // เพ่ิมชั้นไปที่หอ
    await dormitoryModel.findByIdAndUpdate(
      { _id: id },
      { $push: { floors: { $each: floorIds } } },
      { new: true }
    );

    const updatedDormitory = await dormitoryModel
      .findById(id)
      .populate("floors");

    return floorIds;
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// add default rooms in floor
const Addrooms = async (id, dormitoryId, res) => {
  try {
    // สร้างห้อง
    let roomIds = [];
    let room;
    const roomAmount = 2
    const status = await statusModel.findOne({ name: "ว่าง" });
    for (let i = 0; i < id.length; i++) {
      let floor = await floorsModel.findById({ _id: id[i] });
      if (parseInt(floor.name) < 10) {
        for (let j = 0; j < roomAmount; j++) {
          room = floor.name + "0" + (j + 1);
          const createdRoom = await roomsModel.create({ name: room, status: status._id });
          roomIds.push(createdRoom._id);
        }
      } else if (parseInt(floor.name) >= 10) {
        for (let j = 0; j < roomAmount; j++) {
          room = floor.name + "0" + (j + 1);
          const createdRoom = await roomsModel.create({ name: room, status: status._id });
          roomIds.push(createdRoom._id);
        }
      }
      const updatedFloor = await floorsModel.findByIdAndUpdate(
        { _id: id[i] },
        { $push: { rooms: { $each: roomIds } } },
        { new: true }
      );
      roomIds = [];
    }

    const dormitory = await getDormitory(dormitoryId);

    res.status(200).json({
      success: true,
      message: "Dormitory created successfully",
      dormitory,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// TODO: ทำให้ response ออกไปแค่หอพักที่สร้าง
// get all dormitory and floor and room
const getDormitory = async (dormitoryId) => {
  try {
    // ดึงข้อมูลทั้งหมดของ dormitory พร้อม populate floors และ userID
    const dormitory = await dormitoryModel
      .findOne({ _id: dormitoryId })
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          model: "Room",
        },
      })
      .populate("userID", "-password");

    // เตรียมข้อมูลที่จะส่งกลับ
    const data = {
      // ข้อมูลของ dormitory
      _id: dormitory._id,
      name: dormitory.name,
      // ข้อมูลที่เพิ่มเติมของ floors และ userID
      floors: dormitory.floors.map((floor) => ({
        // ข้อมูลของชั้น
        _id: floor._id,
        name: floor.name,
        // เพิ่มข้อมูลของห้อง (rooms)
        rooms: floor.rooms.map((room) => ({
          // ข้อมูลของห้อง
          _id: room._id,
          name: room.name,
          roomCharge: room.roomCharge,
          enabled: room.enabled,
          waterID: room.waterID,
          electricID: room.electricID,
          status: room.status,
          // อื่น ๆ ที่ต้องการนำเข้าไป
        })),
        // อื่น ๆ ที่ต้องการนำเข้าไป
      })),
      userID: dormitory.userID,
      // อื่น ๆ ที่ต้องการนำเข้าไป
    };

    return data;
  } catch (error) {
    // หากเกิดข้อผิดพลาดในการดึงข้อมูล
    throw new Error(error); // or use next(error) if you're in an Express route handler
  }
};


// get all the rooms and floor

// flag 0 - increase floor 1
const InCreaseFloors = async (dormitoryId, res) => {
  try {
    console.log(dormitoryId);
    const dormitory = await dormitoryModel.findOne({ _id: dormitoryId });
    if (!dormitory) {
      return next(new ErrorHandler("Dormitory not found", 400));
    }

    if (dormitory.floors.length > 0) {
      const floorId = dormitory.floors[dormitory.floors.length - 1];
      const floorName = await floorsModel.findById({ _id: floorId });

      if (!floorName) {
        return next(new ErrorHandler(error, 400));
      }

      const floors = await floorsModel.find();

      // สร้าง array ของ floorId จาก floors
      const floorIdArray = floors.map((floor) => floor._id);

      const floorIncrease = await floorsModel.create({
        name: parseInt(floorName.name) + 1,
      });
      floorIdArray.push(floorIncrease._id);

      // เพิ่มห้องเข้าชั้นที ละ 1 ห้อง
      const rooms = await addRoom(floorIncrease);

      //อัพเดตจำนวนชั้นของหอ
      const dormitoryUpdate = await updatedDormitory(dormitory, floorIdArray)

      if (!dormitoryUpdate) {
        return next(new ErrorHandler("Dormitory update failed", 400));
      }

      res.status(201).json({
        success: true,
        message: "Dormitory update and Floor increase successfully",
        dormitoryUpdate,
        rooms,
      })

    }
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

const addRoom = async (floorIncrease) => {
  let roomIds = [];
  let room;
  let floor = await floorsModel.findById({ _id: floorIncrease._id });
  const status = await statusModel.findOne({ name: "ว่าง" });
  if (parseInt(floor.name) < 10) {
    for (let j = 0; j < 1; j++) {
      room = floor.name + "0" + (j + 1);
      const createdRoom = await roomsModel.create({ name: room, status: status._id });
      roomIds.push(createdRoom._id);
    }
  } else if (parseInt(floor.name) >= 10) {
    for (let j = 0; j < 1; j++) {
      room = floor.name + "0" + (j + 1);
      const createdRoom = await roomsModel.create({ name: room, status: status._id });
      roomIds.push(createdRoom._id);
    }
  }
  const updatedFloor = await floorsModel.findByIdAndUpdate(
    { _id: floorIncrease._id },
    { $push: { rooms: { $each: roomIds } } },
    { new: true }
  );

  return updatedFloor;
};

const updatedDormitory = async (dormitoryId, floorIds) => {
  await dormitoryModel.findByIdAndUpdate(
    { _id: dormitoryId._id },
    { floors: [] },
    { new: true }
  );

  const updatedDormitory =   await dormitoryModel.findByIdAndUpdate(
    { _id: dormitoryId._id },
    { $push: { floors: { $each: floorIds } } },
    { new: true }
  );

  return updatedDormitory;
}

// flag 1 - increase rooms on floor
const IncreaseRoom = async (floorId, res) => {
  try {
    const floor = await floorsModel.findById({ _id: floorId });
    const status = await statusModel.findOne({ name: "ว่าง" });

    if (floor.rooms.length > 0) {
      const floorLastId = floor.rooms[floor.rooms.length - 1]
      const roomName = await roomsModel.findById({ _id: floorLastId });
      if (parseInt(roomName.name % 10) <= 10) {
        const room = await roomsModel.create({
          name: (parseInt(roomName.name) + 1),
          status: status._id,
        })
        
        // สร้าง array ของ roomId จาก room
        let roomIdArray = floor.rooms
        roomIdArray.push(room._id)
  
        const floors = await updateFloor(floorId, roomIdArray)

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors
        })
      } else {
        const room = await roomsModel.create({
          name: parseInt(roomName.name) + "0" + (parseInt(roomName.name) + 1),
          status: status._id,
        })
        
        // สร้าง array ของ roomId จาก room
        let roomIdArray = floor.rooms
        roomIdArray.push(room._id)
  
        const floors = await updateFloor(floorId, roomIdArray)

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors
        })
      }

    } else {
        let roomId = []
        const floorName = floor.name
        const room = await roomsModel.create({
          name: floorName + "0" + 1,
          status: status._id,
        })
        roomId.push(room._id)
        const floors = await updateFloor(floorId, roomId)

        res.status(201).json({
          success: true,
          message: "Floors updated and increase room successfully",
          floors
        })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating"
    });
  }
}

const updateFloor = async (floorId, roomIdArray) => {
  await floorsModel.findByIdAndUpdate({ _id: floorId }, {
    rooms: []
  }, { new: true })

  const floorUpdate = await floorsModel.findByIdAndUpdate(
    { _id: floorId },
    { $push: { rooms: { $each: roomIdArray } } },
    { new: true }
  )
  return floorUpdate;

}

// flag 2 - delete rooms on floor
const DeleteRoom = async (floorId, roomId, res) => {
  try {
    // ลบ room จาก floor
    const floor = await floorsModel.findOneAndUpdate(
      { _id:floorId },
      { $pull: { rooms: roomId } },
      { new: true }
    );

    console.log(floor);

    // ลบ room โดยตรง
    const room = await roomsModel.findOneAndDelete({ _id:roomId });

    // เช็คว่ามี floor และ room หรือไม่
    if (!floor || !room) {
      return next(new ErrorHandler("Floor or Room not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });

  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}

// flag 3 - delete floor
const DeleteFloor = async (dormitoryId, floorId, res) => {
  try {
    // หา floor และ rooms
    const floor = await floorsModel.findOne({ _id: floorId });

    // ลบทุกรายการ rooms
    for (const roomId of floor.rooms) {
      await roomsModel.findByIdAndDelete(roomId);
    }

    // ลบ floor
    await floorsModel.findByIdAndDelete(floorId);

    // ลบ floorId จาก dormitory
    await dormitoryModel.findByIdAndUpdate(
      dormitoryId,
      { $pull: { floors: floorId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Floor deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

// update price for rooms

const UpdatePriceForRoom = async(floor, roomIds, price, res) => {
  try {
    for (const roomId of roomIds) {
      await roomsModel.findByIdAndUpdate({ _id: roomId }, {
        roomCharge: price.roomCharge
      }, { new: true } )
    }

    res.status(200).json({
      success: true,
      message: "Room charge updated successfully",
    })

  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}

// flag 0 - update water price
const UpdateWaterPrice = async(floorById, roomIds, waterId, res) => {
  try {
    for (const roomId of roomIds) {
      await roomsModel.findByIdAndUpdate({ _id: roomId }, {
        waterID: waterId
      }, { new: true })
    }

    res.status(200).json({
      success: true,
      message: "Water price updated successfully"
    })
    
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}

// flag 1 - update electrical price
const UpdateElectricalPrice = async(floorById, roomIds, electricalId, res) => {
  try {
    for (const roomId of roomIds) {
      await roomsModel.findByIdAndUpdate({ _id: roomId }, {
        electricID: electricalId
      }, { new: true })
    }

    res.status(200).json({
      success: true,
      message: "Electrical price updated successfully"
    })
    
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
}

// TODO: เพ่ิมหน่วย unit เข้าไปเพื่อทำให้การเรียกใช้งานง่ายขึ้น
const createWaterPrice = async(value, dormitory) => {
  const dormitoryId = await dormitoryModel.findById({ _id: dormitory._id})
  for (const name of value) {
    await waterModel.create({
      name: name,
      dormitoryId: dormitoryId,
    })
  }

  return null
}

const createElectricalPrice = async(value, dormitory) => {
  const dormitoryId = await dormitoryModel.findById({ _id: dormitory._id})
  for (const name of value) {
    await electricalModel.create({
      name: name,
      dormitoryId: dormitoryId,
    })
  }

  return null
}

// get all rooms 
const GetAllRooms = async (dormitory, res) => {
  try {
    // ให้ใช้ findOne และ populate เพื่อดึงข้อมูล dormitory
    const dormitoryDetail = await dormitoryModel.findOne({ _id: dormitory._id })
    .populate({
      path: "floors",
      populate: {
        path: "rooms",
        populate: [
          { path: "waterID" },
          { path: "electricID" },
          { path: "status" },
        ]
      },
    });

    if (!dormitoryDetail) {
      return res.status(404).json({
        success: false,
        message: "Dormitory not found",
      });
    }

    // ส่ง response ทั้งหมดไปยัง client
    res.status(200).json({
      success: true,
      message: "Get all rooms successfully",
      dormitoryDetail,
    });

  } catch (error) {
    // ในกรณี error คุณไม่ได้ระบุ `next` ใน parameter ฟังก์ชัน
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const GroupMeters = async (dormitoryId, res) => {
  try {
    const [waterMeter, electricalMeter] = await Promise.all([
      getWaterMeter(dormitoryId),
      getElectricalMeter(dormitoryId)
    ]);

    const meters = {
      waterMeter,
      electricalMeter
    }

    if (waterMeter.length > 0 && electricalMeter.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Get all meters successfully",
        meters,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Meters not found",
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const getWaterMeter = async (dormitoryId) => {
  const waterMeter = await waterModel.find({ dormitoryId: dormitoryId.id }).exec();
  return waterMeter;
}

const getElectricalMeter = (dormitoryId) => {
  const electricalMeter = electricalModel.find({ dormitoryId: dormitoryId.id }).exec()
  return electricalMeter
}

// TODO: อัพเดตค่าน้ำค่าไฟ
const UpdateElectrical = async (id, price, res) => {
  try {
    await electricalModel.findOneAndUpdate({ _id: id }, { price: price }, { new: true })
    return res.status(200).json({
      success: true,
      message: "Update meter successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const UpdateWater = async (id, price, res) => {
  try {
    await waterModel.findOneAndUpdate({ _id: id }, { price: price }, { new: true })
    return res.status(200).json({
      success: true,
      message: "Update meter successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// TODO: สร้างบัญชีธนาคาร
const CreateBankAccount = async (dormitoryId, name, accountNumber, bankName, res) => {
  try {
    const newBank = await bankModel.create({
      dormitoryId: dormitoryId,
      name: name,
      account: accountNumber,
      bank: bankName
    });

    await dormitoryModel.findOneAndUpdate({ _id: dormitoryId }, { $push: { banks: newBank._id } }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Create bank account successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const DeleteBankAccount = async (dormitoryId, bankId, res) => {
  try {
    const bank = await bankModel.findOneAndDelete({ _id: bankId });
    await dormitoryModel.findOneAndUpdate({ _id: dormitoryId }, { $pull: { banks: bank._id } }, { new: true });
    return res.status(200).json({
      success: true,
      message: "Delete bank account successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

const GetDormitoryByUser = async (id, res) => {
  try {
    const dormitory = await dormitoryModel
      .find({ userID: id })
      .populate({
        path: "floors",
        populate: {
          path: "rooms",
          populate: [{ path: "waterID" }, { path: "electricID" }, { path: "status" }],
        },
      })
      .populate({ path: "banks" });
    return res.status(200).json({
      success: true,
      message: "Get dormitory successfully",
      dormitory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { DormitoryCreate, createWaterPrice, createElectricalPrice, Addfloor, Addrooms, InCreaseFloors, 
  IncreaseRoom, DeleteRoom, DeleteFloor, UpdatePriceForRoom, UpdateWaterPrice, UpdateElectricalPrice, GetAllRooms, GroupMeters, UpdateElectrical, UpdateWater, CreateBankAccount, DeleteBankAccount, GetDormitoryByUser };
