import React, { useEffect, useState } from "react";
import "./home1.css"; // Tạo file CSS dựa trên phần style bạn cung cấp
import { useLocation } from "react-router-dom";

const SeatLayout = ({ rows, cols, hiddenSeats, charCols, onSeatSelect }) => {
  const [seatData, setSeatData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchSeatData = () => {
      const showtime = 2; // Thay bằng giá trị `showtime` mong muốn

      fetch(
        `https://seat-booking.azurewebsites.net/api/Seat?showtime=${showtime}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch seat data");
          }
          return response.json();
        })
        .then((result) => {
          const seatArray = result.data || []; // Trích xuất mảng dữ liệu ghế
          setSeatData(seatArray); // Cập nhật state
        })
        .catch((error) => {
          console.error("Error fetching seat data:", error);
        });
    };

    // Gọi hàm fetch dữ liệu ngay lập tức
    fetchSeatData();

    // Thiết lập setInterval để fetch lại dữ liệu mỗi 5 giây
    const intervalId = setInterval(fetchSeatData, 5000); // 5000ms = 5 giây

    // Cleanup khi component bị unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSeatClick = (rowChar, col, color) => {
    const seat = seatData.find(
      (s) => s.rowChar === rowChar && s.colNumber === col
    );
    const seatInfo = `${rowChar} - ${col} - ${color}`;
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatInfo)) {
        return prevSeats.filter((seat) => seat !== seatInfo); // Remove if already selected
      }
      return [...prevSeats, seatInfo]; // Add if not selected
    });
    if (seat) {
      const seatId = seat.id; // Lấy `id` ghế
      onSeatSelect(seatId, rowChar, col, color, ""); // Gửi `seatId` thay vì thông tin chuỗi
    }
  };

  const renderSeatLayout = () => {
    const layout = [];

    for (let row = 1; row <= rows; row++) {
      const rowChar = String.fromCharCode(64 + row);

      for (let col = 1; col <= cols; col++) {
        let className = "seat";
        let content = "";
        let color = "";
        let isHidden = false;
        let isBooked = false;
        let studentName = null;

        if (hiddenSeats[rowChar]?.includes(col)) {
          isHidden = true;
        }

        const seat = Array.isArray(seatData)
          ? seatData.find((s) => s.rowChar === rowChar && s.colNumber === col)
          : null;

        if (seat) {
          color = seat.seatColor?.color || "";
          isBooked = seat.isBooked;
          studentName = seat.studentName; // Lấy thông tin StudentName
        }

        if (charCols.includes(col)) {
          className += " char";
          content = rowChar;
          color = "";
        } else {
          content = isHidden ? "" : studentName || col; // Hiển thị StudentName nếu tồn tại
        }

        const seatInfo = `${rowChar} - ${col} - ${color}`;
        if (selectedSeats.includes(seatInfo)) {
          content = "X";
          className += " x-mark";
        }
        const seatStyle = color
          ? {
              backgroundColor:
                color === "red"
                  ? "red"
                  : color === "yellow"
                  ? "#f5a003"
                  : color,
            }
          : {};

        if (!isHidden) {
          layout.push(
            <div
              key={`${row}-${col}`}
              className={className}
              style={seatStyle}
              onClick={
                charCols.includes(col) || isBooked
                  ? null
                  : () => handleSeatClick(rowChar, col, color)
              }
            >
              {content}
            </div>
          );
        } else {
          layout.push(<div key={`${row}-${col}`} className="seat empty"></div>);
        }
      }
    }

    return layout;
  };

  return <div className="seat-layout">{renderSeatLayout()}</div>;
};
const BottomLayout = ({
  rows,
  cols,
  hiddenSeats,
  charCols,
  selectedSeats,
  onSeatSelect,
}) => {
  const [seatsData, setSeatsData] = useState([]); // State chứa dữ liệu ghế từ API

  // Gọi API để lấy dữ liệu ghế
  useEffect(() => {
    const fetchSeatData = () => {
      const showtime = 2; // Thay bằng giá trị `showtime` mong muốn

      fetch(
        `https://seat-booking.azurewebsites.net/api/Seat?showtime=${showtime}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch seat data");
          }
          return response.json();
        })
        .then((result) => {
          const seatArray = result.data || []; // Trích xuất mảng dữ liệu ghế
          const filteredSeats = seatArray.filter((seat) => seat.floor === "2");
          setSeatsData(filteredSeats); // Cập nhật state
        })
        .catch((error) => {
          console.error("Error fetching seat data:", error);
        });
    };

    // Gọi hàm fetch dữ liệu ngay lập tức
    fetchSeatData();

    // Lặp lại gọi API mỗi 5 giây
    const intervalId = setInterval(fetchSeatData, 5000); // 5000ms = 5s

    // Cleanup khi component bị unmount
    return () => clearInterval(intervalId);
  }, []); // Chỉ gọi API khi component được render lần đầu

  // Xử lý khi người dùng click vào ghế
  const handleBottomSeatClick = (rowChar, col, color) => {
    const seat = seatsData.find(
      (s) => s.rowChar === rowChar && s.colNumber === col
    );
    if (seat) {
      const seatId = seat.id; // Lấy `id` ghế
      onSeatSelect(seatId, rowChar, col, color, "Trên Lầu"); // Gửi `seatId` thay vì thông tin chuỗi
    }
  };

  // Render layout ghế dưới
  const renderBottomLayout = () => {
    const layout = [];

    for (let row = 1; row <= rows; row++) {
      const rowChar = String.fromCharCode(64 + row);
      for (let col = 1; col <= cols; col++) {
        let className = "seat";
        let content = "";
        let color = "";
        let isBooked = false;
        let isHidden = false;
        let studentName = null;
        if (hiddenSeats[rowChar]?.includes(col)) {
          isHidden = true;
        }

        // Tìm ghế trong dữ liệu từ API
        const seat = Array.isArray(seatsData)
          ? seatsData.find((s) => s.rowChar === rowChar && s.colNumber === col)
          : null;

        if (seat) {
          // Nếu ghế có dữ liệu, xác định trạng thái đã đặt và màu sắc
          isBooked = seat.isBooked;
          color = seat.seatColor?.color || "";
          studentName = seat.studentName;
        }
        if (charCols.includes(col)) {
          className += " char";
          content = rowChar;
          color = "";
        } else {
          content = isHidden ? "" : studentName || col;
        }
        const seatInfo = { rowChar, col, color };
        const isSelected = selectedSeats.some(
          (seat) =>
            seat.rowChar === rowChar && seat.col === col && seat.color === color
        );

        if (isSelected) {
          content = "X";
          className += " x-mark"; // Đánh dấu ghế đã chọn
        }

        // Xử lý màu sắc ghế
        const seatStyle = color
          ? {
              backgroundColor: color === "pink" ? "#eb0578" : color,
            }
          : {};
        // Thêm sự kiện click cho các ghế chưa được đặt và không phải là ký tự
        const handleClick =
          charCols.includes(col) || isBooked
            ? null
            : () => handleBottomSeatClick(rowChar, col, color);

        if (!isHidden) {
          layout.push(
            <div
              key={`${row}-${col}`}
              className={className}
              style={seatStyle}
              onClick={handleClick}
            >
              {content}
            </div>
          );
        } else {
          layout.push(<div key={`${row}-${col}`} className="seat empty"></div>);
        }
      }
    }

    return layout;
  };

  return (
    <div>
      <div style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
        <input
          type="text"
          value="Phía Trên Lầu"
          readOnly
          style={{
            padding: "10px",
            fontSize: "16px",
            textAlign: "center",
            width: "auto",
            backgroundColor: "#d3d3d3",
            color: "black",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div className="bottom-layout">{renderBottomLayout()}</div>
    </div>
  );
};

const seatPrices = {
  red: 300000,
  yellow: 250000,
  blue: 200000,
  pink: 150000,
};
const colorNamesInVietnamese = {
  red: " Ghế Đỏ",
  yellow: "Ghế Vàng",
  blue: "Ghế Xanh",
  pink: "Ghế Hồng",
};
const Home1 = () => {
  const hiddenSeats = {
    A: [19, 20, 21, 22],
    B: [17, 19, 20, 21, 22],
    D: [17],
    F: [17],
    H: [17],
    J: [17],
    L: [17],
    N: [1, 2, 3, 4, 17, 19, 20, 21, 22],
  };

  const bottomLayoutProps = {
    rows: 10,
    cols: 23,
    hiddenSeats: {
      H: [7, 14, 23],
      D: [14],
      F: [14],
      B: [14],
      J: [9, 10, 11, 12, 13, 14],
    },
    charCols: [8, 15],
  };
  const location = useLocation();
  const { role } = location.state || {};
  console.log(role);
  //localStorage.setItem("role", "admin");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const handleSeatSelect = (seatId, rowChar, col, color, floor) => {
    const seatInfo = { seatId, rowChar, col, color, floor };

    setSelectedSeats((prevSeats) => {
      const isSelected = prevSeats.some((seat) => seat.seatId === seatId);

      if (isSelected) {
        // Nếu ghế đã được chọn, bỏ chọn
        return prevSeats.filter((seat) => seat.seatId !== seatId);
      }

      // Nếu chưa chọn, thêm ghế vào danh sách
      return [...prevSeats, seatInfo];
    });
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      // Lấy giá tiền theo màu sắc của ghế
      const price = seatPrices[seat.color] || 0;
      return total + price;
    }, 0);
  };
  const [isModalOpen, setIsModalOpen] = useState(false); // State để điều khiển modal
  const [studentName, setStudentName] = useState(""); // State cho tên học viên
  const [selectedBranch, setSelectedBranch] = useState(""); // State cho chi nhánh
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice()); // Tổng tiền

  // Danh sách các chi nhánh trung tâm (có thể lấy từ API hoặc hardcoded)
  const branches = ["Quận Phú Nhuận", "Quận 3", "Quận 10", "Quận Tân Bình"];

  const handlePaymentClick = () => {
    setIsModalOpen(true); // Mở modal khi nhấn thanh toán
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Xử lý thanh toán hoặc gửi dữ liệu
    console.log("Thanh toán thành công!", {
      studentName,
      selectedBranch,
      totalPrice,
    });
    handleCloseModal(); // Đóng modal sau khi thanh toán
  };
  const handleConfirmPayment = () => {
    // Lấy danh sách `seatId` của các ghế đã chọn
    const selectedSeatIds = selectedSeats.map((seat) => seat.seatId);

    // Tính tổng tiền
    const totalAmount = calculateTotalPrice();

    // Tạo đối tượng dữ liệu cần gửi
    const paymentData = {
      seats: selectedSeatIds, // Danh sách `seatId` của các ghế đã chọn
      totalAmount: totalAmount,
      studentName: studentName, // Tên học viên
      selectedBranch: selectedBranch,
      bookingShow: 2,
      // Tổng tiền
    };
    if (role === "admin") {
      paymentData.isCash = true;
      console.log("isCash đã được thêm vào paymentData:", paymentData); // Thêm isCash vào paymentData nếu là admin
    } else {
      paymentData.isCash = false;
    }
    console.log(paymentData);
    //const role = localStorage.getItem("role"); // Hoặc lấy từ state/context nếu bạn lưu trong đó

    // Gửi dữ liệu qua API
    fetch("https://seat-booking.azurewebsites.net/api/payos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Thanh toán thất bại!");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Thanh toán thành công!", result);
        // Thực hiện hành động sau khi thanh toán thành công, ví dụ: đóng modal, thông báo thành công...
        // Redirect to the returned URL
        if (
          role === undefined ||
          role === null ||
          role === "" ||
          role === "undefined"
        ) {
          window.location.href = result.url; // Redirect to the URL
        } else {
          // Nếu là admin, chỉ đóng modal và thông báo thành công
          setIsModalOpen(false); // Đóng modal
          alert("Thanh toán thành công!");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thanh toán:", error);
      });
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: 20,
      }}
    >
      <div className="showw">Sân khấu 2</div>

      <div className="main-container">
        <div className="seat-layout-wrapper">
          <SeatLayout
            rows={14}
            cols={22}
            hiddenSeats={hiddenSeats}
            charCols={[5, 18]}
            onSeatSelect={handleSeatSelect}
          />
        </div>

        <div className="bottom-layout-wrapper">
          <BottomLayout
            {...bottomLayoutProps}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
        </div>
        <div className="price-container-wrapper">
          <div className="layout-wrapper">
            <div className="price-container">
              <div className="price-item">
                Giá ghế ĐỎ <span className="color-box red"></span>: 300.000 VND
              </div>
              <div className="price-item">
                Giá ghế VÀNG <span className="color-box yellow"></span>: 250.000
                VND
              </div>
              <div className="price-item">
                Giá ghế XANH <span className="color-box blue"></span>: 200.000
                VND
              </div>
              <div className="price-item">
                Giá ghế Hồng <span className="color-box pink"></span>: 150.000
                VND
              </div>
            </div>
          </div>
          <div className="selected-seats">
            <h3>Ghế đã chọn:</h3>
            {selectedSeats.length === 0 ? (
              <p>Chưa có ghế nào được chọn</p>
            ) : (
              <ul style={{ fontSize: "18px", paddingLeft: "20px" }}>
                {selectedSeats.map((seat) => {
                  return (
                    <li key={seat.seatId} style={{ marginBottom: "10px" }}>
                      {`${seat.rowChar} - ${seat.col} - `}
                      <span>{colorNamesInVietnamese[seat.color]}</span>
                      {seat.floor && <span> - {seat.floor}</span>}
                      <span>
                        {" "}
                        - {seatPrices[seat.color].toLocaleString()} VND
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div
              className="total-price"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "10px",
                color: "#333",
              }}
            >
              Tổng tiền: {calculateTotalPrice().toLocaleString()} VND
            </div>
            <div className="payment-btn-wrapper" style={{ marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "30%",
                }}
                onClick={handlePaymentClick}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thông tin thanh toán</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Tên Học Viên:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Nhập tên học viên"
                  required
                />
              </div>
              <div className="form-group">
                <label>Đang Học Tại Trung Tâm</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                >
                  <option value="">Chọn chi nhánh</option>
                  {branches.map((branch, index) => (
                    <option key={index} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tổng số tiền:</label>
                <input
                  type="text"
                  value={calculateTotalPrice().toLocaleString()}
                  readOnly
                />
              </div>
              <div className="modal-actions">
                <button type="submit" onClick={handleConfirmPayment}>
                  Xác nhận thanh toán
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="cancel"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home1;
