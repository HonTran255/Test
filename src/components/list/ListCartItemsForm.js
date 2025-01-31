import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../../apis/auth';
import {
    listItemsByCart,
    deleteFromCart,
    updateCartItem,
} from '../../apis/cart';
import { totalProducts } from '../../helpers/total';
import { formatPrice } from '../../helpers/formatPrice';
import useUpdateDispatch from '../../hooks/useUpdateDispatch';
import useToggle from '../../hooks/useToggle';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';
import DropDownMenu from '../ui/DropDownMenu';
import CheckoutForm from '../item/form/CheckoutForm';

const IMG = process.env.REACT_APP_STATIC_URL;

const ListCartItems = ({ cartId = '', userId = '', onRun }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [run, setRun] = useState(false);

    const [showCheckoutFlag, toogleShowCheckoutFlag] = useToggle(false);

    const [updateDispatch] = useUpdateDispatch();
    const { _id, accessToken } = getToken();

    const [items, setItems] = useState([]);
    const [deleteItem, setDeleteItem] = useState({});
    const [totals, setTotals] = useState({
        totalPrice: 0,
        totalPromotionalPrice: 0,
        amount: 0,
    });

    const init = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        listItemsByCart(_id, accessToken, cartId)
            .then(async (data) => {
                if (data.error) setError(data.error);
                else {
                    setItems(data.items);
                    const {
                        totalPrice,
                        totalPromotionalPrice,
                    } = totalProducts(data.items);
                    setTotals({
                        totalPrice,
                        totalPromotionalPrice,
                    });
                }
                setIsLoading(false);
            })
            .catch(() => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (cartId) init();
    }, [cartId, userId, run]);

    const handleDelete = (item) => {
        if (!item) return;
        setDeleteItem(item);
        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteFromCart(_id, accessToken, deleteItem._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    updateDispatch('account', data.user);
                    setRun(!run);
                    if (onRun) onRun();
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    const handleUpdate = (value, item) => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        updateCartItem(_id, accessToken, { count: value }, item._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    updateDispatch('account', data.user);
                    setRun(!run);
                    if (onRun) onRun();
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {success && <Success msg={success} />}
            {isConfirming && (
                <ConfirmDialog
                    title="Xóa"
                    color="danger"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            {items.map((item, index) => (
                <div
                    key={index}
                    className="d-flex align-items-center mb-2 res-flex-column"
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '300px',
                            maxWidth: '100%',
                            height: '200px',
                            maxHeight: '66.6667%',
                        }}
                    >
                        <img
                            src={
                                item.productId &&
                                IMG + item.productId.listImages[0]
                            }
                            alt={item.productId && item.productId.name}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: '0',
                                left: '0',
                                objectFit: 'cover',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div className="flex-grow-1 d-flex flex-wrap justify-content-between align-items-center ms-4 res-m-0">
                        <div className="">
                            <Link
                                className="text-reset text-decoration-none link-hover d-block mt-1"
                                to={`/product/${
                                    item.productId && item.productId._id
                                }`}
                                title={item.productId && item.productId.name}
                            >
                                <h3 className="fs-5">
                                    {item.productId && item.productId.name}
                                </h3>
                            </Link>

                            <div className="mt-2">
                                <p className="text-decoration-line-through text-muted">
                                    {item.productId &&
                                        item.productId.price &&
                                        formatPrice(
                                            item.productId &&
                                                item.productId.price
                                                    .$numberDecimal,
                                        )}{' '}
                                    VND
                                </p>

                                <h4 className=" text-primary fs-5">
                                    {item.productId &&
                                        item.productId.promotionalPrice &&
                                        formatPrice(
                                            item.productId &&
                                                item.productId.promotionalPrice
                                                    .$numberDecimal,
                                        )}{' '}
                                    VND x {item.count}
                                </h4>
                            </div>

                            {item.productId && !item.productId.isActive && (
                                <Error msg="The product is banned by GoodDeal!" />
                            )}

                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.quantity <= 0 && (
                                    <Error msg="The product is sold out, please delete it from your cart, you can continue with others!" />
                                )}

                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.quantity > 0 &&
                                item.productId.quantity < item.count && (
                                    <Error
                                        msg={`Only ${item.productId.quantity} products left, please update the count!`}
                                    />
                                )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center my-2">
                            {item.productId &&
                                item.productId.isActive &&
                                item.productId.quantity > 0 && (
                                    <div className="me-2">
                                        <DropDownMenu
                                            listItem={
                                                item.productId &&
                                                item.productId.quantity &&
                                                Array.from(
                                                    {
                                                        length: item.productId
                                                            .quantity,
                                                    },
                                                    (_, i) => {
                                                        return {
                                                            value: i + 1,
                                                            label: i + 1,
                                                        };
                                                    },
                                                )
                                            }
                                            resetDefault={false}
                                            value={item.count}
                                            setValue={(value) =>
                                                handleUpdate(value, item)
                                            }
                                            borderBtn={true}
                                        />
                                    </div>
                                )}

                            <button
                                type="button"
                                className="btn btn-outline-danger ripple"
                                onClick={() => handleDelete(item)}
                            >
                                <i className="fas fa-trash-alt"></i>
                                <span className="ms-2 res-hide">Xóa</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {items.reduce(
                (prev, item) =>
                    prev &&
                    item.productId &&
                    item.productId.isActive &&
                    item.productId.quantity > 0 &&
                    item.productId.quantity >= item.count,
                true,
            ) && (
                <div className="d-flex flex-wrap justify-content-end align-items-center mt-4 pt-1 border-top border-primary res-flex-justify-between">
                    {!showCheckoutFlag && (
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="me-4">
                                <p className="text-decoration-line-through text-muted">
                                    {formatPrice(totals.totalPrice)} VND
                                </p>

                                <h4 className=" text-primary fs-5">
                                    {formatPrice(totals.totalPromotionalPrice)}{' '}
                                    VND
                                </h4>
                            </div>
                        </div>
                    )}

                    <button
                        className={`btn ${
                            showCheckoutFlag
                                ? 'btn-primary'
                                : 'btn-outline-primary'
                        } ripple`}
                        type="button"
                        onClick={toogleShowCheckoutFlag}
                    >
                        Đặt hàng
                    </button>
                </div>
            )}

            {showCheckoutFlag && (
                <div className="mx-2 mt-1">
                    <CheckoutForm
                        cartId={cartId}
                        userId={userId}
                        items={items}
                    />
                </div>
            )}
        </div>
    );
};

export default ListCartItems;
