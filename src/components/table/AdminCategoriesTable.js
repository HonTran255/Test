import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../apis/auth';
import {
    listCategories,
    deleteCategory,
    restoreCategory,
} from '../../apis/category';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import SortByButton from './sub/SortByButton';
import DeletedLabel from '../label/DeletedLabel';
import CategorySmallCard from '../card/CategorySmallCard';
import Loading from '../ui/Loading';
import Error from '../ui/Error';
import Success from '../ui/Success';
import ConfirmDialog from '../ui/ConfirmDialog';

const IMG = process.env.REACT_APP_STATIC_URL;

const AdminCateroriesTable = ({ heading = 'Category' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirming1, setIsConfirming1] = useState(false);
    const [run, setRun] = useState(false);

    const [deletedCategory, setDeletedCategory] = useState({});
    const [restoredCategory, setRestoredCategory] = useState({});

    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        size: 0,
    });
    const [filter, setFilter] = useState({
        search: '',
        categoryId: '',
        sortBy: 'categoryId',
        order: 'asc',
        limit: 6,
        page: 1,
    });

    const { _id, accessToken } = getToken();

    const init = () => {
        setError('');
        setIsLoading(true);
        listCategories(_id, accessToken, filter)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setCategories(data.categories);
                    setPagination({
                        size: data.size,
                        pageCurrent: data.filter.pageCurrent,
                        pageCount: data.filter.pageCount,
                    });
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        init();
    }, [filter, run]);

    const handleChangeKeyword = (keyword) => {
        setFilter({
            ...filter,
            search: keyword,
            page: 1,
        });
    };

    const handleChangePage = (newPage) => {
        setFilter({
            ...filter,
            page: newPage,
        });
    };

    const handleSetSortBy = (order, sortBy) => {
        setFilter({
            ...filter,
            sortBy,
            order,
        });
    };

    const handleDeleteCategory = (category) => {
        setDeletedCategory(category);
        setIsConfirming(true);
    };

    const handleRestoreCategory = (category) => {
        setRestoredCategory(category);
        setIsConfirming1(true);
    };

    const onSubmitDelete = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        deleteCategory(_id, accessToken, deletedCategory._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setRun(!run);
                }
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Server Error');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    const onSubmitRestore = () => {
        setError('');
        setSuccess('');
        setIsLoading(true);
        restoreCategory(_id, accessToken, restoredCategory._id)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                    setSuccess(data.success);
                    setRun(!run);
                }
                setIsLoading(false);
                setTimeout(() => {
                    setSuccess('');
                    setError('');
                }, 3000);
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
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Delete category"
                    message={
                        <span>
                           Bạn muốn xóa?
                            <CategorySmallCard category={deletedCategory} />
                        </span>
                    }
                    color="danger"
                    onSubmit={onSubmitDelete}
                    onClose={() => setIsConfirming(false)}
                />
            )}
            {isConfirming1 && (
                <ConfirmDialog
                    title="Restore category"
                    message={
                        <span>
                            Bạn muốn hoàn lại?
                            <CategorySmallCard category={restoredCategory} />
                        </span>
                    }
                    onSubmit={onSubmitRestore}
                    onClose={() => setIsConfirming1(false)}
                />
            )}

            {heading && (
                <h4 className="text-center text-uppercase">{heading}</h4>
            )}

            {isloading && <Loading />}
            {error && <Error msg={error} />}
            {success && <Success msg={success} />}

            <div className="d-flex justify-content-between align-items-end">
                <div className="d-flex align-items-center">
                    <SearchInput onChange={handleChangeKeyword} />
                    <div className="ms-2">
                        <Link
                            type="button"
                            className="btn btn-primary ripple text-nowrap"
                            to="/admin/category/createNewCategory"
                        >
                            <i className="fas fa-plus-circle"></i>
                            <span className="ms-2 res-hide">Add category</span>
                        </Link>
                    </div>
                </div>
                <span className="me-2 text-nowrap res-hide">
                    {pagination.size || 0} results
                </span>
            </div>

            <div className="table-scroll my-2">
                <table className="table table-hover table-sm align-middle text-center">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Name"
                                    sortBy="name"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>
                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Image"
                                    sortBy="image"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Parent category"
                                    sortBy="categoryId"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col">
                                <SortByButton
                                    currentOrder={filter.order}
                                    currentSortBy={filter.sortBy}
                                    title="Status"
                                    sortBy="isDeleted"
                                    onSet={(order, sortBy) =>
                                        handleSetSortBy(order, sortBy)
                                    }
                                />
                            </th>

                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {index +
                                        1 +
                                        (filter.page - 1) * filter.limit}
                                </th>
                                <td>{category.name}</td>
                                <td>
                                    <div
                                        style={{
                                            position: 'relative',
                                            margin: 'auto',
                                            paddingBottom: '72px',
                                            width: '72px',
                                            height: '0',
                                        }}
                                    >
                                        <img
                                            src={IMG + category.image}
                                            alt={category.name}
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                top: '0',
                                                left: '0',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    {category.categoryId ? (
                                        <CategorySmallCard
                                            category={category.categoryId}
                                        />
                                    ) : (
                                        <span>No parent category</span>
                                    )}
                                </td>
                                <td>
                                    {category.isDeleted && (
                                        <small>
                                            <DeletedLabel />
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <Link
                                        type="button"
                                        className="btn btn-primary ripple me-2"
                                        to={`/admin/category/editCategory/${category._id}`}
                                    >
                                        <i className="fas fa-pen"></i>
                                        <span className="ms-2 res-hide">
                                            Edit
                                        </span>
                                    </Link>

                                    {!category.isDeleted ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger ripple cus-tooltip"
                                            onClick={() =>
                                                handleDeleteCategory(category)
                                            }
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                            <span className="ms-2 res-hide">
                                                Del
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary ripple cus-tooltip"
                                            onClick={() =>
                                                handleRestoreCategory(category)
                                            }
                                        >
                                            <i className="fas fa-trash-restore-alt"></i>
                                            <span className="ms-2 res-hide">
                                                Res
                                            </span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.size != 0 && (
                <Pagination
                    pagination={pagination}
                    onChangePage={handleChangePage}
                />
            )}
        </div>
    );
};

export default AdminCateroriesTable;
