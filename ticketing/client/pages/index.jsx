import React from 'react';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketsList}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
}

// LandingPage.getInitialProps = async (context) => {
//   // let url = '/api/users/currentuser';
//   // let headers = {};
//   // if (typeof window === 'undefined') {
//   //   url = 'http://ingress-nginx-controller.kube-system.svc.cluster.local/api/users/currentuser';
//   //   // headers['Host'] = 'ticketing.dev';
//   //   // headers['Cookie'] = req.headers['Cookie'];
//   //   headers = req.headers;
//   // }

//   const { data } = await buildClient(context).get('/api/users/currentuser');
//   return data;

// };

export default LandingPage;