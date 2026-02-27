import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "../components/table/Table";
import Modal from "../components/modal/Modal";
import { Icon } from "@iconify/react";
import { createUser, updateUser, deleteUser } from "../redux/actions/User";

const Admin = () => {
  const dispatch = useDispatch();

  // safer localStorage parsing
  const userLogin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("profile"));
    } catch {
      return null;
    }
  }, []);

  const isAdmin = userLogin?.result?.user_isAdmin === true;

  const adminTableHead = isAdmin
    ? ["name", "email", "phone", "address", "action"]
    : ["name", "email", "phone", "address"];

  const users = useSelector((state) => state.User || []);
  const adminUsers = useMemo(
    () => users.filter((u) => u.user_isAdmin === true),
    [users]
  );

  const [userCurrId, setUserCurrId] = useState(null);
  const [show, setShow] = useState(false);

  const [userFormdata, setUserFormdata] = useState({
    user_nama: "",
    user_email: "",
    user_username: "",
    user_phonenum: "",
    user_address: "",
    user_pwd: "",
    user_isAdmin: true,
  });

  const handleEditClick = (item) => {
    setUserCurrId(item.id);
    setUserFormdata({
      user_nama: item.user_nama || "",
      user_email: item.user_email || "",
      user_username: item.user_username || "",
      user_phonenum: item.user_phonenum || "",
      user_address: item.user_address || "",
      user_pwd: "",
      user_isAdmin: true,
    });
    setShow(true);
  };

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
  }, [show]);

  const clearForm = () => {
    setUserCurrId(null);
    setUserFormdata({
      user_nama: "",
      user_email: "",
      user_username: "",
      user_phonenum: "",
      user_address: "",
      user_pwd: "",
      user_isAdmin: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userCurrId) {
      dispatch(updateUser(userCurrId, userFormdata));
    } else {
      dispatch(createUser(userFormdata));
    }

    clearForm();
    setShow(false);
  };

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td className="capitalize">{item.user_nama}</td>
      <td>{item.user_email}</td>
      <td>+62 {item.user_phonenum}</td>
      <td className="capitalize">{item.user_address}</td>

      {isAdmin && (
        <td>
          <button
            className="btn-edit"
            onClick={() => handleEditClick(item)}
          >
            Edit
          </button>
          {" / "}
          <button
            className="btn-delete"
            onClick={() => dispatch(deleteUser(item.id))}
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );

  return (
    <div>
      <h2 className="page-header">
        <Icon icon="bx:bxs-user" /> Admin
      </h2>

      <div className="row">
        {isAdmin && (
          <div className="col-3">
            <div className="card">
              <button
                className="btn-primary flex"
                onClick={() => {
                  clearForm();
                  setShow(true);
                }}
              >
                Add New
              </button>

              <Modal
                title={
                  <h1>
                    {userCurrId ? "Edit Admin" : "Add Admin"}
                  </h1>
                }
                show={show}
                close={() => setShow(false)}
                content={
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      <input
                        type="text"
                        placeholder="Name"
                        value={userFormdata.user_nama}
                        onChange={(e) =>
                          setUserFormdata({
                            ...userFormdata,
                            user_nama: e.target.value,
                          })
                        }
                      />

                      <input
                        type="email"
                        placeholder="Email"
                        value={userFormdata.user_email}
                        readOnly={!!userCurrId}
                        onChange={(e) =>
                          setUserFormdata({
                            ...userFormdata,
                            user_email: e.target.value,
                          })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Username"
                        value={userFormdata.user_username}
                        onChange={(e) =>
                          setUserFormdata({
                            ...userFormdata,
                            user_username: e.target.value,
                          })
                        }
                      />

                      <input
                        type="number"
                        placeholder="Phone Number"
                        value={userFormdata.user_phonenum}
                        onChange={(e) =>
                          setUserFormdata({
                            ...userFormdata,
                            user_phonenum: e.target.value,
                          })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Address"
                        value={userFormdata.user_address}
                        onChange={(e) =>
                          setUserFormdata({
                            ...userFormdata,
                            user_address: e.target.value,
                          })
                        }
                      />

                      {!userCurrId && (
                        <input
                          type="password"
                          placeholder="Password"
                          value={userFormdata.user_pwd}
                          onChange={(e) =>
                            setUserFormdata({
                              ...userFormdata,
                              user_pwd: e.target.value,
                            })
                          }
                        />
                      )}
                    </div>

                    <div className="modal-footer">
                      <button type="submit" className="btn-secondary">
                        Submit
                      </button>
                    </div>
                  </form>
                }
              />
            </div>
          </div>
        )}

        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit="5"
                headData={adminTableHead}
                renderHead={renderHead}
                bodyData={adminUsers}
                renderBody={renderBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;