import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import noDataImg from "../../assets/nodata.png";
import header from "../../assets/Header.png";
import footer from "../../assets/Footer.png";
import logo from "../../assets/logo.jpeg";
import * as XLSX from "xlsx";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const StockReport = () => {
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getStockData, setGetStockData] = useState([]);

  const navigation = useNavigate();

  useEffect(() => {
    const crossCheck = localStorage.getItem("cross");
    const expiryCheck = localStorage.getItem("expiryDate");
    if (!crossCheck) {
      if (expiryCheck) {
        navigation("/mpin");
      } else {
        navigation("/");
      }
    }
  }, []);

  const [currentBuyerPage, setcurrentBuyerPage] = useState(1);
  const itemsPerBuyerPage = 5;

  const indexOfLastBuyerItem = currentBuyerPage * itemsPerBuyerPage;
  const indexOfFirstBuyerItem = indexOfLastBuyerItem - itemsPerBuyerPage;
  const currentBuyerItems = getStockData.slice(
    indexOfFirstBuyerItem,
    indexOfLastBuyerItem
  );

  const totalBuyerPages = Math.ceil(getStockData.length / itemsPerBuyerPage);

  const nextBuyerPage = () => {
    setcurrentBuyerPage(currentBuyerPage + 1);
  };

  const prevBuyerPage = () => {
    setcurrentBuyerPage(currentBuyerPage - 1);
  };

  const getStockItem = async () => {
    const result = await axios.get("http://localhost:3500/inventory");
    if (result) {
      setIsLoading(false);
    }

    const ItemData = result.data;
    setGetStockData(ItemData);
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`http://localhost:3500/inventory/delete/${id}`)
      .then(() => {
        getStockItem();
        alert("Deleted Successfully");
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getStockItem();
  }, []);

  let doc;
  const convertToPdf = () => {
    try {
      doc = new jsPDF();
      const centerX = (doc.internal.pageSize.width - 80) / 2;
      doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 10);
      doc.addImage(
        footer,
        "PNG",
        0,
        doc.internal.pageSize.height - 35,
        doc.internal.pageSize.width,
        35
      );
      const logoUrl = logo;
      doc.addImage(logoUrl, "PNG", centerX, 15, 80, 15);
      const tableMargin = 20;
      const tableStartY = 15 + tableMargin;
      doc.autoTable({
        head: [
          [
            "Sl No",
            "ITEMS NAME",
            "HSN CODE",
            "SELLING PRICE",
            "PURCHASE PRICE",
            "STOCK STATUS",
            "OPENING STOCK",
            "STOCK PRICE",
          ],
        ],
        body: getStockData.map((row, index) => [
          index + 1,
          row.itemName,
          row.itemCode,
          row.salesPrice,
          row.purchasePrice,
          row.reorderPoint,
          row.openingStock,
          row.openingStockRate,
        ]),
        styles: { fontSize: 5, fontStyle: "normal" },
        headStyles: {
          fillColor: [206, 206, 206],
          textColor: [20, 25, 40],
          fontSize: 5,
          fontStyle: "bold",
          width: 20,
        },
        startY: tableStartY,
      });
      doc.save("stockreport.pdf");
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };
  const createPdf = () => {
    try {
      doc = new jsPDF();
      const centerX = (doc.internal.pageSize.width - 80) / 2;
      doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 10);
      doc.addImage(
        footer,
        "PNG",
        0,
        doc.internal.pageSize.height - 35,
        doc.internal.pageSize.width,
        35
      );
      const logoUrl = logo;
      doc.addImage(logoUrl, "PNG", centerX, 15, 80, 15);
      const tableMargin = 20;
      const tableStartY = 15 + tableMargin;
      doc.autoTable({
        head: [
          [
            "Sl No",
            "ITEMS NAME",
            "HSN CODE",
            "SELLING PRICE",
            "PURCHASE PRICE",
            "STOCK STATUS",
            "OPENING STOCK",
            "STOCK PRICE",
          ],
        ],
        body: getStockData.map((row, index) => [
          index + 1,
          row.itemName,
          row.itemCode,
          row.salesPrice,
          row.purchasePrice,
          row.reorderPoint,
          row.openingStock,
          row.openingStockRate,
        ]),
        styles: { fontSize: 5, fontStyle: "normal" },
        headStyles: {
          fillColor: [206, 206, 206],
          textColor: [20, 25, 40],
          fontSize: 5,
          fontStyle: "bold",
          width: 20,
        },
        startY: tableStartY,
      });
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };
  const convertToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(getStockData);

    ws["!cols"] = [
      { width: 20 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 25 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "StockReport.xlsx");
  };

  const handlePrint = () => {
    createPdf();
    const pdfContent = doc.output("bloburl");

    if (pdfContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
          <html>
            <head>
              <title>Print Document</title>
              <style>
              @media print {
                body {
                  margin: 0;
                }
                #pdfFrame {
                  width: 100%;
                  height: 100%;
                }
                @page {
                  size: landscape;
                }
              }
            </style>
            </head>
            <body>
              <iframe id="pdfFrame" src="${pdfContent}" width="100%" height="100%"></iframe>
              <script>
                document.getElementById('pdfFrame').onload = function() {
                  setTimeout(function() {
                    window.print();
                    window.onafterprint = function() {
                      window.close();
                    };
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Bars
            height="80"
            width="80"
            color="#40a1ed"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="layout-1">
          <SideBar navClick={navClick} side={side} />
          {/* start: body area */}
          <div className="wrapper">
            {/* start: page header */}
            <NavBar navClick={navClick} setNavClick={setNavClick} side={side} setSide={setSide} />
            {/* start: page toolbar */}

            <div className="main-div-2">
              <div className="table" id="main-table">
                <div className="input-group-1 expense-e">
                  <p>Stock Summary</p>

                  <div className="filter-container expense-e">
                    <button
                      type="button"
                      className="btn search-btn"
                      style={{
                        backgroundColor: "rgba(0, 172, 154, 1)",
                        color: "white",
                      }}
                      onClick={handlePrint}
                    >
                      Print
                    </button>
                    <button
                      type="button"
                      className="btn search-btn"
                      style={{
                        backgroundColor: "rgba(0, 172, 154, 1)",
                        color: "white",
                        marginLeft: "20px",
                      }}
                      onClick={convertToExcel}
                    >
                      Excel
                    </button>
                  </div>
                </div>
                {getStockData.length > 0 ? (
                  <div className="table-wrapper">
                    <table
                      className="table table-bordered"
                      style={{ height: "40vh" }}
                    >
                      <div id="table-responsive" className="table-responsive">
                        <table
                          id="table"
                          className="table table-hover table-striped text-nowrap table-vcenter mb-0"
                        >
                          <thead>
                            <tr>
                              <th>Sl No</th>
                              <th>ITEMS NAME</th>
                              <th>HSN CODE</th>
                              <th>SELLING PRICE</th>
                              <th>PURCHASE PRICE</th>
                              <th>STOCK STATUS</th>
                              <th>OPENING STOCK</th>
                              <th>STOCK PRICE</th>
                              <th>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentBuyerItems.map((item, index) => (
                              <tr key={index} style={{ cursor: "pointer" }}>
                                <td
                                  onClick={() =>
                                    navigation(
                                      `/inventory/items-list/${item._id}`
                                    )
                                  }
                                >
                                  {index + indexOfFirstBuyerItem + 1}
                                </td>
                                <td
                                  onClick={() =>
                                    navigation(
                                      `/inventory/items-list/${item._id}`
                                    )
                                  }
                                >
                                  {item.itemName}
                                </td>

                                <td
                                  onClick={() =>
                                    navigation(
                                      `/inventory/items-list/${item._id}`
                                    )
                                  }
                                >
                                  {item.itemCode}
                                </td>
                                <td>₹{item.salesPrice}</td>
                                <td>₹{item.purchasePrice}</td>
                                <td
                                  onClick={() =>
                                    navigation(
                                      `/inventory/items-list/${item._id}`
                                    )
                                  }
                                >
                                  <button
                                    className={
                                      item.reorderPoint > 15
                                        ? "button-status-green"
                                        : "button-status-red"
                                    }
                                    style={{
                                      width: "80px",
                                    }}
                                  >
                                    {item.reorderPoint > 15
                                      ? "In Stock"
                                      : "Low Stock"}
                                  </button>
                                </td>
                                <td
                                  onClick={() =>
                                    navigation(
                                      `/inventory/items-list/${item._id}`
                                    )
                                  }
                                >
                                  {item.openingStock} PCS
                                </td>
                                <td
                                  onClick={() =>
                                    navigation(
                                      `/inventory/items-list/${item._id}`
                                    )
                                  }
                                >
                                  ₹ {item.openingStockRate}
                                </td>
                                <div className="action-btn">
                                  <td>
                                    <FiEdit style={{ color: "#6F6F6F" }} />
                                  </td>
                                  <td onClick={() => handleDelete(item._id)}>
                                    <AiOutlineDelete style={{ color: "red" }} />
                                  </td>
                                </div>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </table>
                  </div>
                ) : (
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <img src={noDataImg} alt="no-data" />
                  </div>
                )}
              </div>
              <div>
                <button
                  className="buyer-page-btn"
                  onClick={prevBuyerPage}
                  disabled={currentBuyerPage === 1}
                >
                  Previous
                </button>
                <button
                  className="buyer-page-btn"
                  onClick={nextBuyerPage}
                  disabled={
                    currentBuyerPage === totalBuyerPages ||
                    totalBuyerPages === 0
                  }
                >
                  Next
                </button>
              </div>
              <div>
                Page {totalBuyerPages === 0 ? 0 : currentBuyerPage} of{" "}
                {totalBuyerPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReport;
