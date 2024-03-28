import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import noDataImg from "../../assets/nodata.png";
import header from "../../assets/Header.png";
import footer from "../../assets/Footer.png";
import logo from "../../assets/logo.jpeg";
import * as XLSX from "xlsx";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const SalesReport = () => {
  const navigation = useNavigate();
  const [navClick, setNavClick] = useState(false);
  const [side, setSide] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [getSalesData, setGetSalesData] = useState([]);

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

  const [currentSalesPage, setcurrentSalesPage] = useState(1);
  const itemsPerSalesPage = 5;

  const indexOfLastSalesItem = currentSalesPage * itemsPerSalesPage;
  const indexOfFirstSalesItem = indexOfLastSalesItem - itemsPerSalesPage;
  const currentSalesItems = getSalesData.slice(
    indexOfFirstSalesItem,
    indexOfLastSalesItem
  );

  const totalSalesPages = Math.ceil(getSalesData.length / itemsPerSalesPage);

  const nextSalesPage = () => {
    setcurrentSalesPage(currentSalesPage + 1);
  };

  const prevSalesPage = () => {
    setcurrentSalesPage(currentSalesPage - 1);
  };

  const getSalesInfo = async () => {
    const result = await axios.get("http://localhost:3500/sales");
    if (result) {
      setIsLoading(false);
    }
    const SalesData = result.data;
    setGetSalesData(SalesData);
  };

  useEffect(() => {
    getSalesInfo();
  }, []);
  let doc;

  const createPdf = () => {
    try {
      doc = new jsPDF();
      const centerX = (doc.internal.pageSize.width - 80) / 2;
      doc.addImage(header, "PNG", 0, 0 + 0, doc.internal.pageSize.width, 50);
      doc.addImage(
        footer,
        "PNG",
        0,
        doc.internal.pageSize.height - 35,
        doc.internal.pageSize.width,
        35
      );

      const tableMargin = 20;
      const tableStartY = 25 + tableMargin;
      doc.autoTable({
        head: [
          [
            "Sl No",
            "CUSTOMER",
            "MOBILE",
            "PAYMENT",
            "DISCOUNT",
            "TAX",
            "AMOUNT",
          ],
        ],
        body: getSalesData.map((row, index) => [
          index + 1,
          row.customerName,
          row.mobile,
          row.method,
          row.totalDiscount,
          row.totalGST,
          row.totalAmount,
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
    const ws = XLSX.utils.json_to_sheet(getSalesData);

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
    XLSX.writeFile(wb, "SalesReport.xlsx");
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
                  <p>Sales Summary</p>

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
                {getSalesData.length > 0 ? (
                  <div className="search-p expense-e">
                    <table
                      className="table table-bordered "
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
                              <th>CUSTOMER</th>
                              <th>MOBILE</th>
                              <th>PAYMENT</th>
                              <th>DISCOUNT</th>
                              <th>TAX</th>
                              <th>AMOUNT</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSalesItems.map((item, index) => (
                              <tr key={index} style={{ cursor: "pointer" }}>
                                <td>{index + indexOfFirstSalesItem + 1}</td>
                                <td>{item.customerName}</td>
                                <td>{item.mobile}</td>
                                <td>{item.method}</td>
                                <td>₹ {item.totalDiscount}</td>
                                <td>₹ {item.totalGST}</td>
                                <td>₹ {item.totalAmount}</td>
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
                  className="Sales-page-btn"
                  onClick={prevSalesPage}
                  disabled={currentSalesPage === 1}
                >
                  Previous
                </button>
                <button
                  className="Sales-page-btn"
                  onClick={nextSalesPage}
                  disabled={
                    currentSalesPage === totalSalesPages ||
                    totalSalesPages === 0
                  }
                >
                  Next
                </button>
              </div>
              <div>
                Page {totalSalesPages === 0 ? 0 : currentSalesPage} of{" "}
                {totalSalesPages}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
