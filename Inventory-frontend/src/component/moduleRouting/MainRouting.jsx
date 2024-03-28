import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Signin from "../authentication/Signin";
import PinLogin from "../authentication/PinLogin";
import Mpin from "../authentication/Mpin";
import Dashboard from "../dashboard/Dashboard";
import BuyersSuppliers from "../buyersSuppliers/BuyersSuppliers";
import ShoesItem from "../inventory/ShoesItem";
import ClothingItem from "../inventory/ClothingItem";
import AccessoriesItem from "../inventory/AccessoriesItem";
import Categories from "../inventory/Categories";
import ItemsList from "../inventory/ItemsList";
import CreateCompany from "../authentication/CreateCompany";
import QuatationOrder from "../purchase/QuatationOrder";
import Quotation from "../purchase/Quotation";
import QuotationTable from "../purchase/QuotationTable";
import SalesForm from "../sales/SalesForm";
import Transactions from "../payment/Transactions";
import SalesTable from "../sales/SalesTable";
import Expense from "../accounts/Expense";
import Cash from "../accounts/Cash";
import Invoice from "../sales/Invoice";
import StockReport from "../reports/StockReport";
import MainReport from "../reports/MainReport";
import SalesReport from "../reports/SalesReport";
import Messaging from "../messaging/Messaging";
import Bill from "../messaging/Bill";

const MainRouting = () => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [side, setSide] = useState(false);
  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <Routes>
      <Route path="/" element={<Signin onLogin={handleLogin} />} />

      <Route
        path="/dashboard"
        element={loggedIn ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/bills/:id"
        element={loggedIn ? <Bill /> : <Navigate to="/" />}
      />
      <Route
        path="/set-mpin"
        element={loggedIn ? <Mpin /> : <Navigate to="/" />}
      />
      <Route
        path="/mpin"
        element={loggedIn ? <PinLogin /> : <Navigate to="/" />}
      />
      <Route
        path="/createcompany"
        element={loggedIn ? <CreateCompany /> : <Navigate to="/" />}
      />
      <Route
        path="/buyers-suppliers"
        element={loggedIn ? <BuyersSuppliers /> : <Navigate to="/" />}
      />
      <Route
        path="/inventory/categories"
        element={loggedIn ? <Categories /> : <Navigate to="/" />}
      />
      <Route
        path="/inventory/items-list/:id"
        element={loggedIn ? <ItemsList /> : <Navigate to="/" />}
      />
      <Route
        path="/inventory/shoes"
        element={loggedIn ? <ShoesItem /> : <Navigate to="/" />}
      />
      <Route
        path="/inventory/clothing"
        element={loggedIn ? <ClothingItem /> : <Navigate to="/" />}
      />
      <Route
        path="/inventory/accessories"
        element={loggedIn ? <AccessoriesItem /> : <Navigate to="/" />}
      />
      <Route
        path="/quotation/quotation-order"
        element={loggedIn ? <QuatationOrder /> : <Navigate to="/" />}
      />
      <Route
        path="/quotation"
        element={loggedIn ? <Quotation /> : <Navigate to="/" />}
      />
      <Route
        path="/sales/sales-order"
        element={loggedIn ? <SalesForm /> : <Navigate to="/" />}
      />
      <Route
        path="/sales/invoice"
        element={loggedIn ? <Invoice /> : <Navigate to="/" />}
      />
      <Route
        path="/payment/transactions"
        element={loggedIn ? <Transactions /> : <Navigate to="/" />}
      />
      <Route
        path="/sales/list"
        element={loggedIn ? <SalesTable /> : <Navigate to="/" />}
      />
      <Route path="/accounts/cash-on-hand" element={<Cash />} />
      <Route path="/accounts/expense" element={<Expense />} />
      <Route
        path="/quotation/list"
        element={loggedIn ? <QuotationTable /> : <Navigate to="/" />}
      />
      <Route
        path="/reports/stock-report"
        element={loggedIn ? <StockReport /> : <Navigate to="/" />}
      />
      <Route
        path="/reports/sales-report"
        element={loggedIn ? <SalesReport /> : <Navigate to="/" />}
      />
      <Route
        path="/reports/main-report"
        element={loggedIn ? <MainReport /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default MainRouting;
