import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminMessages from "./pages/AdminMessages";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Notification />

        <Routes>
          <Route
            path="/"
            element={
              <CustomerLayout>
                <Home />
              </CustomerLayout>
            }
          />

          <Route
            path="/products"
            element={
              <CustomerLayout>
                <Products />
              </CustomerLayout>
            }
          />

          <Route
            path="/products/:id"
            element={
              <CustomerLayout>
                <ProductDetails />
              </CustomerLayout>
            }
          />

          <Route
            path="/categories"
            element={
              <CustomerLayout>
                <Categories />
              </CustomerLayout>
            }
          />

          <Route
            path="/about"
            element={
              <CustomerLayout>
                <About />
              </CustomerLayout>
            }
          />

          <Route
            path="/cart"
            element={
              <CustomerLayout>
                <Cart />
              </CustomerLayout>
            }
          />

          <Route
            path="/login"
            element={
              <CustomerLayout>
                <Login />
              </CustomerLayout>
            }
          />

          <Route
            path="/register"
            element={
              <CustomerLayout>
                <Register />
              </CustomerLayout>
            }
          />

          <Route
            path="/orders"
            element={
              <CustomerLayout>
                <Orders />
              </CustomerLayout>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <CustomerLayout>
                <OrderDetails />
              </CustomerLayout>
            }
          />

          <Route
            path="/contact"
            element={
              <CustomerLayout>
                <Contact />
              </CustomerLayout>
            }
          />

          <Route
            path="/checkout"
            element={
              <CustomerLayout>
                <Checkout />
              </CustomerLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <CustomerLayout>
                <Profile />
              </CustomerLayout>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminCategories />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                {" "}
                <AdminLayout>
                  {" "}
                  <AdminOrders />{" "}
                </AdminLayout>{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <AdminRoute>
                {" "}
                <AdminLayout>
                  {" "}
                  <AdminMessages />{" "}
                </AdminLayout>{" "}
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                {" "}
                <AdminLayout>
                  {" "}
                  <AdminCustomers />{" "}
                </AdminLayout>{" "}
              </AdminRoute>
            }
          />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
