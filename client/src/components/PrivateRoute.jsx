import { Outlet, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function PrivateRoute({ auth }) {
    return auth.Token ? <Outlet /> : <Navigate to="/" />
}
PrivateRoute.propTypes = {
    auth: PropTypes.shape({
        Token: PropTypes.string,
    }).isRequired,
}
export default PrivateRoute