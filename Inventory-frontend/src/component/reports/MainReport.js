import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import SideBar from "../SideBar";
import NavBar from "../NavBar";
import { useNavigate } from "react-router-dom";

const MainReport = () => {
  const navigation = useNavigate();
  const [navClick, setNavClick] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [side, setSide] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
    };
    fetchData();
  }, []);

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

            <div className="contain">
              <div className="row-div">
                <div className=" mt-4 card-items">
                  <div className="card-heading">
                    <h5>INVENTORY</h5>
                  </div>
                  <div className="report-card">
                    <a onClick={() => navigation("/reports/stockreport")}>
                      Stock Summary Report
                    </a>
                  </div>
                  <hr />
                  <div className="report-card">
                    <a>Low Stock Report</a>
                  </div>
                  <hr />
                </div>

                <div className=" mt-4 card-items">
                  <div className="card-heading">
                    <h5>SALES</h5>
                  </div>
                  <div className="report-card">
                    <a onClick={() => navigation("/reports/salesreport")}>
                      Sales Summary Report
                    </a>
                  </div>
                  <hr />
                </div>

                <div className=" mt-4 card-items">
                  <div className="card-heading">
                    <h5>EXPENSE</h5>
                  </div>
                  <div className="report-card">
                    <a>Expense Summary Report</a>
                  </div>
                  <hr />
                </div>

                <div className=" mt-4 card-items">
                  <div className="card-heading">
                    <h5>FINANCIAL</h5>
                  </div>
                  <div className="report-card">
                    <a>Cash In Hand Summary Report</a>
                  </div>
                  <hr />
                  <div className="report-card">
                    <a>Amount Payable Report</a>
                  </div>
                  <hr />
                  <div className="report-card">
                    <a>Amount Recievable Report</a>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainReport;
