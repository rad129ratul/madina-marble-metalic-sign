import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, useUpdateOrderStatusMutation } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [updateOrderStatus, { isLoading: loadingUpdate }] = useUpdateOrderStatusMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const updateStatusHandler = async (status) => {
    try {
      await updateOrderStatus({ orderId, status });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your order request is in process, we will reach you soon';
      case 'processing':
        return 'Your order is being processed';
      case 'completed':
        return 'Your order has been completed';
      case 'cancelled':
        return 'Your order has been cancelled';
      default:
        return 'Order status unknown';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message}</Message>
  ) : (
    <>
      <h1>Order Request {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Request Status</h2>
              <Message variant={getStatusVariant(order.requestStatus)}>
                {getStatusMessage(order.requestStatus)}
              </Message>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price}<strong style={{fontSize: '1.1em'}}>৳</strong> = {item.qty * item.price}<strong style={{fontSize: '1.1em'}}>৳</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{order.itemsPrice}<strong style={{fontSize: '1.1em'}}>৳</strong></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{order.totalPrice}<strong style={{fontSize: '1.1em'}}>৳</strong></Col>
                </Row>
              </ListGroup.Item>
              
              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  <h6>Update Status:</h6>
                  <Button 
                    className='btn-sm me-2 mb-2' 
                    variant='warning'
                    onClick={() => updateStatusHandler('pending')}
                    disabled={loadingUpdate}
                  >
                    Pending
                  </Button>
                  <Button 
                    className='btn-sm me-2 mb-2' 
                    variant='info'
                    onClick={() => updateStatusHandler('processing')}
                    disabled={loadingUpdate}
                  >
                    Processing
                  </Button>
                  <Button 
                    className='btn-sm me-2 mb-2' 
                    variant='success'
                    onClick={() => updateStatusHandler('completed')}
                    disabled={loadingUpdate}
                  >
                    Completed
                  </Button>
                  <Button 
                    className='btn-sm me-2 mb-2' 
                    variant='danger'
                    onClick={() => updateStatusHandler('cancelled')}
                    disabled={loadingUpdate}
                  >
                    Cancelled
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;