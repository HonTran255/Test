import { useState } from 'react';
import { getToken } from '../../apis/auth';
import { userCancelOrder } from '../../apis/order';
import { calcTime } from '../../helpers/calcTime';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import ConfirmDialog from '../ui/ConfirmDialog';

const UserCancelOrderButton = ({
    orderId = '',
    status = '',
    detail = true,
    createdAt = '',
    onRun,
}) => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const { _id, accessToken } = getToken();

    const handleCancelOrder = () => {
        setIsConfirming(true);
    };

    const onSubmit = () => {
        setError('');
        setIsLoading(true);
        const value = { status: '4' };
        userCancelOrder(_id, accessToken, value, orderId)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                } else {
                    if (onRun) onRun();
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="position-relative">
            {isLoading && <Loading />}
            {error && <Error msg={error} />}
            {isConfirming && (
                <ConfirmDialog
                    title="Hủy đơn hàng"
                    color="danger"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}
            <div className="d-inline-block cus-tooltip">
                <button
                    type="button"
                    className="btn btn-outline-danger ripple"
                    disabled={
                        status !== '0' || calcTime(createdAt) >= 1
                    }
                    onClick={handleCancelOrder}
                >
                    <i className="fas fa-ban"></i>
                    {detail && <span className="ms-2">Hủy đơn</span>}
                </button>
            </div>

            {(!status === '0' || calcTime(createdAt) >= 1) && (
                <small className="cus-tooltip-msg">Không thể hủy đơn</small>
            )}
        </div>
    );
};

export default UserCancelOrderButton;
