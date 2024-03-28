import React, { useState, useEffect } from "react";
import dashboard from "../../src/assets/icon/dashboard 1.png";
import inventory from "../assets/icon/inventory (2) 1.png";
import cart from "../assets/icon/cart.png";
import discount from "../assets/icon/discount (1).png";
import parcel from "../assets/icon/parcel.png";
import credit from "../assets/icon/credit-card.png";
import report from "../assets/icon/report (3) 1.png";
import setting from "../assets/icon/setting (1).png";
import { MdDashboard, MdEvent } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import logo from '../assets/logo.png'

const SideBar = ({side, navClick}) => {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [quotationOpen, setQuotationOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const navigation = useNavigate();

  const toggleInventory = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const toggleQuotation = () => {
    setQuotationOpen(!quotationOpen);
  };

  const toggleSales = () => {
    setSalesOpen(!salesOpen);
  };

  const toggleAccount = () => {
    setAccountOpen(!accountOpen);
  };
  const toggleReport = () => {
    setReportOpen(!reportOpen);
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <MdDashboard />,
    },
    {
      path: "/inventory",
      name: "Inventory",
      icon: <img src={inventory} alt="Inventory" />,
      isOpen: inventoryOpen,
      toggle: toggleInventory,
      submenu: [
        {
          path: "/inventory/categories",
          name: "Products",
        },
      ],
    },
  ];

  return (
    <div>
      <div
        className="sidebar p-2 py-md-3 @@cardClass"
        style={{left:window.innerWidth<1200?side?"":"-400px":side?"":"",borderRight: navClick?"2px solid #adb5bd":"", width: navClick?"85px":"", marginLeft: navClick?"-20px":"", overflowX:navClick?'hidden':"", overflowY:navClick?'hidden':"", marginTop:navClick?"-10px":"" }}
      >
        <div className="container-fluid">
          {/* sidebar: title*/}
          <div className="title-text d-flex align-items-center mb-4 mt-1">
            <h3 id="sidebar-h3-design" style={{marginTop:window.innerWidth<1200?side?"":"":side?"":""}}>
              {navClick?<img src={logo} height={60} alt="" />:<><span className="sm-txt">Insta-e-</span>
              <span>Mart </span></>}
            </h3>
          </div>

          {/* sidebar: menu list */}
          <div className="main-menu flex-grow-1">
            <ul className="menu-list">
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a
                  className="m-link active"
                  onClick={() => navigation("/dashboard")}
                >
                  <img src={dashboard} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">My Dashboard</span>
                </a>
              </li>
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a className="m-link" onClick={toggleInventory}>
                  <img src={inventory} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Inventory</span>
                  <span className="ms-auto text-end">
                    {inventoryOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </a>
                {/* Menu: Sub menu ul */}
                {inventoryOpen && (
                  <ul className="sub-menu collapse show" id="inventory">
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/inventory/categories")}
                      >
                        Products
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a className="m-link" onClick={toggleQuotation}>
                  <img src={cart} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Quotation</span>
                  <span className="ms-auto text-end">
                    {quotationOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </a>
                {/* Menu: Sub menu ul */}
                {quotationOpen && (
                  <ul className="sub-menu collapse show" id="quotation">
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/quotation/quotation-order")}
                      >
                        Quotation Order
                      </a>
                    </li>
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/quotation/list")}
                      >
                        Invoice
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a className="m-link" onClick={toggleSales}>
                  <img src={discount} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Sales</span>
                  <span className="ms-auto text-end">
                    {salesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </a>
                {/* Menu: Sub menu ul */}
                {salesOpen && (
                  <ul className="sub-menu collapse show" id="sales">
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/sales/sales-order")}
                      >
                        Sales Order
                      </a>
                    </li>
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/sales/list")}
                      >
                        Invoice
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a
                  className="m-link"
                  data-bs-toggle="collapse"
                  data-bs-target="#menu-Account"
                  onClick={() => navigation("/buyers-suppliers")}
                >
                  <img src={parcel} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Buyers & Suppliers</span>
                </a>
                {/* Menu: Sub menu ul */}
              </li>
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a
                  className="m-link"
                  data-bs-toggle="collapse"
                  data-bs-target="#menu-Authentication"
                  onClick={() => navigation("/payment/transactions")}
                >
                  <img src={credit} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Payments</span>
                </a>
                {/* Menu: Sub menu ul */}
              </li>
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a className="m-link" onClick={toggleReport}>
                  <img src={parcel} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Reports</span>
                  <span className="ms-auto text-end">
                    {reportOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </a>
                {/* Menu: Sub menu ul */}
                {reportOpen && (
                  <ul className="sub-menu collapse show" id="account">
                    {/* <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/reports/main-report")}
                      >
                        Main Report
                      </a>
                    </li> */}
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/reports/sales-report")}
                      >
                        Sales Report
                      </a>
                    </li>
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/reports/stock-report")}
                      >
                        Stock Report
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="collapsed" style={{ cursor: "pointer" }}>
                <a className="m-link" onClick={toggleAccount}>
                  <img src={parcel} style={{height:navClick?"30px":"",paddingRight:navClick?"20px":""}}/>
                  <span className="ms-2">Account</span>
                  <span className="ms-auto text-end">
                    {accountOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </a>
                {/* Menu: Sub menu ul */}
                {accountOpen && (
                  <ul className="sub-menu collapse show" id="account">
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/accounts/cash-on-hand")}
                      >
                        Cash On Hand
                      </a>
                    </li>
                    <li>
                      <a
                        className="ms-link"
                        onClick={() => navigation("/accounts/expense")}
                      >
                        Expense
                      </a>
                    </li>
                    <li className="collapsed" style={{ cursor: "pointer" }}>
                      <a
                        className="m-link"
                        data-bs-toggle="collapse"
                        data-bs-target="#menu-Authentication"
                        onClick={() => navigation("/sendBill")}
                      >
                        <img src={credit} />
                        <span className="ms-2">Bill</span>
                      </a>
                      {/* Menu: Sub menu ul */}
                    </li>
                  </ul>
                )}
              </li>
              {/* Other menu items */}
            </ul>
          </div>
          {/* sidebar: footer link */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;

// import React, { useState } from "react";
// import dashboard from "../../src/assets/icon/dashboard 1.png";
// import inventory from "../assets/icon/inventory (2) 1.png";
// import cart from "../assets/icon/cart.png";
// import discount from "../assets/icon/discount (1).png";
// import parcel from "../assets/icon/parcel.png";
// import credit from "../assets/icon/credit-card.png";
// import report from "../assets/icon/report (3) 1.png";
// import setting from "../assets/icon/setting (1).png";
// import { MdDashboard, MdEvent } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
// import MenuIcon from "@mui/icons-material/Menu";
// import Quotation from "./purchase/Quotation";

// const SideBar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [inventoryOpen, setInventoryOpen] = useState(false);
//   const [quotationOpen, setQuotationOpen] = useState(false);
//   const [salesOpen, setSalesOpen] = useState(false);
//   const [accountOpen, setAccountOpen] = useState(false);
//   const [reportOpen, setReportOpen] = useState(false);

//   const navigation = useNavigate();

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const toggleInventory = () => {
//     setInventoryOpen(!inventoryOpen);
//   };

//   const toggleQuotation = () => {
//     setQuotationOpen(!quotationOpen);
//   };

//   const toggleSales = () => {
//     setSalesOpen(!salesOpen);
//   };

//   const toggleAccount = () => {
//     setAccountOpen(!accountOpen);
//   };
//   const toggleReport = () => {
//     setReportOpen(!reportOpen);
//   };

//   const menuItems = [
//     {
//       path: "/dashboard",
//       name: "Dashboard",
//       icon: <img src={dashboard} alt="Inventory" />,
//       isOpen: inventoryOpen,
//       toggle: toggleInventory,
//     },
//     {
//       path: "/inventory",
//       name: "Inventory",
//       icon: <img src={inventory} alt="Inventory" />,
//       isOpen: inventoryOpen,
//       toggle: toggleInventory,
//       submenu: [
//         {
//           path: "/inventory/categories",
//           name: "Products",
//         },
//       ],
//     },
//     {
//       path: "/quotation",
//       name: "Quotation",
//       icon: <img src={cart} alt="Quotation" />,
//       isOpen: quotationOpen,
//       toggle: toggleQuotation,
//       submenu: [
//         {
//           path: "/quotation/quotation-order",
//           name: " Quotation Order",
//         },
//         {
//           path: "/quotation/list",
//           name: " Invoice",
//         },
//       ],
//     },

//     {
//       path: "/buyers-suppliers",
//       name: "Buyers & Suppliers",
//       icon: <img src={parcel} alt="Buyers" />,
//       isOpen: salesOpen,
//       toggle: toggleSales,
//       submenu: [
//         {
//           path: "/buyers-suppliers",
//           name: " Buyers & Suppliers Details",
//         },
//       ],
//     },

//     {
//       path: "/payment",
//       name: "Payment",
//       icon: <img src={credit} alt="credit" />,
//       isOpen: salesOpen,
//       toggle: toggleSales,
//       submenu: [
//         {
//           path: "/payment/transactions",
//           name: " Transactions",
//         },
//       ],
//     },

//     {
//       path: "/sales",
//       name: "Sales",
//       icon: <img src={discount} alt="Sales" />,
//       isOpen: salesOpen,
//       toggle: toggleSales,
//       submenu: [
//         {
//           path: "/sales/sales-order",
//           name: " Sales Order",
//         },
//         {
//           path: "/sales/list",
//           name: " Invoice",
//         },
//       ],
//     },

//     {
//       path: "/reports`",
//       name: "Reports",
//       icon: <img src={report} alt="Sales" />,
//       isOpen: reportOpen,
//       toggle: toggleReport,
//       submenu: [
//         {
//           path: "/reports/main-report",
//           name: "Main Report",
//         },
//         {
//           path: "/reports/sales-report",
//           name: "  Sales Report",
//         },
//         {
//           path: "/reports/stock-report",
//           name: " Stock Report",
//         },
//       ],
//     },
//     {
//       path: "/accounts`",
//       name: "Accounts",
//       icon: <img src={setting} alt="Sales" />,
//       isOpen: accountOpen,
//       toggle: toggleAccount,
//       submenu: [
//         {
//           path: "/accounts/cash-on-hand",
//           name: " Cash On Hand",
//         },
//         {
//           path: "/accounts/expense",
//           name: " Expense",
//         },
//       ],
//     },
//   ];

//   return (
//     <div>
//       <div
//         className={`sidebar p-2 py-md-3 ${isSidebarOpen ? "@@cardClass" : ""}`}
//       >
//         <div className="container-fluid">
//           {/* Toggle sidebar button */}
//           <MenuIcon onClick={toggleSidebar} />

//           {/* sidebar: title*/}
//           <div className="title-text d-flex align-items-center mb-4 mt-1">
//             <h3 id="sidebar-h3-design">
//               <span className="sm-txt">Insta-e-</span>
//               <span>Mart </span>
//             </h3>
//           </div>

//           {/* sidebar: menu list */}
//           <div
//             className="main-menu flex-grow-1"
//             style={{ display: isSidebarOpen ? "block" : "none" }}
//           >
//             <ul className="menu-list">
//               {/* Menu items */}
//               {menuItems.map((menuItem, index) => (
//                 <li
//                   key={index}
//                   className="collapsed"
//                   style={{ cursor: "pointer" }}
//                 >
//                   <a className="m-link" onClick={menuItem.toggle}>
//                     {menuItem.icon}
//                     <span className="ms-2">{menuItem.name}</span>
//                     <span className="ms-auto text-end">
//                       {menuItem.isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//                     </span>
//                   </a>
//                   {/* Menu: Sub menu ul */}
//                   {menuItem.isOpen && (
//                     <ul
//                       className="sub-menu collapse show"
//                       id={`submenu-${index}`}
//                     >
//                       {menuItem.submenu &&
//                         menuItem.submenu.map((subItem, subIndex) => (
//                           <li key={subIndex}>
//                             <a
//                               className="ms-link"
//                               onClick={() => navigation(subItem.path)}
//                             >
//                               {subItem.name}
//                             </a>
//                           </li>
//                         ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           {/* sidebar: footer link */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBar;
