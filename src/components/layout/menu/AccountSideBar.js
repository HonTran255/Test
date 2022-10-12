import { Link, useLocation } from 'react-router-dom';
import Avatar from '../../image/Avatar';

const AccountSideBar = ({ user = {} }) => {
    const path = useLocation().pathname.split('/')[2];
    return (
        <div className="sticky-sidebar d-flex flex-column flex-shrink-0 p-3 shadow bg-body rounded res-account-sidebar">
            <ul className="nav nav-pills flex-column mb-auto">
                <div className="mx-auto mb-4 res-hide-lg">
                    <Avatar
                        avatar={user.avatar}
                        name={user.firstname + ' ' + user.lastname}
                        alt={user.firstname + ' ' + user.lastname}
                    />
                </div>

                <hr className="res-hide-lg" />

                <li className="nav-item">
                    <Link
                        to="/account/profile"
                        className={`nav-link cus-sidebar-item ripple link-dark ${
                            path === 'profile' ? 'active' : ''
                        }`}
                    >
                        <i className="fas fa-user-circle"></i>
                        <span className="ms-3 res-hide-xl">Thông tin cá nhân</span>
                        <span className="ms-3 d-none res-dis-inline-xl res-hide-lg">
                            Thông tin
                        </span>
                    </Link>
                </li>

                {user.role === 'user' && (
                    <li className="nav-item">
                        <Link
                            to="/account/purchase"
                            className={`nav-link cus-sidebar-item ripple link-dark ${
                                path === 'purchase' ? 'active' : ''
                            }`}
                        >
                            <i className="fas fa-shopping-bag"></i>
                            <span className="ms-3 res-hide-xl">
                                Lịch sử mua hàng
                            </span>
                            <span className="ms-3 d-none res-dis-inline-xl res-hide-lg">
                                Lịch sử
                            </span>
                        </Link>
                    </li>
                )}

                {user.role === 'user' && (
                    <li className="nav-item">
                        <Link
                            to="/account/addresses"
                            className={`nav-link cus-sidebar-item ripple link-dark ${
                                path === 'addresses' ? 'active' : ''
                            }`}
                        >
                            <i className="fas fa-map-marker-alt"></i>
                            <span className="ms-3 res-hide-xl">
                                Địa chỉ của bạn
                            </span>
                            <span className="ms-3 d-none res-dis-inline-xl res-hide-lg">
                                Địa chỉ
                            </span>
                        </Link>
                    </li>
                )}

                <li className="nav-item">
                    <Link
                        to="/account/following"
                        className={`nav-link cus-sidebar-item cus-sidebar-item--pink ripple link-pink ${
                            path === 'following' ? 'active-pink' : ''
                        }`}
                    >
                        <i className="fas fa-heart"></i>
                        <span className="ms-3 res-hide-lg">Sản phẩm yêu thích</span>
                    </Link>
                </li>

            </ul>
        </div>
    );
};

export default AccountSideBar;
