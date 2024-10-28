import { useEffect, useState } from "react";
import usersService from "../services/users";
import { Table, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CustomSpinner from "../components/CustomSpinner";
import Pagination from "../components/Pagination";
import { useAuthStore, useNotificationStore } from "../stores";
import debounce from "lodash/debounce";
const LIMIT = 5;
import { formatDate } from "../services/toDate";
const AdminPage = () => {
  const navigate = useNavigate();
  const currUser = useAuthStore((state) => state.user);
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const [users, setUsers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const handleStatusChange = async (e, id) => {
    try {
      const newStatus = e.target.value;
      await usersService.status(newStatus, id);
      const updatedUsers = users.map((user) =>
        user.id == id ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      showNotification(
        "Change user status successfully",
        `User is now ${newStatus}`,
        "success"
      );
      setSearchGroup("");
      setSearchQuery("");
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
      showNotification(
        "Cannot change user status",
        Object.values(error.response.data)[0],
        "danger"
      );
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleSearchGroup = (e) => {
    setSearchGroup(e.target.value);
    setCurrentPage(1);
  };

  const debouncedFetchUsers = debounce(() => {
    usersService
      .getAll(currentPage, searchQuery, searchGroup, LIMIT)
      .then((data) => {
        setUsers(data.users);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        showNotification(
          "You're not allowed to enter this page",
          "Cannot access this page",
          "danger"
        );
        navigate('/')
      });
  }, 500);
  useEffect(() => {
    debouncedFetchUsers();
  }, [currentPage, searchQuery, searchGroup, usersService]);
  if (!users) {
    return <CustomSpinner />;
  }
  return (
    <div className='container mt-4 '>
      <div className='mb-3 d-flex mx-auto gap-2'>
        <div className='row w-100 justify-content-center'>
          {/* Search Input */}
          <div className='col-12 col-md-7 col-lg-6 mb-3'>
            <Form.Control
              type='text'
              placeholder='Search by username, full name, or email'
              value={searchQuery}
              onChange={handleSearch}
              className='custom-input'
            />
          </div>
          <div className='col-12 col-md-4 col-lg-3 mb-3'>
            <Form.Select
              value={searchGroup}
              onChange={handleSearchGroup}
              className='custom-input'
            >
              <option defaultChecked={true}>Select user status</option>
              <option value='admin'>Admin</option>
              <option value='locked'>Locked</option>
              <option value='active'>Active</option>
            </Form.Select>
          </div>
        </div>
      </div>

      <Table striped bordered hover responsive='sm'>
        <thead>
          <tr>
            <th className='d-none d-md-table-cell'>User Id</th>
            <th>User Name</th>
            <th>Full Name</th>
            <th className='d-none d-md-table-cell'>Email</th>
            <th>Status</th>
            <th className='d-none d-md-table-cell'>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className='d-none d-md-table-cell'>
                <Link to={`/user/${user.id}`} className='custom-link'>
                  {user.id}
                </Link>
              </td>
              <td>
                <Link to={`/user/${user.id}`} className='custom-link'>
                  {user.userName}
                </Link>
              </td>
              <td>
                <Link to={`/user/${user.id}`} className='custom-link'>
                  {user.fullName}
                </Link>
              </td>
              <td className='d-none d-md-table-cell'>
                <Link to={`/user/${user.id}`} className='custom-link'>
                  {user.email}
                </Link>
              </td>
              <td>
                <Form.Select
                  value={user.status}
                  onChange={(e) => handleStatusChange(e, user.id)}
                  disabled={
                    user.id === currUser.userId || user.status === "admin"
                  }
                >
                  <option value='admin'>Admin</option>
                  <option value='locked'>Locked</option>
                  <option value='active'>Active</option>
                </Form.Select>
              </td>
              <td className='d-none d-md-table-cell'>
                {formatDate(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};
export default AdminPage;
