import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProductIndex from "../views/product/ProductIndex";
import DetailIndex from "../views/product/DetailIndex";
import AuthComponent from "../components/AuthComponent";
import CustomerBrowser from "../views/customer/CustomerBrowser";
import OrderIndex from "../views/order/OrderIndex";
import OrderForm from "../views/order/OrderForm";
import PaymentBrowser from "../views/payment/PaymentBrowser";
import InvoiceBrowser from "../views/invoice/InvoiceBrowser";
import AccountantForm from "../views/accountant/AccountantForm";
import AdminProducts from "../views/admin/AdminProducts";
import AdminOrders from "../views/admin/AdminOrders";
import AdminCustomers from "../views/admin/AdminCustomers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ProductIndex />,
      },
      {
        path: "/product/:id",
        element: <DetailIndex />,
      },
      {
        path: "/order",
        element: <OrderIndex />,
      },
      {
        path: "/order2",
        element: <OrderForm />,
      },
      {
        path: "/auth",
        element: <AuthComponent />,
      },
      {
        path: "/customer",
        element: <CustomerBrowser />,
      },
      {
        path: "/payment",
        element: <PaymentBrowser />,
      },
      {
        path: "/invoice/:invoiceId",
        element: <InvoiceBrowser />,
      },
      {
        path: "/payments",
        element: <PaymentBrowser />,
      },
      {
        path: "/orders/:id",
        element: <AccountantForm />,
      },
      // Admin routes
      {
        path: "/admin/products",
        element: <AdminProducts />,
      },
      {
        path: "/admin/orders",
        element: <AdminOrders />,
      },
      {
        path: "/admin/customers",
        element: <AdminCustomers />,
      },
    ],
  },
]);

export default router;
