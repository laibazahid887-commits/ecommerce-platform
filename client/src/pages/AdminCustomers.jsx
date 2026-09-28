import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminCustomers.css";
function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/users");
      const users = response.data.data || [];
      setCustomers(users.filter((user) => user.role === "customer"));
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchValue) ||
      customer.email?.toLowerCase().includes(searchValue)
    );
  });
  return (
    <section className="admin-customers-page">
      {" "}
      <div className="admin-customers-header">
        {" "}
        <div>
          {" "}
          <span className="admin-customers-eyebrow">
            {" "}
            CUSTOMER MANAGEMENT{" "}
          </span>{" "}
          <h1>Customers</h1>{" "}
          <p> View and manage registered customers in your store. </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="admin-customers-toolbar">
        {" "}
        <div className="admin-customer-search">
          {" "}
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />{" "}
        </div>{" "}
        <span className="admin-customer-count">
          {" "}
          {filteredCustomers.length} customers{" "}
        </span>{" "}
      </div>{" "}
      {loading && (
        <div className="admin-customers-message"> Loading customers... </div>
      )}{" "}
      {error && !loading && (
        <div className="admin-customers-error"> {error} </div>
      )}{" "}
      {!loading && !error && (
        <div className="admin-customers-panel">
          {" "}
          {filteredCustomers.length === 0 ? (
            <div className="admin-customers-empty"> No customers found. </div>
          ) : (
            <div className="admin-customers-table-wrapper">
              {" "}
              <table className="admin-customers-table">
                {" "}
                <thead>
                  {" "}
                  <tr>
                    {" "}
                    <th>ID</th> <th>Customer</th> <th>Email</th>{" "}
                    <th>Role</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody>
                  {" "}
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      {" "}
                      <td>
                        {" "}
                        <span className="admin-customer-id">
                          {" "}
                          #{customer.id}{" "}
                        </span>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-customer-name">
                          {" "}
                          {customer.name}{" "}
                        </div>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <div className="admin-customer-email">
                          {" "}
                          {customer.email}{" "}
                        </div>{" "}
                      </td>{" "}
                      <td>
                        {" "}
                        <span className="admin-customer-role">
                          {" "}
                          {customer.role}{" "}
                        </span>{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
    </section>
  );
}
export default AdminCustomers;
