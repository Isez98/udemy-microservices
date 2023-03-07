import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td className="d-flex justify-content-center">
          <nav className="navbar navbar-light">
            <div className="">
              <div className="nav">
                <div className="nav-item">
                  <Link
                    href="/tickets/[ticketId]"
                    as={`/tickets/${ticket.id}`}
                    className="nav-link text-center"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </td>
      </tr>
    )
  })
  return (
    <div className="p-3">
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th className="text-center">Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage
