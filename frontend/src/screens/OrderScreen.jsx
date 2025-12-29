import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../actions/orderActions";
import { Table, Container, Alert, Badge, Spinner, Button, Offcanvas, Dropdown } from "react-bootstrap";
import './OrderScreen.css';

function OrderScreen() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowSidebar(true);
  };

  const handleStatusUpdate = (id, status) => {
    dispatch(updateOrderStatus(id, status));
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  return (
    <Container className="py-5-custom order-container">
      <h2 className="mb-4 fw-bold">My Orders</h2>

      {orders.length === 0 ? (
        <Alert variant="info">No orders yet</Alert>
      ) : (
        <div className="table-responsive shadow-sm rounded-3 overflow-hidden">
          <Table striped bordered hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.created_at ? order.created_at.substring(0, 10) : 'N/A'}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Badge
                        bg={order.status === 'PAID' ? 'success' : order.status === 'DELIVERED' ? 'primary' : order.status === 'CANCELLED' ? 'danger' : 'warning'}
                        text={order.status === 'PENDING' ? 'dark' : 'light'}
                        className="me-2"
                      >
                        {order.status}
                      </Badge>

                      <Dropdown>
                        <Dropdown.Toggle variant="link" size="sm" className="p-0 text-muted no-caret border-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'PENDING')}>Pending</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}>Cancel</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}>Delivered</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(order)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Sidebar for Order Details */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Order Details #{selectedOrder?.id}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedOrder && (
            <div>
              <h5 className="fw-bold mb-3">Shipping Address</h5>
              <p className="text-muted">
                {selectedOrder.address}<br />
                {selectedOrder.city}, {selectedOrder.postal_code}<br />
                {selectedOrder.country}
              </p>

              <h5 className="fw-bold mt-4 mb-3">Order Items</h5>
              {/* Assuming order items are hydrated or we fetched details. 
                        If MyOrders view returns items, great. If not, we might need to fetch. 
                        Serializer verification: OrderSerializer includes 'items'. 
                    */}
              <div className="list-group list-group-flush">
                {selectedOrder.items && selectedOrder.items.map(item => (
                  <div key={item.id} className="list-group-item px-0 py-2">
                    <div className="d-flex justify-content-between">
                      <span>{item.quantity} x {item.product.name}</span>
                      <span className="fw-bold">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold fs-5 text-primary">₹{selectedOrder.total_price}</span>
                </div>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default OrderScreen;
