import { useEffect, useState } from "react";
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState('');

  const { doRequest, errors } = useRequest({
    body: {
      orderId: order.id,
    },
    method: 'post',
    url: '/api/payments',
    onSuccess: payment => Router.push('/orders')
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    const interval = setInterval(() => {
      findTimeLeft();
    }, 1000);

    findTimeLeft();

    return () => {
      clearInterval(interval); 
    }
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired!</div>;
  }



  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51HPYgyKjRGcJaoviBFJkMSVE0XG4zFXMICEWmyQOzSSVVRL8ABoPb0KTvrFgbiH2PAu22O7R6XpYAXARK0pFtATb00kM6Gq8o8'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      { errors }
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);  

  return { order: data };
}

export default OrderShow;